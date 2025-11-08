import 'package:flutter/material.dart';
import 'package:xterm/xterm.dart';
import 'package:xterm/flutter.dart';
import '../models/terminal_session.dart';

/// Widget that displays a single terminal session
class TerminalView extends StatefulWidget {
  final TerminalSession session;
  final VoidCallback? onClose;

  const TerminalView({
    Key? key,
    required this.session,
    this.onClose,
  }) : super(key: key);

  @override
  State<TerminalView> createState() => _TerminalViewState();
}

class _TerminalViewState extends State<TerminalView> {
  final TerminalController _terminalController = TerminalController();
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _focusNode.requestFocus();
  }

  @override
  void dispose() {
    _focusNode.dispose();
    _terminalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _focusNode.requestFocus(),
      child: Container(
        color: Colors.black,
        child: TerminalView(
          widget.session.terminal,
          controller: _terminalController,
          autofocus: true,
          focusNode: _focusNode,
          backgroundOpacity: 1.0,
          // Terminal theme
          theme: TerminalTheme(
            cursor: const Color(0XFFAEAFAD),
            selection: const Color(0XFFFFFF40),
            foreground: const Color(0XFFFFFFFF),
            background: const Color(0XFF1E1E1E),
            black: const Color(0XFF000000),
            red: const Color(0XFFCD3131),
            green: const Color(0XFF0DBC79),
            yellow: const Color(0XFFE5E510),
            blue: const Color(0XFF2472C8),
            magenta: const Color(0XFFBC3FBC),
            cyan: const Color(0XFF11A8CD),
            white: const Color(0XFFE5E5E5),
            brightBlack: const Color(0XFF666666),
            brightRed: const Color(0XFFF14C4C),
            brightGreen: const Color(0XFF23D18B),
            brightYellow: const Color(0XFFF5F543),
            brightBlue: const Color(0XFF3B8EEA),
            brightMagenta: const Color(0XFFD670D6),
            brightCyan: const Color(0XFF29B8DB),
            brightWhite: const Color(0XFFFFFFFF),
            searchHitBackground: const Color(0XFFFFFF2B),
            searchHitBackgroundCurrent: const Color(0XFF31FF26),
            searchHitForeground: const Color(0XFF000000),
          ),
        ),
      ),
    );
  }
}

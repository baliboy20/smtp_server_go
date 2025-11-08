import 'package:flutter_pty/flutter_pty.dart';
import 'package:xterm/xterm.dart';

/// Represents a single terminal session with its own PTY and terminal emulator
class TerminalSession {
  final String id;
  final Terminal terminal;
  final Pty pty;
  String title;
  bool isActive;

  TerminalSession({
    required this.id,
    required this.terminal,
    required this.pty,
    this.title = 'Terminal',
    this.isActive = false,
  });

  /// Cleanup resources when closing the terminal
  void dispose() {
    terminal.dispose();
    pty.kill();
  }

  /// Write data to the PTY (from user input)
  void write(String data) {
    pty.write(data);
  }

  /// Resize the terminal
  void resize(int cols, int rows) {
    pty.resize(cols, rows);
  }
}

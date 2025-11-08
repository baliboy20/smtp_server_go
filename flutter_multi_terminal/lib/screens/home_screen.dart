import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../widgets/terminal_tabs.dart';

/// Main home screen of the application
class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Shortcuts(
      shortcuts: <LogicalKeySet, Intent>{
        // Cmd+T for new terminal
        LogicalKeySet(
          LogicalKeyboardKey.meta,
          LogicalKeyboardKey.keyT,
        ): const NewTerminalIntent(),
        // Cmd+W for close terminal
        LogicalKeySet(
          LogicalKeyboardKey.meta,
          LogicalKeyboardKey.keyW,
        ): const CloseTerminalIntent(),
      },
      child: Actions(
        actions: <Type, Action<Intent>>{
          NewTerminalIntent: NewTerminalAction(),
          CloseTerminalIntent: CloseTerminalAction(),
        },
        child: const Focus(
          autofocus: true,
          child: TerminalTabs(),
        ),
      ),
    );
  }
}

// Intent for creating a new terminal
class NewTerminalIntent extends Intent {
  const NewTerminalIntent();
}

// Intent for closing current terminal
class CloseTerminalIntent extends Intent {
  const CloseTerminalIntent();
}

// Action for new terminal
class NewTerminalAction extends Action<NewTerminalIntent> {
  @override
  void invoke(NewTerminalIntent intent) {
    // This will be handled by the TerminalTabs widget
    // Implementation can be improved with proper state management
  }
}

// Action for close terminal
class CloseTerminalAction extends Action<CloseTerminalIntent> {
  @override
  void invoke(CloseTerminalIntent intent) {
    // This will be handled by the TerminalTabs widget
    // Implementation can be improved with proper state management
  }
}

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_pty/flutter_pty.dart';
import 'package:xterm/xterm.dart';
import '../models/terminal_session.dart';

/// Service for managing PTY sessions and terminal emulators
class PtyService {
  final List<TerminalSession> _sessions = [];
  int _sessionCounter = 0;

  List<TerminalSession> get sessions => List.unmodifiable(_sessions);

  /// Create a new terminal session
  Future<TerminalSession> createSession({
    String? workingDirectory,
    Map<String, String>? environment,
  }) async {
    // Create a new terminal emulator instance
    final terminal = Terminal(
      maxLines: 10000,
    );

    // Determine the shell to use
    final shell = Platform.environment['SHELL'] ?? '/bin/zsh';

    // Set up environment variables
    final env = <String, String>{
      'TERM': 'xterm-256color',
      'HOME': Platform.environment['HOME'] ?? '',
      'USER': Platform.environment['USER'] ?? '',
      'PATH': Platform.environment['PATH'] ?? '',
      ...?environment,
    };

    // Create PTY instance
    final pty = Pty.start(
      shell,
      arguments: ['-l'], // Login shell
      workingDirectory: workingDirectory ?? Platform.environment['HOME'],
      environment: env,
    );

    // Create session
    final session = TerminalSession(
      id: 'terminal_${_sessionCounter++}',
      terminal: terminal,
      pty: pty,
      title: 'Terminal ${_sessionCounter}',
    );

    // Connect PTY output to terminal
    pty.output
        .cast<List<int>>()
        .transform(Utf8Decoder())
        .listen(terminal.write);

    // Connect terminal input to PTY
    terminal.onOutput = (data) {
      pty.write(const Utf8Encoder().convert(data));
    };

    // Listen for terminal resize events
    terminal.onResize = (width, height, pixelWidth, pixelHeight) {
      pty.resize(width, height);
    };

    // Monitor PTY exit
    pty.exitCode.then((exitCode) {
      print('Terminal ${session.id} exited with code $exitCode');
      removeSession(session.id);
    });

    _sessions.add(session);
    return session;
  }

  /// Get a session by ID
  TerminalSession? getSession(String id) {
    try {
      return _sessions.firstWhere((s) => s.id == id);
    } catch (e) {
      return null;
    }
  }

  /// Remove a session
  void removeSession(String id) {
    final session = getSession(id);
    if (session != null) {
      session.dispose();
      _sessions.remove(session);
    }
  }

  /// Close all sessions
  void closeAll() {
    for (final session in _sessions) {
      session.dispose();
    }
    _sessions.clear();
  }

  /// Get active session
  TerminalSession? get activeSession {
    try {
      return _sessions.firstWhere((s) => s.isActive);
    } catch (e) {
      return null;
    }
  }

  /// Set active session
  void setActiveSession(String id) {
    for (final session in _sessions) {
      session.isActive = session.id == id;
    }
  }
}

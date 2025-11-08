# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Flutter Application                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              UI Layer (Flutter Widgets)              │   │
│  │                                                       │   │
│  │  ┌────────────────┐  ┌─────────────────────────┐   │   │
│  │  │  HomeScreen    │  │   Terminal Tabs Widget  │   │   │
│  │  │  - Shortcuts   │  │   - Tab Management      │   │   │
│  │  │  - Actions     │  │   - Session Switching   │   │   │
│  │  └────────────────┘  └─────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │        Terminal View Widget (per tab)        │   │   │
│  │  │  - TerminalView from xterm package          │   │   │
│  │  │  - Focus management                          │   │   │
│  │  │  - Theme configuration                       │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↕                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Business Logic Layer (Services)             │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │           PtyService (Singleton)             │   │   │
│  │  │  - Session creation & management             │   │   │
│  │  │  - Process lifecycle                         │   │   │
│  │  │  - I/O bridging                              │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↕                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Data Layer (Models & State)                 │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │        TerminalSession Model                 │   │   │
│  │  │  - Terminal emulator instance                │   │   │
│  │  │  - PTY process instance                      │   │   │
│  │  │  - Session metadata                          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Package Layer (Dependencies)                    │
│                                                               │
│  ┌──────────────────┐  ┌────────────────┐                   │
│  │  xterm package   │  │ flutter_pty    │                   │
│  │  - Terminal      │  │ - Pty.start()  │                   │
│  │  - TerminalView  │  │ - I/O streams  │                   │
│  │  - ANSI parsing  │  │ - Process mgmt │                   │
│  └──────────────────┘  └────────────────┘                   │
│                                                               │
│  ┌──────────────────┐  ┌────────────────┐                   │
│  │ window_manager   │  │ path_provider  │                   │
│  │ - Window control │  │ - File paths   │                   │
│  └──────────────────┘  └────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Native Platform Layer                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              macOS System (Darwin)                    │   │
│  │                                                        │   │
│  │  - PTY devices (/dev/ttys*)                           │   │
│  │  - Shell processes (/bin/zsh, /bin/bash)             │   │
│  │  - File system (HFS+, APFS)                           │   │
│  │  - Process management (launchd, fork/exec)            │   │
│  │  - Entitlements & App Sandbox                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### UI Layer

#### HomeScreen (`lib/screens/home_screen.dart`)
- Root widget of the application
- Manages keyboard shortcuts via `Shortcuts` and `Actions` widgets
- Provides global app-level actions (Cmd+T, Cmd+W)

#### TerminalTabs (`lib/widgets/terminal_tabs.dart`)
- Container for multiple terminal sessions
- Uses `TabController` for tab management
- Handles creation and destruction of terminal tabs
- Manages active tab state
- Provides UI for:
  - Tab bar with closeable tabs
  - New terminal button (+)
  - Empty state when no terminals

#### TerminalView (`lib/widgets/terminal_view.dart`)
- Displays a single terminal session
- Wraps the `xterm` package's `TerminalView` widget
- Manages focus for keyboard input
- Applies custom theme (colors, fonts)
- Handles terminal-specific gestures

### Business Logic Layer

#### PtyService (`lib/services/pty_service.dart`)
**Responsibilities:**
- Create new terminal sessions
- Manage session lifecycle
- Bridge I/O between Terminal and PTY
- Handle process exit events
- Track active sessions
- Provide session lookup

**Key Methods:**
- `createSession()` - Creates new terminal with PTY
- `getSession(id)` - Retrieves session by ID
- `removeSession(id)` - Cleans up and removes session
- `closeAll()` - Cleanup all sessions
- `setActiveSession(id)` - Sets the focused session

**Data Flow:**
```
User Input → Terminal.onOutput → UTF8 Encoder → PTY.write()
                                                      ↓
                                                Shell Process
                                                      ↓
PTY.output → UTF8 Decoder → Terminal.write() → Display
```

### Data Layer

#### TerminalSession (`lib/models/terminal_session.dart`)
**Properties:**
- `id` - Unique identifier
- `terminal` - xterm Terminal instance
- `pty` - flutter_pty Pty instance
- `title` - Display name for tab
- `isActive` - Focus state

**Methods:**
- `dispose()` - Cleanup resources
- `write(data)` - Send input to PTY
- `resize(cols, rows)` - Resize terminal

## Data Flow

### Session Creation Flow

```
1. User clicks "+" or presses Cmd+T
   ↓
2. TerminalTabs._createNewTerminal()
   ↓
3. PtyService.createSession()
   ↓
4. Create Terminal instance (xterm)
   ↓
5. Create Pty instance (flutter_pty)
   ↓
6. Connect I/O streams:
   - pty.output → terminal.write
   - terminal.onOutput → pty.write
   ↓
7. Create TerminalSession model
   ↓
8. Add to PtyService._sessions list
   ↓
9. Update TabController
   ↓
10. Render new tab in UI
```

### User Input Flow

```
1. User types in terminal
   ↓
2. TerminalView captures keyboard input
   ↓
3. xterm Terminal processes input
   ↓
4. Terminal.onOutput callback fires
   ↓
5. Convert string to UTF-8 bytes
   ↓
6. Pty.write(bytes)
   ↓
7. Write to PTY device (/dev/ttys*)
   ↓
8. Shell process receives input
   ↓
9. Shell processes command
   ↓
10. Shell writes output to PTY
    ↓
11. Pty.output stream emits data
    ↓
12. UTF-8 decoder converts to string
    ↓
13. Terminal.write(string)
    ↓
14. xterm parses ANSI codes
    ↓
15. TerminalView renders output
    ↓
16. User sees result
```

### Terminal Resize Flow

```
1. Window resized or text size changed
   ↓
2. Flutter rebuild
   ↓
3. TerminalView new size calculated
   ↓
4. Terminal.onResize callback
   ↓
5. Calculate new columns & rows
   ↓
6. Pty.resize(cols, rows)
   ↓
7. ioctl() TIOCSWINSZ on PTY
   ↓
8. Shell receives SIGWINCH
   ↓
9. Shell adapts to new size
```

## State Management

### Current Implementation
- **Local State**: `setState()` in StatefulWidgets
- **Service Provider**: `Provider` package for PtyService

### State Hierarchy
```
App
└── HomeScreen
    └── TerminalTabs (StatefulWidget)
        ├── State:
        │   ├── _tabController
        │   ├── _ptyService
        │   └── _sessions (via PtyService)
        └── TerminalView (StatefulWidget) [×N]
            ├── State:
            │   ├── _terminalController
            │   └── _focusNode
            └── xterm TerminalView (package widget)
```

### Future Enhancements
Consider using:
- **Riverpod**: Better provider with more features
- **Bloc**: For complex state management
- **GetX**: For reactive programming

## Threading Model

### Main Thread
- UI rendering
- User input handling
- State updates

### I/O Threads
- PTY output stream (separate isolate)
- Terminal rendering updates
- File system operations

### Process Management
- Each shell runs as separate OS process
- PTY manages process lifecycle
- Zombie process cleanup

## Memory Management

### Resource Lifecycle

**TerminalSession:**
```dart
Create:  Terminal() + Pty.start()
Use:     I/O operations, rendering
Cleanup: terminal.dispose() + pty.kill()
```

**Key Considerations:**
- Each terminal holds ~1-10 MB (buffer size dependent)
- PTY keeps file descriptors open
- Shell processes have their own memory
- Clean up on tab close to prevent leaks

### Memory Optimization

```dart
// Limit scrollback buffer
Terminal(maxLines: 10000)  // ~2-5 MB per terminal

// Close unused terminals
session.dispose()

// Monitor active sessions
_ptyService.sessions.length
```

## Error Handling

### PTY Errors
```dart
pty.exitCode.then((code) {
  if (code != 0) {
    // Handle abnormal exit
    showError('Terminal exited with code $code');
  }
  removeSession(sessionId);
});
```

### Terminal Errors
- Parse errors: xterm handles gracefully
- Invalid ANSI codes: ignored or rendered as text
- Buffer overflow: oldest lines discarded

### System Errors
- Shell not found: Check PATH and shell existence
- Permission denied: Verify entitlements
- PTY creation failed: System resource limits

## Security Model

### macOS App Sandbox

**Enabled Entitlements:**
- `com.apple.security.app-sandbox` - Enable sandbox
- `com.apple.security.files.user-selected.read-write` - File access
- `com.apple.security.cs.allow-jit` - JIT compilation
- `com.apple.security.inherit` - Subprocess creation

**Security Implications:**
- Terminals have same permissions as app
- User consent required for some file operations
- Network access controlled by entitlements
- No arbitrary code execution (shell is controlled)

### Input Sanitization

**Already Handled:**
- xterm sanitizes terminal input
- PTY handles binary data safely
- No SQL injection risk (no database)
- No XSS risk (native app)

**Considerations:**
- Users can run arbitrary commands (by design)
- Shell has user's permissions
- Be aware of: `rm -rf /`, malicious scripts

## Performance Characteristics

### Rendering Performance
- 60 FPS target for smooth scrolling
- Virtual scrolling in xterm
- Efficient ANSI parsing
- Flutter's rendering pipeline

### I/O Performance
- Stream-based I/O (non-blocking)
- UTF-8 decoding on separate thread
- Minimal latency (<10ms typically)

### Memory Performance
- O(n) memory per terminal (n = maxLines)
- O(m) total memory (m = number of terminals)
- Typical: 5-10 MB per terminal

### CPU Performance
- Terminal rendering: 1-5% per active terminal
- Idle terminals: <1% CPU
- Heavy output: Up to 30% CPU spike (temporary)

## Scalability

### Horizontal Scaling
- Each terminal is independent
- Can theoretically run 100+ terminals
- Limited by:
  - System resources (RAM, CPU)
  - OS process limits
  - File descriptor limits

### Vertical Scaling
- Increase buffer size per terminal
- Higher resolution terminals
- More history

## Testing Strategy

### Unit Tests
```dart
test('TerminalSession creation', () {
  final session = TerminalSession(...);
  expect(session.id, isNotEmpty);
});
```

### Widget Tests
```dart
testWidgets('TerminalView renders', (tester) async {
  await tester.pumpWidget(TerminalView(...));
  expect(find.byType(TerminalView), findsOneWidget);
});
```

### Integration Tests
- Create terminal, run command, verify output
- Multiple terminals simultaneously
- Resource cleanup verification

## Future Enhancements

### Planned Features
1. **Split Panes**: Horizontal/vertical terminal splits
2. **Session Persistence**: Save/restore sessions
3. **Custom Themes**: User-configurable color schemes
4. **Search**: Search terminal output
5. **Terminal Profiles**: Preconfigured shell environments
6. **SSH Integration**: Remote terminal sessions
7. **Multiplexer**: tmux/screen integration
8. **Notifications**: Alert on command completion

### Architecture Changes Needed
- State management upgrade (Riverpod/Bloc)
- Persistence layer (SQLite/Hive)
- Configuration management
- Plugin system for extensions

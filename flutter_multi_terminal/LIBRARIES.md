# Libraries and Utilities Guide

## Core Dependencies

### 1. **xterm** (v4.0.0+)

**Purpose:** Terminal emulator for Flutter

**What it does:**
- Renders terminal output in Flutter widgets
- Handles ANSI escape sequences (colors, cursor movement, etc.)
- Processes terminal input
- Manages terminal state (cursor position, screen buffer, etc.)

**Key Features:**
- VT100/xterm compatibility
- 256-color support
- UTF-8 support
- Mouse tracking
- Copy/paste functionality

**Usage in our app:**
```dart
import 'package:xterm/xterm.dart';
import 'package:xterm/flutter.dart';

final terminal = Terminal(maxLines: 10000);
TerminalView(terminal)
```

**Documentation:** https://pub.dev/packages/xterm

---

### 2. **flutter_pty** (v0.3.0+)

**Purpose:** Pseudo-terminal (PTY) support for spawning shell processes

**What it does:**
- Creates pseudo-terminal devices
- Spawns shell processes (bash, zsh, etc.)
- Handles bidirectional I/O between app and shell
- Manages process lifecycle

**Key Features:**
- Cross-platform PTY support (macOS, Linux, Windows)
- Proper signal handling
- Process termination
- Environment variable management

**Usage in our app:**
```dart
import 'package:flutter_pty/flutter_pty.dart';

final pty = Pty.start(
  '/bin/zsh',
  arguments: ['-l'],
  workingDirectory: '/path/to/dir',
  environment: {'TERM': 'xterm-256color'},
);

// Read output
pty.output.listen((data) => print(data));

// Write input
pty.write('ls\n');

// Resize
pty.resize(80, 24);

// Cleanup
pty.kill();
```

**Documentation:** https://pub.dev/packages/flutter_pty

---

### 3. **window_manager** (v0.3.8+)

**Purpose:** Native window management for desktop Flutter apps

**What it does:**
- Controls window size and position
- Manages window state (minimized, maximized, fullscreen)
- Handles window events
- Sets window properties (title, opacity, etc.)

**Key Features:**
- Window resizing and positioning
- Title bar customization
- Window show/hide control
- Multi-window support

**Usage in our app:**
```dart
import 'package:window_manager/window_manager.dart';

await windowManager.ensureInitialized();

const options = WindowOptions(
  size: Size(1200, 800),
  minimumSize: Size(800, 600),
  center: true,
  title: 'Multi-Terminal',
);

await windowManager.waitUntilReadyToShow(options, () async {
  await windowManager.show();
  await windowManager.focus();
});
```

**Documentation:** https://pub.dev/packages/window_manager

---

### 4. **path_provider** (v2.1.1+)

**Purpose:** Access to common file system locations

**What it does:**
- Provides paths to app directories
- Gets platform-specific paths
- Manages temporary storage

**Key Features:**
- Documents directory
- Application support directory
- Downloads directory
- Temporary directory

**Usage in our app:**
```dart
import 'package:path_provider/path_provider.dart';

final docsDir = await getApplicationDocumentsDirectory();
final tempDir = await getTemporaryDirectory();
```

**Documentation:** https://pub.dev/packages/path_provider

---

### 5. **provider** (v6.1.1+)

**Purpose:** State management solution

**What it does:**
- Manages app state
- Provides dependency injection
- Rebuilds widgets on state changes

**Key Features:**
- Simple API
- Good performance
- Recommended by Flutter team

**Usage in our app:**
```dart
import 'package:provider/provider.dart';

// Provide
Provider.value(
  value: _ptyService,
  child: MyWidget(),
)

// Consume
final ptyService = Provider.of<PtyService>(context);
```

**Documentation:** https://pub.dev/packages/provider

---

## Alternative Libraries

### If flutter_pty doesn't work:

#### **Option 1: dart:ffi + Native PTY**

Create a custom FFI plugin for macOS PTY functions:

```dart
import 'dart:ffi';
import 'package:ffi/ffi.dart';

// Bind to native PTY functions
typedef PosixOpenptC = Int32 Function(Int32 flags);
typedef PosixOpenptDart = int Function(int flags);

final libc = DynamicLibrary.open('/usr/lib/libc.dylib');
final posixOpenpt = libc.lookupFunction<PosixOpenptC, PosixOpenptDart>('posix_openpt');
```

**Pros:**
- Full control
- Native performance
- No external dependencies

**Cons:**
- More complex
- Platform-specific code
- Maintenance burden

#### **Option 2: process_run**

Use for simpler process execution (not true PTY):

```yaml
dependencies:
  process_run: ^0.14.0
```

```dart
import 'package:process_run/shell.dart';

final shell = Shell();
await shell.run('ls -la');
```

**Pros:**
- Simple API
- Well-maintained
- Cross-platform

**Cons:**
- Not a true PTY
- Limited interactivity
- No ANSI color support

#### **Option 3: pty (Pure Dart)**

If available for your platform:

```yaml
dependencies:
  pty: ^0.2.0
```

**Pros:**
- Pure Dart implementation
- Good cross-platform support

**Cons:**
- May have limitations
- Performance considerations

---

## Development Tools

### Flutter DevTools

Essential for debugging:

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

**Features:**
- Widget inspector
- Performance profiling
- Memory analysis
- Network monitoring

### Xcode

Required for macOS development:

- Build settings
- Signing & capabilities
- Entitlements configuration
- Native debugging

### CocoaPods

Dependency management for macOS plugins:

```bash
brew install cocoapods
pod install
```

---

## Utility Libraries (Optional Enhancements)

### For enhanced features:

#### **file_picker**
```yaml
file_picker: ^6.1.1
```
- Select files/folders from dialogs
- Better file system integration

#### **shared_preferences**
```yaml
shared_preferences: ^2.2.2
```
- Save terminal sessions
- Persist user preferences

#### **hotkey_manager**
```yaml
hotkey_manager: ^0.1.8
```
- Global keyboard shortcuts
- Better shortcut handling

#### **desktop_multi_window**
```yaml
desktop_multi_window: ^0.2.0
```
- Multiple windows
- Detachable terminals

#### **flutter_colorpicker**
```yaml
flutter_colorpicker: ^1.0.3
```
- Theme customization
- Color scheme editor

---

## System Requirements

### macOS Development

**Minimum:**
- macOS 10.15 (Catalina)
- Xcode 14.0+
- Flutter 3.16+
- Dart 3.2+

**Recommended:**
- macOS 13+ (Ventura)
- Xcode 15+
- Flutter 3.19+
- 8GB RAM
- SSD for fast builds

### Shell Requirements

**Supported Shells:**
- `/bin/zsh` (default on macOS)
- `/bin/bash`
- `/usr/local/bin/fish`
- Any POSIX-compliant shell

**Required:**
- Shell must support PTY
- Should support ANSI escape codes
- UTF-8 encoding support

---

## Performance Considerations

### Memory Management

**Terminal Buffer:**
```dart
Terminal(maxLines: 10000)  // Adjust based on needs
```
- Larger = more history, more memory
- Smaller = less memory, limited scrollback

### Process Limits

Monitor number of active terminals:
- Each terminal = 1 shell process
- macOS default: ~1024 process limit
- Recommended: < 50 concurrent terminals

### UI Performance

**Rendering:**
- Flutter's rendering is efficient
- Terminal updates can be frequent
- Use `setState()` judiciously

---

## Security Considerations

### File System Access

**Entitlements needed:**
- `com.apple.security.files.user-selected.read-write`
- `com.apple.security.files.downloads.read-write`

### Process Execution

**Entitlements needed:**
- `com.apple.security.cs.allow-jit`
- `com.apple.security.cs.disable-library-validation`
- `com.apple.security.inherit`

### Sandboxing

macOS App Sandbox restrictions:
- Limited by entitlements
- User consent for file access
- Network restrictions (if enabled)

**Best Practices:**
- Request minimal permissions
- Explain permissions to users
- Handle permission denials gracefully

---

## Troubleshooting Tools

### Debug Output

Enable verbose logging:
```dart
debugPrint('PTY: $message');
```

### System Tools

```bash
# Check processes
ps aux | grep flutter

# Monitor file descriptors
lsof -p <pid>

# Check PTY devices
ls -la /dev/ttys*

# Test shell manually
/bin/zsh -l
```

### Flutter Doctor

```bash
flutter doctor -v
```

Checks:
- Flutter installation
- Xcode setup
- CocoaPods
- Connected devices

---

## Learning Resources

### Official Documentation

- [Flutter Desktop](https://docs.flutter.dev/desktop)
- [xterm.js](https://xtermjs.org/) (web equivalent, good reference)
- [ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [PTY in Unix](https://en.wikipedia.org/wiki/Pseudoterminal)

### Community Resources

- [Flutter Desktop Examples](https://github.com/flutter/samples/tree/main/desktop)
- [xterm Package Examples](https://github.com/TerminalStudio/xterm.dart/tree/main/example)
- [Flutter Discord](https://discord.com/invite/flutter)

### Books & Tutorials

- "Flutter for Desktop" tutorials
- "UNIX PTY Programming"
- "Terminal Emulator Development"

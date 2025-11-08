# Quick Reference Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Prerequisites
```bash
# Check if you have Flutter installed
flutter --version

# If not, install from: https://flutter.dev
```

### 2. Run Setup Script
```bash
cd flutter_multi_terminal
chmod +x quick_start.sh
./quick_start.sh
```

### 3. Launch App
```bash
flutter run -d macos
```

---

## 📦 Key Dependencies

| Package | Purpose | Version |
|---------|---------|---------|
| `xterm` | Terminal emulator | 4.0.0+ |
| `flutter_pty` | PTY support | 0.3.0+ |
| `window_manager` | Window control | 0.3.8+ |
| `provider` | State management | 6.1.1+ |
| `path_provider` | File paths | 2.1.1+ |

---

## 🏗️ Project Structure

```
flutter_multi_terminal/
├── lib/
│   ├── main.dart                    # App entry
│   ├── models/
│   │   └── terminal_session.dart    # Session model
│   ├── services/
│   │   └── pty_service.dart         # PTY management
│   ├── widgets/
│   │   ├── terminal_view.dart       # Single terminal
│   │   └── terminal_tabs.dart       # Multi-tab container
│   └── screens/
│       └── home_screen.dart         # Main screen
├── macos/
│   └── Runner/
│       ├── DebugProfile.entitlements
│       └── Release.entitlements
├── pubspec.yaml                     # Dependencies
└── README.md                        # Documentation
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+T` | New terminal |
| `Cmd+W` | Close terminal |
| `Cmd+C` | Copy (when text selected) |
| `Cmd+V` | Paste |
| `Ctrl+C` | Interrupt command |
| `Ctrl+D` | Exit shell |
| `Ctrl+L` | Clear screen |

---

## 🎯 Common Tasks

### Create New Terminal
```dart
// In TerminalTabs widget
await _ptyService.createSession();
```

### Run Command Programmatically
```dart
session.write('ls -la\n');
```

### Change Working Directory
```dart
await _ptyService.createSession(
  workingDirectory: '/path/to/project',
);
```

### Customize Theme
```dart
// In terminal_view.dart
theme: TerminalTheme(
  foreground: Color(0xFFFFFFFF),
  background: Color(0xFF000000),
  // ... other colors
)
```

---

## 🔧 Troubleshooting

### Terminal Not Responding
1. Click the terminal to focus it
2. Check if shell process is running: `ps aux | grep zsh`
3. Try creating new terminal (Cmd+T)

### Build Fails
```bash
flutter clean
flutter pub get
cd macos && pod install && cd ..
flutter run -d macos
```

### Permission Errors
1. Open in Xcode: `open macos/Runner.xcworkspace`
2. Check "Signing & Capabilities"
3. Verify entitlements are enabled

### PTY Errors
```bash
# Verify shell exists
which zsh
which bash

# Check PATH
echo $PATH

# Test shell manually
/bin/zsh -l
```

---

## 📝 Code Snippets

### Add New Terminal Theme
```dart
// Create a theme preset
final TerminalTheme draculaTheme = TerminalTheme(
  cursor: Color(0xFFBFBFBF),
  selection: Color(0xFF44475A),
  foreground: Color(0xFFF8F8F2),
  background: Color(0xFF282A36),
  black: Color(0xFF000000),
  red: Color(0xFFFF5555),
  green: Color(0xFF50FA7B),
  yellow: Color(0xFFF1FA8C),
  blue: Color(0xFFBD93F9),
  magenta: Color(0xFFFF79C6),
  cyan: Color(0xFF8BE9FD),
  white: Color(0xFFBFBFBF),
  // ... bright colors
);
```

### Custom Shell Initialization
```dart
final session = await _ptyService.createSession(
  environment: {
    'TERM': 'xterm-256color',
    'EDITOR': 'vim',
    'CUSTOM_VAR': 'value',
  },
);
```

### Handle Terminal Events
```dart
// Listen for exit
pty.exitCode.then((code) {
  print('Exited with code: $code');
  // Cleanup or notify user
});

// Listen for output
pty.output.listen((data) {
  // Process raw output if needed
});
```

---

## 🎨 Customization Options

### Window Size
```dart
// In main.dart
const windowOptions = WindowOptions(
  size: Size(1600, 900),      // Change size
  minimumSize: Size(800, 600),
  maximumSize: Size(2400, 1600),
);
```

### Terminal Buffer Size
```dart
// In pty_service.dart
final terminal = Terminal(
  maxLines: 50000,  // More history
);
```

### Font Settings
```dart
// In terminal_view.dart
TerminalView(
  terminal,
  textStyle: TerminalStyle(
    fontSize: 16.0,           // Bigger font
    fontFamily: 'Menlo',      // Different font
  ),
)
```

---

## 📊 Performance Tips

1. **Limit Active Terminals**: Keep < 20 open simultaneously
2. **Reduce Buffer Size**: Lower `maxLines` if using many terminals
3. **Close Unused Tabs**: Each terminal uses 5-10 MB RAM
4. **Monitor Processes**: Use Activity Monitor to check resource usage

---

## 🔐 Security Notes

### Entitlements Required
- File system access: `com.apple.security.files.user-selected.read-write`
- Subprocess execution: `com.apple.security.inherit`
- JIT compilation: `com.apple.security.cs.allow-jit`

### Sandboxing
- App runs in macOS sandbox
- Has same permissions as user
- Can't access system files without permission
- Network access controlled by entitlements

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
flutter test

# Widget tests
flutter test test/widget_test.dart

# Integration tests
flutter test integration_test/
```

### Manual Testing Checklist
- [ ] Create new terminal (Cmd+T)
- [ ] Run `ls` command
- [ ] Test colors: `ls --color=auto`
- [ ] Close terminal (Cmd+W)
- [ ] Multiple tabs (create 5+ terminals)
- [ ] Resize window (terminal should adapt)
- [ ] Copy/paste text
- [ ] Run interactive app (vim, htop)
- [ ] Long-running command (tail -f)

---

## 📚 Resources

### Documentation
- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Detailed setup
- [USAGE.md](USAGE.md) - User guide
- [LIBRARIES.md](LIBRARIES.md) - Dependencies
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design

### External Links
- [Flutter Desktop Docs](https://docs.flutter.dev/desktop)
- [xterm Package](https://pub.dev/packages/xterm)
- [flutter_pty Package](https://pub.dev/packages/flutter_pty)
- [ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)

### Community
- [Flutter Discord](https://discord.com/invite/flutter)
- [Flutter Reddit](https://reddit.com/r/FlutterDev)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/flutter)

---

## 🐛 Known Issues

### Issue: Colors not showing
**Workaround**: Ensure `TERM=xterm-256color` in environment

### Issue: Slow rendering with lots of output
**Workaround**: Use `less` or pipe to files for large outputs

### Issue: Copy/paste not working
**Workaround**: Use terminal's native copy (select text, Cmd+C)

---

## 💡 Pro Tips

1. **Multiple Projects**: Use separate terminals for each project
2. **SSH Sessions**: Run `ssh user@host` in a terminal
3. **Background Jobs**: Use `&` to run jobs in background
4. **Screen/Tmux**: Run terminal multiplexers for advanced layouts
5. **Aliases**: Add to `.zshrc` for quick commands
6. **Git Integration**: Each terminal has git access

---

## 🎯 Use Cases

### Development Workflow
```
Terminal 1: Editor (vim/nvim/code)
Terminal 2: Dev server (npm start)
Terminal 3: Test runner (npm test --watch)
Terminal 4: Git operations
Terminal 5: General commands
```

### DevOps Workflow
```
Terminal 1: kubectl commands
Terminal 2: docker-compose up
Terminal 3: Log monitoring (tail -f)
Terminal 4: SSH to servers
```

### Data Science Workflow
```
Terminal 1: Python REPL
Terminal 2: Jupyter notebook
Terminal 3: Data processing scripts
Terminal 4: Git version control
```

---

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Multiple independent terminals
- ✅ Full file system access
- ✅ macOS native support
- ✅ Tab management
- ✅ Keyboard shortcuts
- ✅ Custom themes

### Planned (v1.1.0)
- [ ] Split panes
- [ ] Session persistence
- [ ] Search functionality
- [ ] Custom profiles
- [ ] Settings UI

---

## 📞 Support

### Getting Help
1. Check documentation files
2. Search GitHub issues
3. Ask in Flutter community
4. File a bug report

### Contributing
- Fork the repository
- Create feature branch
- Submit pull request
- Follow code style guidelines

---

**Last Updated**: 2025-11-08
**Flutter Version**: 3.16+
**macOS Version**: 10.15+

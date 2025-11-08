# Multi-Terminal Flutter App for macOS

A Flutter application for macOS that provides multiple independent terminal sessions with full file system access.

## Features

- 🖥️ Multiple independent terminal sessions
- 📁 Full local file system access
- 🎯 Run interactive CLI apps (like Claude Code)
- 🎨 Modern tabbed interface
- ⚡ Native performance with PTY support

## Architecture

```
┌─────────────────────────────────────────┐
│          Flutter UI Layer               │
│  ┌────────────────────────────────┐    │
│  │   Multi-Tab Terminal Widget    │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Terminal Emulator (xterm)          │
│  - ANSI code parsing                    │
│  - Terminal rendering                   │
│  - Input handling                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      PTY Manager (flutter_pty)          │
│  - Process spawning                     │
│  - Shell session management             │
│  - I/O streaming                        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         macOS System Layer              │
│  - /bin/zsh or /bin/bash                │
│  - File system access                   │
└─────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Flutter SDK (3.16+)
- macOS 10.15+
- Xcode 14+

### Installation

```bash
# Create the project
flutter create --platforms=macos flutter_multi_terminal
cd flutter_multi_terminal

# Run the setup script (see below)
flutter pub get
flutter run -d macos
```

## Project Structure

```
lib/
├── main.dart                    # App entry point
├── models/
│   └── terminal_session.dart    # Terminal session model
├── services/
│   └── pty_service.dart         # PTY management service
├── widgets/
│   ├── terminal_view.dart       # Single terminal widget
│   └── terminal_tabs.dart       # Multi-tab container
└── screens/
    └── home_screen.dart         # Main application screen
```

## Usage

1. Launch the app
2. Click "New Terminal" or press Cmd+T to create a new session
3. Each terminal runs independently with full shell access
4. Run any CLI app (e.g., `code`, `claude`, `vim`, etc.)
5. Switch between terminals using tabs
6. Close terminals with the × button or Cmd+W

## Development

```bash
# Run in debug mode
flutter run -d macos

# Build release
flutter build macos --release

# The app will be in build/macos/Build/Products/Release/
```

## License

MIT

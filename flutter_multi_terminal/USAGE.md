# Usage Guide

## Basic Operations

### Creating Terminals

**Method 1: Click the + Button**
- Click the "+" icon in the top-right of the app bar
- A new terminal tab will appear

**Method 2: Keyboard Shortcut**
- Press `Cmd+T` to create a new terminal
- Works from anywhere in the app

### Switching Between Terminals

**Method 1: Click Tabs**
- Click on any tab to switch to that terminal

**Method 2: Keyboard Navigation**
- `Cmd+1` through `Cmd+9` - Switch to terminal 1-9
- `Cmd+[` - Previous tab
- `Cmd+]` - Next tab

*(Note: These shortcuts need to be implemented in the Actions)*

### Closing Terminals

**Method 1: Click the × Button**
- Click the "×" icon on the tab you want to close

**Method 2: Keyboard Shortcut**
- Press `Cmd+W` while the terminal is active
- The terminal will close and cleanup resources

**Method 3: Type 'exit'**
- Type `exit` in the terminal and press Enter
- The shell will exit and the tab will close automatically

## Terminal Features

### File System Access

Your terminal has full access to your file system:

```bash
# Navigate anywhere
cd ~/Documents
cd /Applications

# Create files and directories
mkdir myproject
touch file.txt
echo "Hello" > file.txt

# Run any command
ls -la
pwd
git status
```

### Running CLI Applications

You can run any terminal-based application:

```bash
# Text editors
vim
nano
emacs

# Development tools
claude          # Run Claude Code
git
npm install
python3
node

# System utilities
htop
top
df -h
```

### Environment Variables

The terminal inherits your system environment:

```bash
# Check environment
echo $HOME
echo $PATH
echo $SHELL

# Set custom variables
export MY_VAR="value"
echo $MY_VAR
```

### Shell Features

The terminal supports all standard shell features:

```bash
# Command history
# Use ↑ and ↓ arrows to navigate history

# Tab completion
cd ~/Doc<Tab>  # Completes to ~/Documents

# Pipes and redirection
ls -la | grep myfile
echo "test" > output.txt
cat file.txt | wc -l

# Job control
# Ctrl+C to interrupt
# Ctrl+Z to suspend
# bg/fg for background/foreground
```

## Advanced Usage

### Custom Working Directory

You can modify `pty_service.dart` to start terminals in specific directories:

```dart
// In terminal_tabs.dart, when creating a new terminal:
final session = await _ptyService.createSession(
  workingDirectory: '/path/to/your/project',
);
```

### Custom Environment Variables

Pass custom environment variables when creating a session:

```dart
final session = await _ptyService.createSession(
  environment: {
    'MY_CUSTOM_VAR': 'value',
    'EDITOR': 'vim',
  },
);
```

### Different Shells

Change the default shell in `pty_service.dart`:

```dart
// Use bash instead of zsh
final shell = '/bin/bash';

// Or use fish
final shell = '/usr/local/bin/fish';
```

## Tips & Tricks

### 1. Persistent Sessions

Currently, terminal sessions don't persist across app restarts. To add persistence:
- Save session state (working directory, history)
- Restore on app startup

### 2. Copy & Paste

- `Cmd+C` - Copy selected text
- `Cmd+V` - Paste text
- Right-click for context menu (if implemented)

### 3. Terminal Size

The terminal automatically resizes with the window. For custom sizing:
- Modify the window size in `main.dart`
- The PTY will auto-resize

### 4. Color Themes

Edit the `TerminalTheme` in `terminal_view.dart` to customize colors:

```dart
theme: TerminalTheme(
  foreground: Color(0xFFYOURCOLOR),
  background: Color(0xFFYOURCOLOR),
  // ... other colors
),
```

### 5. Font Size

Adjust font size in the `TerminalView` widget:

```dart
TerminalView(
  widget.session.terminal,
  textStyle: TerminalStyle(
    fontSize: 14.0,  // Adjust size
  ),
)
```

## Common Workflows

### Running Claude Code

```bash
# Start a new terminal
# Press Cmd+T

# Navigate to your project
cd ~/my-project

# Run Claude Code
claude

# Claude Code will run with full file system access
# You can work on your project normally
```

### Multiple Projects

```bash
# Terminal 1: Frontend
cd ~/projects/frontend
npm run dev

# Terminal 2: Backend
cd ~/projects/backend
go run main.go

# Terminal 3: Database
cd ~/projects/database
docker-compose up

# Terminal 4: General use
cd ~
# Run commands, git operations, etc.
```

### Development Workflow

```bash
# Terminal 1: Editor
cd ~/project
nvim .

# Terminal 2: Server
npm start

# Terminal 3: Tests
npm test -- --watch

# Terminal 4: Git operations
git status
git add .
git commit -m "message"
```

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Cmd+T` | New terminal |
| `Cmd+W` | Close terminal |
| `Cmd+C` | Copy (when text selected) |
| `Cmd+V` | Paste |
| `Ctrl+C` | Interrupt command |
| `Ctrl+D` | EOF / Exit shell |
| `Ctrl+L` | Clear screen |
| `Ctrl+A` | Move to line start |
| `Ctrl+E` | Move to line end |
| `Ctrl+U` | Clear line before cursor |
| `Ctrl+K` | Clear line after cursor |

## Troubleshooting

### Terminal not responding
- Click on the terminal area to focus it
- Try creating a new terminal

### Can't see output
- Check if the command is actually running (`ps aux | grep <command>`)
- Some commands need specific terminal settings

### Colors not working
- Ensure `TERM` is set to `xterm-256color`
- Check the app's theme configuration

### Slow performance
- Limit terminal history (`maxLines: 10000` in `pty_service.dart`)
- Close unused terminal tabs
- Check for runaway processes

# Setup Guide

## Step-by-Step Setup Instructions

### 1. Prerequisites

Ensure you have the following installed:

```bash
# Check Flutter
flutter --version
# Should be 3.16.0 or higher

# Check Xcode
xcodebuild -version
# Should be 14.0 or higher

# Check CocoaPods (required for macOS plugins)
pod --version
```

### 2. Create Flutter Project

Since I've already created the code structure, you need to initialize the Flutter project:

```bash
# Navigate to your desired directory
cd /path/to/your/projects

# Create the Flutter project for macOS
flutter create --platforms=macos flutter_multi_terminal

# Navigate into the project
cd flutter_multi_terminal

# Copy all the files from the structure I created above into this directory
```

### 3. Install Dependencies

```bash
# Get all packages
flutter pub get

# For macOS, you might need to install pods
cd macos
pod install
cd ..
```

### 4. Configure macOS Entitlements

The entitlements files are already created. They provide:
- File system access (read/write)
- Network access (if needed for future features)
- Permission to spawn subprocesses (required for PTY)
- JIT compilation support

**Important:** For production apps, you may want to request more specific permissions via the macOS permission system.

### 5. Build and Run

```bash
# Run in debug mode
flutter run -d macos

# Or build release version
flutter build macos --release

# The built app will be located at:
# build/macos/Build/Products/Release/flutter_multi_terminal.app
```

## Troubleshooting

### Issue: "flutter_pty" not found or compilation errors

**Solution:** The `flutter_pty` package might need specific configuration. Try:

```bash
flutter clean
flutter pub get
cd macos
pod install --repo-update
cd ..
flutter run -d macos
```

### Issue: Permission denied when accessing files

**Solution:** Make sure the entitlements files are properly configured in Xcode:

1. Open `macos/Runner.xcworkspace` in Xcode
2. Select the Runner target
3. Go to "Signing & Capabilities"
4. Verify "App Sandbox" is enabled
5. Under "File Access", ensure "User Selected File" is set to "Read/Write"

### Issue: Terminal not responding to input

**Solution:** This is usually a focus issue. Click on the terminal area to ensure it has focus.

### Issue: Can't spawn shell or PTY errors

**Solution:**
1. Check that your shell exists: `which zsh` or `which bash`
2. Ensure the entitlements allow subprocess execution
3. Try running with `--verbose` flag to see detailed errors

## Alternative: Using Existing PTY Implementation

If `flutter_pty` doesn't work well, you can create a custom PTY implementation using FFI:

### Option A: Use dart:ffi directly

Create a native macOS plugin that wraps `posix_openpt`, `grantpt`, `unlockpt`, and related PTY functions.

### Option B: Use process_run package

For simpler use cases, you could use the `process_run` package instead, though it won't give you a true PTY experience:

```yaml
dependencies:
  process_run: ^0.14.0
```

### Option C: Use an alternative terminal package

Consider these alternatives:
- `terminal` package (pure Dart)
- `pty` package (if available for your platform)
- Build your own using Platform Channels

## Running Claude Code Inside

Once your terminal app is running, you can:

```bash
# In the terminal within your app, run:
claude

# Or any other CLI tool:
vim
htop
git
npm
```

The terminal will have full access to your file system (within the permissions you've granted).

## Next Steps

- Add keyboard shortcuts for common operations
- Implement split panes (vertical/horizontal)
- Add terminal themes
- Implement search functionality
- Add session persistence (restore terminals on restart)
- Implement custom shell commands and aliases

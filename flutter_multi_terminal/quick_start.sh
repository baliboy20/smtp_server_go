#!/bin/bash

# Quick Start Script for Flutter Multi-Terminal App
# This script helps set up the project quickly

set -e

echo "🚀 Flutter Multi-Terminal - Quick Start Setup"
echo "=============================================="
echo ""

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed!"
    echo "Please install Flutter from: https://flutter.dev/docs/get-started/install/macos"
    exit 1
fi

echo "✅ Flutter found: $(flutter --version | head -n 1)"
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  Warning: This app is designed for macOS"
    echo "Current OS: $OSTYPE"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Xcode is installed (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v xcodebuild &> /dev/null; then
        echo "⚠️  Xcode not found. Please install Xcode from the App Store."
        echo "You can continue, but macOS build will fail."
    else
        echo "✅ Xcode found: $(xcodebuild -version | head -n 1)"
    fi
    echo ""
fi

# Check if CocoaPods is installed (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v pod &> /dev/null; then
        echo "⚠️  CocoaPods not found."
        echo "Installing CocoaPods..."
        sudo gem install cocoapods
    else
        echo "✅ CocoaPods found: $(pod --version)"
    fi
    echo ""
fi

# Run Flutter doctor
echo "🔍 Running Flutter doctor..."
flutter doctor
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean
echo ""

# Get dependencies
echo "📦 Getting Flutter dependencies..."
flutter pub get
echo ""

# Install CocoaPods dependencies (macOS only)
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "macos" ]; then
    echo "📦 Installing macOS dependencies..."
    cd macos
    pod install --repo-update
    cd ..
    echo ""
fi

# Enable macOS desktop support
echo "🖥️  Ensuring macOS desktop support..."
flutter config --enable-macos-desktop
echo ""

# Create necessary directories if they don't exist
echo "📁 Creating directory structure..."
mkdir -p lib/models
mkdir -p lib/services
mkdir -p lib/widgets
mkdir -p lib/screens
echo ""

# Run flutter create to generate missing platform files
echo "🏗️  Generating platform files..."
flutter create --platforms=macos .
echo ""

echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Ensure all source files are in place (check lib/ directory)"
echo "  2. Verify entitlements in macos/Runner/"
echo "  3. Run: flutter run -d macos"
echo ""
echo "📚 Documentation:"
echo "  - SETUP.md    - Detailed setup instructions"
echo "  - USAGE.md    - How to use the app"
echo "  - LIBRARIES.md - Information about dependencies"
echo "  - README.md   - Project overview"
echo ""
echo "🏃 To run the app now:"
echo "  flutter run -d macos"
echo ""
echo "🔨 To build release version:"
echo "  flutter build macos --release"
echo ""

# Ask if user wants to run the app
read -p "Would you like to run the app now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Launching app..."
    flutter run -d macos
fi

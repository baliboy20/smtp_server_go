# Quick Start Guide

Get the Christmas Card List app running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js
node --version  # Should be v16+

# Check MongoDB
mongod --version  # Should be v5+

# Check Flutter
flutter --version  # Should be v3.0+
```

## Step 1: Start MongoDB

```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service:
# Linux: sudo systemctl start mongod
# macOS: brew services start mongodb-community
# Windows: net start MongoDB
```

## Step 2: Start Backend API

```bash
cd christmas_card_app/backend

# Install dependencies (first time only)
npm install

# Create .env file
cp .env.example .env

# Start the server
npm start
```

You should see:
```
✅ Connected to MongoDB
📦 Database: christmas_cards
🚀 Server running on http://localhost:3000
```

## Step 3: Configure Flutter App

Edit `christmas_card_app/flutter_app/lib/services/card_service.dart`:

**Line 11** - Update the `baseUrl` based on your setup:

```dart
// For Android Emulator:
static const String baseUrl = 'http://10.0.2.2:3000/api/cards';

// For iOS Simulator:
static const String baseUrl = 'http://localhost:3000/api/cards';

// For Physical Device (replace with your computer's IP):
static const String baseUrl = 'http://192.168.1.XXX:3000/api/cards';
```

### Finding Your Computer's IP Address:

**Windows:**
```bash
ipconfig
# Look for IPv4 Address
```

**macOS/Linux:**
```bash
ifconfig | grep "inet "
# or
ip addr show | grep "inet "
```

## Step 4: Run Flutter App

```bash
cd christmas_card_app/flutter_app

# Get dependencies (first time only)
flutter pub get

# List available devices
flutter devices

# Run the app
flutter run

# Or specify a device:
flutter run -d <device-id>
```

## Step 5: Test the App

1. Tap the **"Add Card"** button (green, bottom right)
2. Fill in:
   - Recipient Name: "Santa Claus"
   - Address: "North Pole, Arctic"
   - Email (optional): "santa@northpole.com"
3. Tap **"Save Card"**
4. Card should appear in the list!

## Troubleshooting

### "Failed to load cards" Error

**Check 1:** Is the backend running?
```bash
curl http://localhost:3000
```

**Check 2:** Is the URL correct in Flutter?
- Android emulator: Use `10.0.2.2:3000`
- Physical device: Use your computer's IP

**Check 3:** Are they on the same network?
- Computer and phone must be on the same WiFi

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Or try to connect manually
mongosh
```

### Flutter Build Errors

```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

## Testing the API Directly

```bash
# Test backend health
curl http://localhost:3000

# Get all cards
curl http://localhost:3000/api/cards

# Create a test card
curl -X POST http://localhost:3000/api/cards \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Test User",
    "address": "123 Test St",
    "cardSent": false
  }'
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the app colors and theme
- Add your Christmas card list!

---

Need help? Check the main README or create an issue.

Happy Holidays! 🎄

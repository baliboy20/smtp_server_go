# Christmas Card List App

A full-stack CRUD application built with Flutter and MongoDB to help you manage your Christmas card list.

## Features

- 📝 Create, Read, Update, and Delete Christmas card recipients
- ✅ Track which cards have been sent
- 📊 View statistics (total cards, sent, remaining)
- 📱 Beautiful mobile-first UI with Material Design
- 🎄 Christmas-themed color scheme
- 🔄 Real-time data synchronization with MongoDB

## Architecture

### Frontend (Flutter)
- **Framework**: Flutter 3.x
- **State Management**: Provider
- **HTTP Client**: http package
- **UI Components**: Material Design

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API

## Project Structure

```
christmas_card_app/
├── flutter_app/          # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart           # App entry point
│   │   ├── models/
│   │   │   └── christmas_card.dart
│   │   ├── services/
│   │   │   └── card_service.dart
│   │   └── screens/
│   │       ├── card_list_screen.dart
│   │       └── card_form_screen.dart
│   └── pubspec.yaml
│
└── backend/              # Node.js backend API
    ├── server.js         # Express server with MongoDB
    ├── package.json
    └── .env.example
```

## Prerequisites

Before you begin, ensure you have the following installed:

### For Backend:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)

### For Flutter App:
- Flutter SDK (v3.0 or higher)
- Dart SDK
- Android Studio / Xcode (for mobile development)
- An emulator or physical device

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd christmas_card_app/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# Default: MONGODB_URI=mongodb://localhost:27017/christmas_cards

# Start MongoDB (if running locally)
mongod

# Start the backend server
npm start

# Or use nodemon for development
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 2. Flutter App Setup

```bash
# Navigate to the Flutter app directory
cd christmas_card_app/flutter_app

# Get Flutter dependencies
flutter pub get

# Configure the API endpoint
# Edit lib/services/card_service.dart and update the baseUrl:
# - For Android Emulator: http://10.0.2.2:3000/api/cards
# - For iOS Simulator: http://localhost:3000/api/cards
# - For Physical Device: http://YOUR_COMPUTER_IP:3000/api/cards

# Run the app
flutter run
```

## API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| GET | `/api/cards` | Get all cards |
| GET | `/api/cards/:id` | Get a card by ID |
| POST | `/api/cards` | Create a new card |
| PUT | `/api/cards/:id` | Update a card |
| DELETE | `/api/cards/:id` | Delete a card |
| GET | `/api/stats` | Get statistics |

### Request/Response Examples

#### Create a Card (POST /api/cards)
```json
{
  "recipientName": "John Doe",
  "address": "123 Main St, City, State 12345",
  "email": "john@example.com",
  "phoneNumber": "555-1234",
  "cardSent": false,
  "notes": "Remember to include photo"
}
```

#### Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "recipientName": "John Doe",
  "address": "123 Main St, City, State 12345",
  "email": "john@example.com",
  "phoneNumber": "555-1234",
  "cardSent": false,
  "notes": "Remember to include photo",
  "dateSent": null,
  "createdAt": "2024-11-05T12:00:00.000Z",
  "updatedAt": "2024-11-05T12:00:00.000Z"
}
```

## Usage

### Adding a Card
1. Tap the "Add Card" floating action button
2. Fill in the recipient's information (name and address are required)
3. Optionally add email, phone number, and notes
4. Tap "Save Card"

### Marking a Card as Sent
- Tap the three-dot menu on a card
- Select "Mark as Sent"
- The card will be marked with a green checkmark and the current date

### Editing a Card
- Tap the three-dot menu on a card
- Select "Edit"
- Update the information
- Tap "Update Card"

### Deleting a Card
- Tap the three-dot menu on a card
- Select "Delete"
- Confirm the deletion

### Viewing Statistics
The top of the screen shows:
- **Total**: Total number of cards
- **Sent**: Number of cards already sent
- **Remaining**: Number of cards still to send

## Development

### Backend Development
```bash
# Run with nodemon for auto-restart on changes
npm run dev
```

### Flutter Development
```bash
# Hot reload is enabled by default
# Press 'r' in the terminal to hot reload
# Press 'R' to hot restart
flutter run

# Run on a specific device
flutter run -d <device-id>

# List available devices
flutter devices
```

## Troubleshooting

### Cannot Connect to Backend from Flutter App

**For Android Emulator:**
- Use `http://10.0.2.2:3000/api/cards` instead of `localhost`

**For iOS Simulator:**
- Use `http://localhost:3000/api/cards`

**For Physical Device:**
1. Make sure your device and computer are on the same network
2. Find your computer's IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`
3. Use `http://YOUR_IP:3000/api/cards`

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check the connection string in `.env`
- Verify the database port (default: 27017)

### Flutter Build Issues
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

## Technologies Used

### Frontend
- Flutter 3.x
- Dart
- Provider (State Management)
- HTTP Package
- Material Design

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

## Future Enhancements

- [ ] Add user authentication
- [ ] Export list to PDF/CSV
- [ ] Add reminder notifications
- [ ] Include photo upload for personalized cards
- [ ] Search and filter functionality
- [ ] Backup and restore data
- [ ] Dark mode support
- [ ] Multi-year history

## License

MIT License

## Contributing

Feel free to submit issues and enhancement requests!

---

Happy Holidays! 🎄🎅🎁

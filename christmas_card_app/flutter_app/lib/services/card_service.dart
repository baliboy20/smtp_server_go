import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/christmas_card.dart';

class CardService extends ChangeNotifier {
  // Update this URL to match your backend server
  // For Android emulator: http://10.0.2.2:3000
  // For iOS simulator: http://localhost:3000
  // For physical device: http://YOUR_COMPUTER_IP:3000
  static const String baseUrl = 'http://localhost:3000/api/cards';

  List<ChristmasCard> _cards = [];
  bool _isLoading = false;
  String? _error;

  List<ChristmasCard> get cards => _cards;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Get all cards
  Future<void> fetchCards() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.get(Uri.parse(baseUrl));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        _cards = data.map((json) => ChristmasCard.fromJson(json)).toList();
        _error = null;
      } else {
        _error = 'Failed to load cards: ${response.statusCode}';
      }
    } catch (e) {
      _error = 'Error fetching cards: $e';
      debugPrint(_error);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Create a new card
  Future<bool> createCard(ChristmasCard card) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(card.toJson()),
      );

      if (response.statusCode == 201) {
        final newCard = ChristmasCard.fromJson(json.decode(response.body));
        _cards.add(newCard);
        _error = null;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Failed to create card: ${response.statusCode}';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Error creating card: $e';
      debugPrint(_error);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update a card
  Future<bool> updateCard(ChristmasCard card) async {
    if (card.id == null) return false;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.put(
        Uri.parse('$baseUrl/${card.id}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(card.toJson()),
      );

      if (response.statusCode == 200) {
        final updatedCard = ChristmasCard.fromJson(json.decode(response.body));
        final index = _cards.indexWhere((c) => c.id == card.id);
        if (index != -1) {
          _cards[index] = updatedCard;
        }
        _error = null;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Failed to update card: ${response.statusCode}';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Error updating card: $e';
      debugPrint(_error);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Delete a card
  Future<bool> deleteCard(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.delete(Uri.parse('$baseUrl/$id'));

      if (response.statusCode == 200) {
        _cards.removeWhere((card) => card.id == id);
        _error = null;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Failed to delete card: ${response.statusCode}';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Error deleting card: $e';
      debugPrint(_error);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Toggle card sent status
  Future<bool> toggleCardSent(ChristmasCard card) async {
    final updatedCard = card.copyWith(
      cardSent: !card.cardSent,
      dateSent: !card.cardSent ? DateTime.now() : null,
      updatedAt: DateTime.now(),
    );
    return await updateCard(updatedCard);
  }

  // Get statistics
  int get totalCards => _cards.length;
  int get cardsSent => _cards.where((card) => card.cardSent).length;
  int get cardsRemaining => _cards.where((card) => !card.cardSent).length;
}

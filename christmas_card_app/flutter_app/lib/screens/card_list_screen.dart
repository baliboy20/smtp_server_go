import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/christmas_card.dart';
import '../services/card_service.dart';
import 'card_form_screen.dart';

class CardListScreen extends StatefulWidget {
  const CardListScreen({super.key});

  @override
  State<CardListScreen> createState() => _CardListScreenState();
}

class _CardListScreenState extends State<CardListScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch cards when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CardService>().fetchCards();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.card_giftcard, size: 28),
            SizedBox(width: 10),
            Text('Christmas Card List'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<CardService>().fetchCards();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          _buildStatistics(),
          Expanded(child: _buildCardList()),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _navigateToForm(context, null),
        icon: const Icon(Icons.add),
        label: const Text('Add Card'),
      ),
    );
  }

  Widget _buildStatistics() {
    return Consumer<CardService>(
      builder: (context, service, child) {
        return Container(
          padding: const EdgeInsets.all(16),
          color: Colors.white,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatCard(
                'Total',
                service.totalCards.toString(),
                Colors.blue,
                Icons.list,
              ),
              _buildStatCard(
                'Sent',
                service.cardsSent.toString(),
                Colors.green,
                Icons.check_circle,
              ),
              _buildStatCard(
                'Remaining',
                service.cardsRemaining.toString(),
                Colors.orange,
                Icons.pending,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatCard(String label, String value, Color color, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: color, size: 32),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildCardList() {
    return Consumer<CardService>(
      builder: (context, service, child) {
        if (service.isLoading && service.cards.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }

        if (service.error != null && service.cards.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
                const SizedBox(height: 16),
                Text(
                  'Error: ${service.error}',
                  style: const TextStyle(color: Colors.red),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => service.fetchCards(),
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        if (service.cards.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.inbox, size: 64, color: Colors.grey[300]),
                const SizedBox(height: 16),
                Text(
                  'No cards yet',
                  style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tap the + button to add your first card',
                  style: TextStyle(color: Colors.grey[500]),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => service.fetchCards(),
          child: ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: service.cards.length,
            itemBuilder: (context, index) {
              final card = service.cards[index];
              return _buildCardItem(context, card, service);
            },
          ),
        );
      },
    );
  }

  Widget _buildCardItem(BuildContext context, ChristmasCard card, CardService service) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: card.cardSent ? Colors.green : Colors.orange,
          child: Icon(
            card.cardSent ? Icons.check : Icons.pending_actions,
            color: Colors.white,
          ),
        ),
        title: Text(
          card.recipientName,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            decoration: card.cardSent ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(card.address),
            if (card.email != null && card.email!.isNotEmpty)
              Text(card.email!, style: TextStyle(color: Colors.grey[600])),
            if (card.cardSent && card.dateSent != null)
              Text(
                'Sent: ${_formatDate(card.dateSent!)}',
                style: TextStyle(color: Colors.green[700], fontSize: 12),
              ),
          ],
        ),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            PopupMenuItem(
              child: ListTile(
                leading: Icon(
                  card.cardSent ? Icons.undo : Icons.check,
                  color: card.cardSent ? Colors.orange : Colors.green,
                ),
                title: Text(card.cardSent ? 'Mark as Not Sent' : 'Mark as Sent'),
                contentPadding: EdgeInsets.zero,
              ),
              onTap: () {
                service.toggleCardSent(card);
              },
            ),
            PopupMenuItem(
              child: const ListTile(
                leading: Icon(Icons.edit, color: Colors.blue),
                title: Text('Edit'),
                contentPadding: EdgeInsets.zero,
              ),
              onTap: () {
                Future.delayed(
                  const Duration(milliseconds: 100),
                  () => _navigateToForm(context, card),
                );
              },
            ),
            PopupMenuItem(
              child: const ListTile(
                leading: Icon(Icons.delete, color: Colors.red),
                title: Text('Delete'),
                contentPadding: EdgeInsets.zero,
              ),
              onTap: () {
                Future.delayed(
                  const Duration(milliseconds: 100),
                  () => _confirmDelete(context, card, service),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }

  void _navigateToForm(BuildContext context, ChristmasCard? card) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CardFormScreen(card: card),
      ),
    );
  }

  void _confirmDelete(BuildContext context, ChristmasCard card, CardService service) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Card'),
        content: Text('Are you sure you want to delete the card for ${card.recipientName}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              service.deleteCard(card.id!);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

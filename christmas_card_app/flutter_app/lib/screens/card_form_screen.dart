import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/christmas_card.dart';
import '../services/card_service.dart';

class CardFormScreen extends StatefulWidget {
  final ChristmasCard? card;

  const CardFormScreen({super.key, this.card});

  @override
  State<CardFormScreen> createState() => _CardFormScreenState();
}

class _CardFormScreenState extends State<CardFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _addressController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _notesController;
  late bool _cardSent;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.card?.recipientName ?? '');
    _addressController = TextEditingController(text: widget.card?.address ?? '');
    _emailController = TextEditingController(text: widget.card?.email ?? '');
    _phoneController = TextEditingController(text: widget.card?.phoneNumber ?? '');
    _notesController = TextEditingController(text: widget.card?.notes ?? '');
    _cardSent = widget.card?.cardSent ?? false;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.card != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Card' : 'Add New Card'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Recipient Information',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          labelText: 'Recipient Name *',
                          prefixIcon: Icon(Icons.person),
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _addressController,
                        decoration: const InputDecoration(
                          labelText: 'Address *',
                          prefixIcon: Icon(Icons.home),
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 3,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter an address';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          prefixIcon: Icon(Icons.email),
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _phoneController,
                        decoration: const InputDecoration(
                          labelText: 'Phone Number',
                          prefixIcon: Icon(Icons.phone),
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _notesController,
                        decoration: const InputDecoration(
                          labelText: 'Notes',
                          prefixIcon: Icon(Icons.note),
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 3,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: SwitchListTile(
                  title: const Text('Card Sent'),
                  subtitle: const Text('Mark this card as already sent'),
                  value: _cardSent,
                  onChanged: (value) {
                    setState(() {
                      _cardSent = value;
                    });
                  },
                  secondary: Icon(
                    _cardSent ? Icons.check_circle : Icons.pending_actions,
                    color: _cardSent ? Colors.green : Colors.orange,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _saveCard,
                icon: const Icon(Icons.save),
                label: Text(isEditing ? 'Update Card' : 'Save Card'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.all(16),
                  textStyle: const TextStyle(fontSize: 18),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _saveCard() async {
    if (_formKey.currentState!.validate()) {
      final card = ChristmasCard(
        id: widget.card?.id,
        recipientName: _nameController.text.trim(),
        address: _addressController.text.trim(),
        email: _emailController.text.trim().isEmpty
            ? null
            : _emailController.text.trim(),
        phoneNumber: _phoneController.text.trim().isEmpty
            ? null
            : _phoneController.text.trim(),
        cardSent: _cardSent,
        notes: _notesController.text.trim().isEmpty
            ? null
            : _notesController.text.trim(),
        dateSent: _cardSent ? (widget.card?.dateSent ?? DateTime.now()) : null,
      );

      final service = context.read<CardService>();
      bool success;

      if (widget.card == null) {
        success = await service.createCard(card);
      } else {
        success = await service.updateCard(card);
      }

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              widget.card == null
                  ? 'Card added successfully!'
                  : 'Card updated successfully!',
            ),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(service.error ?? 'Failed to save card'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}

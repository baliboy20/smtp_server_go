class ChristmasCard {
  final String? id;
  final String recipientName;
  final String address;
  final String? email;
  final String? phoneNumber;
  final bool cardSent;
  final String? notes;
  final DateTime? dateSent;
  final DateTime createdAt;
  final DateTime updatedAt;

  ChristmasCard({
    this.id,
    required this.recipientName,
    required this.address,
    this.email,
    this.phoneNumber,
    this.cardSent = false,
    this.notes,
    this.dateSent,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  // Convert from JSON
  factory ChristmasCard.fromJson(Map<String, dynamic> json) {
    return ChristmasCard(
      id: json['_id'] ?? json['id'],
      recipientName: json['recipientName'] ?? '',
      address: json['address'] ?? '',
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      cardSent: json['cardSent'] ?? false,
      notes: json['notes'],
      dateSent: json['dateSent'] != null
          ? DateTime.parse(json['dateSent'])
          : null,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : DateTime.now(),
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      if (id != null) '_id': id,
      'recipientName': recipientName,
      'address': address,
      'email': email,
      'phoneNumber': phoneNumber,
      'cardSent': cardSent,
      'notes': notes,
      'dateSent': dateSent?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  // Create a copy with updated fields
  ChristmasCard copyWith({
    String? id,
    String? recipientName,
    String? address,
    String? email,
    String? phoneNumber,
    bool? cardSent,
    String? notes,
    DateTime? dateSent,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ChristmasCard(
      id: id ?? this.id,
      recipientName: recipientName ?? this.recipientName,
      address: address ?? this.address,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      cardSent: cardSent ?? this.cardSent,
      notes: notes ?? this.notes,
      dateSent: dateSent ?? this.dateSent,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/card_list_screen.dart';
import 'services/card_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => CardService(),
      child: MaterialApp(
        title: 'Christmas Card List',
        theme: ThemeData(
          primarySwatch: Colors.red,
          primaryColor: Colors.red[700],
          scaffoldBackgroundColor: Colors.grey[100],
          appBarTheme: AppBarTheme(
            backgroundColor: Colors.red[700],
            foregroundColor: Colors.white,
            elevation: 2,
          ),
          floatingActionButtonTheme: FloatingActionButtonThemeData(
            backgroundColor: Colors.green[700],
          ),
          cardTheme: CardTheme(
            elevation: 3,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        home: const CardListScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

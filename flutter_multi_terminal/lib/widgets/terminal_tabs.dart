import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/terminal_session.dart';
import '../services/pty_service.dart';
import 'terminal_view.dart';

/// Widget that manages multiple terminal tabs
class TerminalTabs extends StatefulWidget {
  const TerminalTabs({Key? key}) : super(key: key);

  @override
  State<TerminalTabs> createState() => _TerminalTabsState();
}

class _TerminalTabsState extends State<TerminalTabs>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final PtyService _ptyService = PtyService();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 0, vsync: this);
    // Create initial terminal
    _createNewTerminal();
  }

  @override
  void dispose() {
    _ptyService.closeAll();
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _createNewTerminal() async {
    final session = await _ptyService.createSession();
    setState(() {
      _tabController = TabController(
        length: _ptyService.sessions.length,
        vsync: this,
        initialIndex: _ptyService.sessions.length - 1,
      );
      _ptyService.setActiveSession(session.id);
    });
  }

  void _closeTerminal(String id) {
    final index = _ptyService.sessions.indexWhere((s) => s.id == id);
    if (index != -1) {
      setState(() {
        _ptyService.removeSession(id);
        if (_ptyService.sessions.isEmpty) {
          _tabController = TabController(length: 0, vsync: this);
        } else {
          final newIndex = index > 0 ? index - 1 : 0;
          _tabController = TabController(
            length: _ptyService.sessions.length,
            vsync: this,
            initialIndex: newIndex,
          );
          if (_ptyService.sessions.isNotEmpty) {
            _ptyService.setActiveSession(_ptyService.sessions[newIndex].id);
          }
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Provider.value(
      value: _ptyService,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xFF2D2D2D),
          toolbarHeight: 40,
          title: _ptyService.sessions.isEmpty
              ? const Text('Multi-Terminal')
              : TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  tabs: _ptyService.sessions.map((session) {
                    return Tab(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(session.title),
                          const SizedBox(width: 8),
                          GestureDetector(
                            onTap: () => _closeTerminal(session.id),
                            child: const Icon(Icons.close, size: 16),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                  onTap: (index) {
                    _ptyService
                        .setActiveSession(_ptyService.sessions[index].id);
                  },
                ),
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              tooltip: 'New Terminal (Cmd+T)',
              onPressed: _createNewTerminal,
            ),
          ],
        ),
        body: _ptyService.sessions.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'No terminals open',
                      style: TextStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: _createNewTerminal,
                      icon: const Icon(Icons.add),
                      label: const Text('Create Terminal'),
                    ),
                  ],
                ),
              )
            : TabBarView(
                controller: _tabController,
                children: _ptyService.sessions.map((session) {
                  return TerminalView(
                    session: session,
                    onClose: () => _closeTerminal(session.id),
                  );
                }).toList(),
              ),
      ),
    );
  }
}

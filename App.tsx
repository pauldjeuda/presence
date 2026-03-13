import React, {useMemo, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable} from 'react-native';
import {BadgeScreen} from './src/screens/BadgeScreen';
import {ReportsScreen} from './src/screens/ReportsScreen';

type TabKey = 'badge' | 'reports';

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('badge');

  const Screen = useMemo(() => {
    return activeTab === 'badge' ? <BadgeScreen /> : <ReportsScreen />;
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Presence Badge</Text>
        <Text style={styles.headerSubtitle}>Pointage GPS et suivi des retards</Text>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabButton, activeTab === 'badge' ? styles.tabButtonActive : null]}
          onPress={() => setActiveTab('badge')}>
          <Text style={[styles.tabText, activeTab === 'badge' ? styles.tabTextActive : null]}>
            Badge
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabButton, activeTab === 'reports' ? styles.tabButtonActive : null]}
          onPress={() => setActiveTab('reports')}>
          <Text style={[styles.tabText, activeTab === 'reports' ? styles.tabTextActive : null]}>
            Rapports
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>{Screen}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#F4F8FF'},
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#102A43',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#486581',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#216CFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#486581',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
});

export default App;

import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {MetricCard} from '../components/MetricCard';
import {RecordCard} from '../components/RecordCard';
import {PresenceService} from '../services/presenceService';
import type {PresenceRecord, ReportBucket} from '../types/presence';
import {buildMonthlyReport, buildWeeklyReport} from '../utils/date';

export function ReportsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<PresenceRecord[]>([]);
  const [weekly, setWeekly] = useState<ReportBucket>({
    totalBadges: 0,
    validatedBadges: 0,
    lateCount: 0,
    lateMinutesTotal: 0,
  });
  const [monthly, setMonthly] = useState<ReportBucket>({
    totalBadges: 0,
    validatedBadges: 0,
    lateCount: 0,
    lateMinutesTotal: 0,
  });

  const load = useCallback(async () => {
    const all = await PresenceService.getRecords();
    const validated = all.filter(item => item.isValidated);
    const lateOnly = validated.filter(item => item.isLate);

    setRecords(lateOnly);
    setWeekly(buildWeeklyReport(validated));
    setMonthly(buildMonthlyReport(validated));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={records}
      keyExtractor={item => item.id}
      renderItem={({item}) => <RecordCard record={item} />}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Rapport des retards</Text>
          <Text style={styles.subtitle}>
            Les cartes passent en rouge léger lorsqu'il y a du retard, sinon en bleu léger.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Semaine en cours</Text>
            <View style={styles.gridRow}>
              <MetricCard title="Badges validés" value={weekly.validatedBadges} />
              <MetricCard title="Retards" value={weekly.lateCount} tone={weekly.lateCount > 0 ? 'red' : 'blue'} />
            </View>
            <View style={styles.gridRow}>
              <MetricCard
                title="Minutes de retard"
                value={weekly.lateMinutesTotal}
                tone={weekly.lateMinutesTotal > 0 ? 'red' : 'blue'}
              />
              <MetricCard title="Total badges" value={weekly.totalBadges} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mois en cours</Text>
            <View style={styles.gridRow}>
              <MetricCard title="Badges validés" value={monthly.validatedBadges} />
              <MetricCard title="Retards" value={monthly.lateCount} tone={monthly.lateCount > 0 ? 'red' : 'blue'} />
            </View>
            <View style={styles.gridRow}>
              <MetricCard
                title="Minutes de retard"
                value={monthly.lateMinutesTotal}
                tone={monthly.lateMinutesTotal > 0 ? 'red' : 'blue'}
              />
              <MetricCard title="Total badges" value={monthly.totalBadges} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Détail des retards</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aucun retard enregistré pour le moment.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {padding: 16, paddingBottom: 30},
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102A43',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#486581',
    marginBottom: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102A43',
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#7B8794',
  },
});

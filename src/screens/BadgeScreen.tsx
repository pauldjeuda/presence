import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {APP_CONFIG} from '../config/appConfig';
import {RecordCard} from '../components/RecordCard';
import {PresenceService} from '../services/presenceService';
import type {PresenceRecord} from '../types/presence';

export function BadgeScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<PresenceRecord[]>([]);

  const load = useCallback(async () => {
    const all = await PresenceService.getRecords();
    setRecords(all);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onBadge = async () => {
    try {
      setLoading(true);
      const result = await PresenceService.checkPresence();
      await load();
      Alert.alert('Badge', result.statusMessage);
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const onClear = async () => {
    Alert.alert('Réinitialiser', 'Supprimer tout l\'historique local ?', [
      {text: 'Annuler', style: 'cancel'},
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await PresenceService.clearRecords();
          await load();
        },
      },
    ]);
  };

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
          <View style={styles.hero}>
            <Text style={styles.title}>Pointer ma présence</Text>
            <Text style={styles.subtitle}>{APP_CONFIG.companyLocation.label}</Text>
            <Text style={styles.subtitle}>Latitude : {APP_CONFIG.companyLocation.latitude.toFixed(6)}</Text>
            <Text style={styles.subtitle}>Longitude : {APP_CONFIG.companyLocation.longitude.toFixed(6)}</Text>
            <Text style={styles.subtitle}>
              Rayon autorisé : {APP_CONFIG.allowedPresenceRadiusMeters} m
            </Text>
            <Text style={styles.subtitle}>
              Heure limite : {String(APP_CONFIG.lateThresholdHour).padStart(2, '0')}:
              {String(APP_CONFIG.lateThresholdMinute).padStart(2, '0')}
            </Text>

            <Pressable style={styles.primaryButton} onPress={onBadge} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Badger maintenant</Text>
              )}
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={onClear}>
              <Text style={styles.secondaryButtonText}>Vider l'historique</Text>
            </Pressable>
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Historique persistant</Text>
            <Text style={styles.sectionHint}>{records.length} enregistrement(s)</Text>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aucun badge enregistré pour le moment.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {padding: 16, paddingBottom: 30},
  hero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102A43',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#486581',
    marginBottom: 5,
  },
  primaryButton: {
    backgroundColor: '#216CFF',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginTop: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: '#EAF3FF',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: '#216CFF',
    fontWeight: '700',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102A43',
  },
  sectionHint: {
    fontSize: 13,
    color: '#7B8794',
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

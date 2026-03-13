import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {PresenceRecord} from '../types/presence';
import {formatDateTime} from '../utils/date';

type Props = {
  record: PresenceRecord;
};

export function RecordCard({record}: Props) {
  const toneStyle = record.isLate ? styles.red : styles.blue;

  return (
    <View style={[styles.card, toneStyle]}>
      <Text style={styles.title}>{record.statusMessage}</Text>
      <Text style={styles.text}>{formatDateTime(record.timestamp)}</Text>
      <Text style={styles.text}>Distance : {record.distance} m</Text>
      <Text style={styles.text}>
        Validation : {record.isValidated ? 'Oui' : 'Non'}
      </Text>
      {record.isValidated ? (
        <Text style={styles.text}>Retard : {record.isLate ? `${record.lateMinutes} min` : 'Aucun'}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  blue: {backgroundColor: '#EAF3FF'},
  red: {backgroundColor: '#FFEAEA'},
  title: {
    fontSize: 15,
    color: '#102A43',
    fontWeight: '800',
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    color: '#486581',
    marginBottom: 4,
  },
});

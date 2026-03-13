import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  title: string;
  value: number;
  tone?: 'blue' | 'red';
};

export function MetricCard({title, value, tone = 'blue'}: Props) {
  return (
    <View style={[styles.card, tone === 'red' ? styles.red : styles.blue]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    minHeight: 96,
  },
  blue: {backgroundColor: '#EAF3FF'},
  red: {backgroundColor: '#FFEAEA'},
  title: {
    fontSize: 13,
    color: '#486581',
    marginBottom: 10,
    fontWeight: '600',
  },
  value: {
    fontSize: 26,
    color: '#102A43',
    fontWeight: '800',
  },
});

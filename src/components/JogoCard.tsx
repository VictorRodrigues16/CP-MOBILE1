import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '@/constants/colors'
import { Jogo } from '@/types'
import React from 'react'

type Props = {
  item: Jogo
}

export function JogoCard({ item }: Props) {
  const finalizado = item.status === 'finalizado'

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.modalidade}</Text>
        </View>
        <Text style={[styles.status, finalizado ? styles.statusFim : styles.statusAg]}>
          {finalizado ? 'Finalizado' : 'Agendado'}
        </Text>
      </View>

      <View style={styles.matchRow}>
        <Text style={styles.team} numberOfLines={1}>{item.time1}</Text>
        <Text style={styles.vs}>
          {finalizado ? `${item.placarTime1}  x  ${item.placarTime2}` : 'x'}
        </Text>
        <Text style={styles.team} numberOfLines={1}>{item.time2}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.detail}>{item.horario}</Text>
        <Text style={styles.sep}>|</Text>
        <Text style={styles.detail}>{item.local}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusAg: {
    color: COLORS.warning,
  },
  statusFim: {
    color: COLORS.success,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  team: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detail: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  sep: {
    color: COLORS.border,
    fontSize: 12,
  },
})

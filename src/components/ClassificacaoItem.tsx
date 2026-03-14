import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '@/constants/colors'
import { Entrada } from '@/types'
import React from 'react'

type Props = {
  item: Entrada
  index: number
}

export function ClassificacaoItem({ item, index }: Props) {
  const pos = index + 1
  const isTop = pos <= 3

  return (
    <View style={[styles.row, isTop && styles.rowTop]}>
      <Text style={[styles.pos, isTop && styles.posTop]}>{pos}.</Text>

      <View style={styles.info}>
        <Text style={styles.name}>{item.time}</Text>
        <Text style={styles.sub}>
          {item.jogos}J{'  '}{item.vitorias}V{'  '}{item.empates}E{'  '}{item.derrotas}D
        </Text>
      </View>

      <Text style={[styles.pontos, isTop && styles.pontosTop]}>{item.pontos} pts</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
    backgroundColor: COLORS.white,
  },
  rowTop: {
    backgroundColor: COLORS.primaryLight,
  },
  pos: {
    width: 36,
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  posTop: {
    color: COLORS.primary,
  },
  info: {
    flex: 1,
    marginLeft: 4,
  },
  name: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  pontos: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    minWidth: 52,
    textAlign: 'right',
  },
  pontosTop: {
    color: COLORS.primary,
  },
})

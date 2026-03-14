import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { COLORS } from '@/constants/colors'
import { MODALIDADES } from '@/constants/modalidades'
import { Modalidade } from '@/types'
import React from 'react'

type Props = {
  selected: Modalidade
  onSelect: (m: Modalidade) => void
}

export function ModalidadeSelector({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {MODALIDADES.map((mod) => (
        <TouchableOpacity
          key={mod}
          style={[styles.chip, selected === mod && styles.chipActive]}
          onPress={() => onSelect(mod)}
          activeOpacity={0.7}
        >
          <Text style={[styles.text, selected === mod && styles.textActive]}>{mod}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  textActive: {
    color: COLORS.white,
  },
})

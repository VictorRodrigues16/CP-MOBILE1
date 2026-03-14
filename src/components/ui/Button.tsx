import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { COLORS } from '@/constants/colors'
import React from 'react'

type Props = {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'danger'
  style?: ViewStyle
}

export function Button({ label, onPress, loading, disabled, variant = 'primary', style }: Props) {
  const bg = variant === 'danger' ? COLORS.error : COLORS.primary

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg }, (loading || disabled) && styles.disabled, style]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
})

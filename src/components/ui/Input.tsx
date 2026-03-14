import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native'
import { COLORS } from '@/constants/colors'
import React from 'react'

type Props = {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
  maxLength?: number
}

export function Input({ label, value, onChangeText, placeholder, keyboardType, maxLength }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 2,
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
})

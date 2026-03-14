import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { ModalidadeSelector } from '@/components/ModalidadeSelector'
import { jogos as jogosState, nextJogoId, incrementNextJogoId } from '@/lib/state'
import { useTimes } from '@/hooks/useTimes'
import { useJogos } from '@/hooks/useJogos'
import { Jogo, Modalidade } from '@/types'
import React from 'react'

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function formatDate(d: Date) {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}
function formatTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

type TeamPickerProps = {
  label: string
  value: string
  options: string[]
  onSelect: (val: string) => void
  excludeValue?: string
}

function TeamPicker({ label, value, options, onSelect, excludeValue }: TeamPickerProps) {
  const [open, setOpen] = useState(false)
  const filtered = options.filter((o) => o !== excludeValue)

  return (
    <View style={pickerStyles.wrapper}>
      <Text style={pickerStyles.label}>{label}</Text>
      <TouchableOpacity style={pickerStyles.btn} onPress={() => setOpen(true)}>
        <Text style={[pickerStyles.btnText, !value && pickerStyles.placeholder]}>
          {value || 'Selecionar time...'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={pickerStyles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={pickerStyles.sheet}>
            <View style={pickerStyles.sheetHeader}>
              <Text style={pickerStyles.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            {filtered.length === 0 ? (
              <View style={pickerStyles.empty}>
                <Text style={pickerStyles.emptyText}>Nenhum time disponível.</Text>
                <Text style={pickerStyles.emptyHint}>Cadastre times na aba "Times".</Text>
              </View>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[pickerStyles.option, item === value && pickerStyles.optionSelected]}
                    onPress={() => {
                      onSelect(item)
                      setOpen(false)
                    }}
                  >
                    <View style={pickerStyles.optionAvatar}>
                      <Text style={pickerStyles.optionAvatarText}>{item.charAt(0)}</Text>
                    </View>
                    <Text
                      style={[
                        pickerStyles.optionText,
                        item === value && pickerStyles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {item === value && (
                      <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

function JogoItem({ item, onDelete }: { item: Jogo; onDelete: () => void }) {
  const isPending = item.status === 'agendado'
  return (
    <View style={listStyles.card}>
      <View style={listStyles.cardTop}>
        <View style={[listStyles.badge, isPending ? listStyles.badgePending : listStyles.badgeDone]}>
          <Text style={[listStyles.badgeText, isPending ? listStyles.badgePendingText : listStyles.badgeDoneText]}>
            {isPending ? 'Pendente' : 'Finalizado'}
          </Text>
        </View>
        <Text style={listStyles.modalidade}>{item.modalidade}</Text>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
        </TouchableOpacity>
      </View>
      <Text style={listStyles.match}>
        {item.time1}
        <Text style={listStyles.vs}> x </Text>
        {item.time2}
      </Text>
      {item.status === 'finalizado' && (
        <Text style={listStyles.score}>
          {item.placarTime1} – {item.placarTime2}
        </Text>
      )}
      <Text style={listStyles.meta}>{item.horario}</Text>
    </View>
  )
}

export default function Jogos() {
  const { times } = useTimes()
  const { jogos, refreshing, refresh, reload } = useJogos()
  console.log('Times disponíveis:', times)
  const nomesTimes = times.map((t) => t.nome || 'Time não especificado')

  const [modalidade, setModalidade] = useState<Modalidade>('Futsal')
  const [time1, setTime1] = useState('')
  const [time2, setTime2] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  function resetForm() {
    setTime1('')
    setTime2('')
    setModalidade('Futsal')
    setDate(new Date())
  }

  function onDateChange(_event: DateTimePickerEvent, selected?: Date) {
    setShowDatePicker(Platform.OS === 'ios')
    if (selected) {
      const merged = new Date(selected)
      merged.setHours(date.getHours(), date.getMinutes())
      setDate(merged)
    }
  }

  function onTimeChange(_event: DateTimePickerEvent, selected?: Date) {
    setShowTimePicker(Platform.OS === 'ios')
    if (selected) {
      const merged = new Date(date)
      merged.setHours(selected.getHours(), selected.getMinutes())
      setDate(merged)
    }
  }

  async function handleSubmit() {
    if (!time1 || !time2) {
      Alert.alert('Campos obrigatórios', 'Selecione os dois times.')
      return
    }
    if (time1 === time2) {
      Alert.alert('Times iguais', 'Os dois times precisam ser diferentes.')
      return
    }
    const horario = `${formatDate(date)} ${formatTime(date)}`
    setLoading(true)
    try {
      const novoJogo: Jogo = {
        id: nextJogoId(),
        modalidade,
        time1,
        time2,
        horario,
        local: '',
        status: 'agendado',
      }
      incrementNextJogoId()
      jogosState.push(novoJogo)
      resetForm()
      setShowForm(false)
      reload()
      Alert.alert('Jogo adicionado', `${time1} x ${time2} em ${horario}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao adicionar jogo.'
      Alert.alert('Erro', msg)
    } finally {
      setLoading(false)
    }
  }

  function handleDeleteJogo(id: number) {
    Alert.alert('Excluir jogo', 'Deseja remover este jogo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const idx = jogosState.findIndex((j) => j.id === id)
          if (idx !== -1) jogosState.splice(idx, 1)
          reload()
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View>
          <Text style={styles.toolbarTitle}>Jogos agendados</Text>
          <Text style={styles.toolbarSub}>{jogos.length} jogo{jogos.length !== 1 ? 's' : ''} no total</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addBtnText}>Novo jogo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de jogos */}
      <FlatList
        data={jogos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="football-outline" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Nenhum jogo cadastrado</Text>
            <Text style={styles.emptyDesc}>Toque em "Novo jogo" para agendar uma partida.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <JogoItem item={item} onDelete={() => handleDeleteJogo(item.id)} />
        )}
      />

      {/* Modal de novo jogo */}
      <Modal
        visible={showForm}
        animationType="slide"
        onRequestClose={() => setShowForm(false)}
      >
        <View style={formStyles.container}>
          <View style={formStyles.header}>
            <Text style={formStyles.headerTitle}>Novo Jogo</Text>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={formStyles.scroll}
            contentContainerStyle={formStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={formStyles.sectionLabel}>Modalidade</Text>
            <View style={formStyles.selectorWrapper}>
              <ModalidadeSelector selected={modalidade} onSelect={setModalidade} />
            </View>

            <TeamPicker
              label="Time 1"
              value={time1}
              options={nomesTimes}
              onSelect={setTime1}
              excludeValue={time2}
            />
            <TeamPicker
              label="Time 2"
              value={time2}
              options={nomesTimes}
              onSelect={setTime2}
              excludeValue={time1}
            />

            <Text style={formStyles.fieldLabel}>Data e Hora</Text>
            <View style={formStyles.dateRow}>
              <TouchableOpacity
                style={formStyles.dateBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                <Text style={formStyles.dateBtnText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={formStyles.dateBtn}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                <Text style={formStyles.dateBtnText}>{formatTime(date)}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
            )}
            {showTimePicker && (
              <DateTimePicker value={date} mode="time" display="default" onChange={onTimeChange} />
            )}

            {/* Preview */}
            {time1 && time2 && (
              <View style={formStyles.preview}>
                <Text style={formStyles.previewMod}>{modalidade}</Text>
                <Text style={formStyles.previewMatch}>
                  {time1} <Text style={formStyles.previewVs}>x</Text> {time2}
                </Text>
                <Text style={formStyles.previewDate}>
                  {formatDate(date)} às {formatTime(date)}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={formStyles.footer}>
            <TouchableOpacity style={formStyles.cancelBtn} onPress={() => setShowForm(false)}>
              <Text style={formStyles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[formStyles.saveBtn, loading && formStyles.saveBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={formStyles.saveBtnText}>Adicionar Jogo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const pickerStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  optionSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  optionAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.primary,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
})

const listStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: '#fef3c7',
  },
  badgeDone: {
    backgroundColor: '#d1fae5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badgePendingText: {
    color: '#92400e',
  },
  badgeDoneText: {
    color: '#065f46',
  },
  modalidade: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  match: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  vs: {
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  score: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toolbarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  toolbarSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
})

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  selectorWrapper: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 13,
    gap: 8,
  },
  dateBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  preview: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  previewMod: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  previewMatch: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 6,
  },
  previewVs: {
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  previewDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
})

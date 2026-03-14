import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { useTimes } from '@/hooks/useTimes'
import { times as timesState, nextTimeId, incrementNextTimeId } from '@/lib/state'
import { Time } from '@/types'
import React from 'react'

type ModalState =
  | { type: 'none' }
  | { type: 'criar' }
  | { type: 'editar'; time: Time }

export default function Times() {
  const { times, loading, refreshing, refresh, reload } = useTimes()
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)

  function openCriar() {
    setNome('')
    setModal({ type: 'criar' })
  }

  function openEditar(time: Time) {
    setNome(time.nome)
    setModal({ type: 'editar', time })
  }

  function fecharModal() {
    setModal({ type: 'none' })
    setNome('')
  }

  async function handleSalvar() {
    const nomeTrimmed = nome.trim()
    if (!nomeTrimmed) {
      Alert.alert('Campo obrigatório', 'Informe o nome do time.')
      return
    }
    setSaving(true)
    try {
      if (modal.type === 'criar') {
        const existe = timesState.find((t) => t.nome.toLowerCase() === nomeTrimmed.toLowerCase())
        if (existe) {
          Alert.alert('Erro', 'Já existe um time com esse nome.')
          return
        }
        timesState.push({ id: nextTimeId(), nome: nomeTrimmed })
        incrementNextTimeId()
      } else if (modal.type === 'editar') {
        const t = timesState.find((t) => t.id === modal.time.id)
        if (t) t.nome = nomeTrimmed
      }
      fecharModal()
      reload()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Não foi possível salvar o time.'
      Alert.alert('Erro', msg)
    } finally {
      setSaving(false)
    }
  }

  function confirmarExcluir(time: Time) {
    Alert.alert(
      'Excluir time',
      `Deseja remover "${time.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const idx = timesState.findIndex((t) => t.id === time.id)
            if (idx !== -1) timesState.splice(idx, 1)
            reload()
          },
        },
      ]
    )
  }

  const isModalOpen = modal.type !== 'none'
  const modalTitle = modal.type === 'criar' ? 'Novo Time' : 'Editar Time'

  return (
    <View style={styles.container}>
      {/* Header da seção */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topTitle}>Times cadastrados</Text>
          <Text style={styles.topSub}>{times.length} equipe{times.length !== 1 ? 's' : ''} no sistema</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openCriar}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addBtnText}>Novo time</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={times}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.primary} />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="people-outline" size={40} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Nenhum time cadastrado</Text>
              <Text style={styles.emptyDesc}>Toque em "Novo time" para adicionar uma equipe.</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={[styles.card, index === 0 && styles.cardFirst]}>
              <View style={styles.cardAvatar}>
                <Text style={styles.cardAvatarText}>
                  {item.nome.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.cardName}>{item.nome}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => openEditar(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconBtn, styles.iconBtnDelete]}
                  onPress={() => confirmarExcluir(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal de criar/editar */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={fecharModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Nome do time</Text>
            <TextInput
              style={styles.fieldInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: ADS, ES Lins, DS..."
              placeholderTextColor={COLORS.textMuted}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSalvar}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={fecharModal}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSalvar}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  topSub: {
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
  loader: {
    marginTop: 60,
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardFirst: {
    marginTop: 8,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDelete: {
    backgroundColor: '#fee2e2',
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
})

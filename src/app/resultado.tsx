import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { MODALIDADES } from '@/constants/modalidades'
import { useJogos } from '@/hooks/useJogos'
import { jogos as jogosState } from '@/lib/state'
import { Jogo, Modalidade } from '@/types'
import React from 'react'

type FiltroModalidade = Modalidade | 'Todos'

function ScoreModal({
  jogo,
  onClose,
  onSuccess,
  isEditing,
}: {
  jogo: Jogo
  onClose: () => void
  onSuccess: () => void
  isEditing: boolean
}) {
  const [p1, setP1] = useState(isEditing ? String(jogo.placarTime1 ?? '') : '')
  const [p2, setP2] = useState(isEditing ? String(jogo.placarTime2 ?? '') : '')
  const [saving, setSaving] = useState(false)

  async function handleSalvar() {
    const n1 = parseInt(p1)
    const n2 = parseInt(p2)
    if (isNaN(n1) || isNaN(n2) || n1 < 0 || n2 < 0) {
      Alert.alert('Placar inválido', 'Informe números válidos para os dois placares.')
      return
    }
    setSaving(true)
    try {
      const j = jogosState.find((x) => x.id === jogo.id)
      if (j) {
        j.placarTime1 = n1
        j.placarTime2 = n2
        j.status = 'finalizado'
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar resultado.'
      Alert.alert('Erro', msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={scoreModalStyles.overlay}>
        <View style={scoreModalStyles.box}>
          <View style={scoreModalStyles.header}>
            <Text style={scoreModalStyles.title}>
              {isEditing ? 'Editar Resultado' : 'Registrar Resultado'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={scoreModalStyles.modBadge}>
            <Text style={scoreModalStyles.modText}>{jogo.modalidade}</Text>
          </View>

          <View style={scoreModalStyles.scoreRow}>
            <View style={scoreModalStyles.scoreTeam}>
              <Text style={scoreModalStyles.teamName} numberOfLines={1}>{jogo.time1}</Text>
              <TextInput
                style={scoreModalStyles.scoreInput}
                value={p1}
                onChangeText={setP1}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.textMuted}
                maxLength={3}
                autoFocus
              />
            </View>

            <Text style={scoreModalStyles.scoreSep}>×</Text>

            <View style={scoreModalStyles.scoreTeam}>
              <Text style={scoreModalStyles.teamName} numberOfLines={1}>{jogo.time2}</Text>
              <TextInput
                style={scoreModalStyles.scoreInput}
                value={p2}
                onChangeText={setP2}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.textMuted}
                maxLength={3}
              />
            </View>
          </View>

          <View style={scoreModalStyles.footer}>
            <TouchableOpacity style={scoreModalStyles.cancelBtn} onPress={onClose}>
              <Text style={scoreModalStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[scoreModalStyles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSalvar}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={scoreModalStyles.saveText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

function JogoResultadoCard({
  item,
  onRegistrar,
  onEditar,
}: {
  item: Jogo
  onRegistrar: () => void
  onEditar: () => void
}) {
  const isPending = item.status === 'agendado'

  let vencedor: 'time1' | 'time2' | 'empate' | null = null
  if (!isPending) {
    const p1 = item.placarTime1 ?? 0
    const p2 = item.placarTime2 ?? 0
    vencedor = p1 > p2 ? 'time1' : p2 > p1 ? 'time2' : 'empate'
  }

  return (
    <View style={cardStyles.card}>
      {/* Topo */}
      <View style={cardStyles.top}>
        <View style={[cardStyles.statusDot, isPending ? cardStyles.dotPending : cardStyles.dotDone]} />
        <Text style={cardStyles.modalidade}>{item.modalidade}</Text>
        <Text style={cardStyles.horario}>{item.horario}</Text>
      </View>

      {/* Placar */}
      <View style={cardStyles.matchRow}>
        <Text
          style={[
            cardStyles.team,
            !isPending && vencedor === 'time1' && cardStyles.teamWinner,
          ]}
          numberOfLines={1}
        >
          {item.time1}
        </Text>

        {isPending ? (
          <View style={cardStyles.pendingScore}>
            <Text style={cardStyles.pendingScoreText}>vs</Text>
          </View>
        ) : (
          <View style={cardStyles.scoreBox}>
            <Text style={cardStyles.score}>
              {item.placarTime1}
              <Text style={cardStyles.scoreSep}> – </Text>
              {item.placarTime2}
            </Text>
          </View>
        )}

        <Text
          style={[
            cardStyles.team,
            cardStyles.teamRight,
            !isPending && vencedor === 'time2' && cardStyles.teamWinner,
          ]}
          numberOfLines={1}
        >
          {item.time2}
        </Text>
      </View>

      {/* Rodapé */}
      {isPending ? (
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onRegistrar}>
          <Ionicons name="flag-outline" size={14} color={COLORS.white} />
          <Text style={cardStyles.actionBtnText}>Registrar resultado</Text>
        </TouchableOpacity>
      ) : (
        <View style={cardStyles.doneRow}>
          {vencedor === 'empate' ? (
            <Text style={cardStyles.resultLabel}>Empate</Text>
          ) : (
            <Text style={cardStyles.resultLabel}>
              Vencedor: <Text style={cardStyles.resultWinner}>
                {vencedor === 'time1' ? item.time1 : item.time2}
              </Text>
            </Text>
          )}
          <TouchableOpacity style={cardStyles.editBtn} onPress={onEditar}>
            <Ionicons name="pencil-outline" size={13} color={COLORS.primary} />
            <Text style={cardStyles.editBtnText}>Editar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default function Resultados() {
  const { jogos, refreshing, refresh, reload } = useJogos()
  const [filtro, setFiltro] = useState<FiltroModalidade>('Todos')
  const [scoreJogo, setScoreJogo] = useState<Jogo | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const filtrados = jogos.filter((j) => filtro === 'Todos' || j.modalidade === filtro)
  const pendentes = filtrados.filter((j) => j.status === 'agendado')
  const finalizados = filtrados.filter((j) => j.status === 'finalizado')
  const ordenados = [...pendentes, ...finalizados]

  function handleRegistrar(jogo: Jogo) {
    setIsEditing(false)
    setScoreJogo(jogo)
  }

  function handleEditar(jogo: Jogo) {
    setIsEditing(true)
    setScoreJogo(jogo)
  }

  const filtroOptions: FiltroModalidade[] = ['Todos', ...MODALIDADES]

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {filtroOptions.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filtro === f && styles.filterChipActive]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filterChipText, filtro === f && styles.filterChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contadores */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pendentes.length}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.statValueDone]}>{finalizados.length}</Text>
          <Text style={styles.statLabel}>Finalizados</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{ordenados.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <FlatList
        data={ordenados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="flag-outline" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Sem jogos encontrados</Text>
            <Text style={styles.emptyDesc}>
              {filtro !== 'Todos'
                ? `Nenhum jogo de ${filtro} registrado.`
                : 'Adicione jogos na aba "Jogos".'}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <>
            {index === 0 && pendentes.length > 0 && (
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.sectionTitle}>Aguardando resultado</Text>
              </View>
            )}
            {index === pendentes.length && finalizados.length > 0 && (
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.sectionTitle}>Finalizados</Text>
              </View>
            )}
            <JogoResultadoCard
              item={item}
              onRegistrar={() => handleRegistrar(item)}
              onEditar={() => handleEditar(item)}
            />
          </>
        )}
      />

      {scoreJogo && (
        <ScoreModal
          jogo={scoreJogo}
          isEditing={isEditing}
          onClose={() => setScoreJogo(null)}
          onSuccess={reload}
        />
      )}
    </View>
  )
}

const scoreModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  box: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  modBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  scoreTeam: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
  },
  scoreSep: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.textMuted,
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
})

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotPending: {
    backgroundColor: '#f59e0b',
  },
  dotDone: {
    backgroundColor: COLORS.success,
  },
  modalidade: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  horario: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  team: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  teamRight: {
    textAlign: 'right',
  },
  teamWinner: {
    color: COLORS.primary,
  },
  pendingScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  pendingScoreText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  scoreBox: {
    backgroundColor: COLORS.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  score: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  scoreSep: {
    fontWeight: '300',
    color: '#9ca3af',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  resultWinner: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterScroll: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  statValueDone: {
    color: COLORS.success,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
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

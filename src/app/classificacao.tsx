import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { COLORS } from '@/constants/colors'
import { ModalidadeSelector } from '@/components/ModalidadeSelector'
import { useClassificacao } from '@/hooks/useClassificacao'
import { Entrada, Modalidade } from '@/types'
import React from 'react'

const MODALIDADE_ICONS: Record<Modalidade, string> = {
  Futsal: 'Futsal',
  Volei: 'Vôlei',
  Basquete: 'Basquete',
  'E-sports': 'E-sports',
}

function PodiumCard({ item, rank }: { item: Entrada; rank: 1 | 2 | 3 }) {
  const medals = ['1º', '2º', '3º'] as const
  const isFirst = rank === 1

  return (
    <View style={[podiumStyles.card, isFirst ? podiumStyles.first : podiumStyles.other]}>
      <View
        style={[
          podiumStyles.badge,
          rank === 1 && podiumStyles.badgeGold,
          rank === 2 && podiumStyles.badgeSilver,
          rank === 3 && podiumStyles.badgeBronze,
        ]}
      >
        <Text style={podiumStyles.badgeText}>{medals[rank - 1]}</Text>
      </View>
      <Text style={[podiumStyles.name, isFirst && podiumStyles.nameFirst]}>{item.time}</Text>
      <Text style={[podiumStyles.pts, isFirst && podiumStyles.ptsFirst]}>{item.pontos}</Text>
      <Text style={podiumStyles.ptsLabel}>pontos</Text>
      <Text style={podiumStyles.stats}>
        {item.vitorias}V · {item.empates}E · {item.derrotas}D
      </Text>
    </View>
  )
}

function TableRow({ item, position }: { item: Entrada; position: number }) {
  return (
    <View style={tableStyles.row}>
      <View style={tableStyles.posWrapper}>
        <Text style={tableStyles.pos}>{position}</Text>
      </View>
      <Text style={tableStyles.name}>{item.time}</Text>
      <Text style={tableStyles.stat}>{item.jogos}</Text>
      <Text style={tableStyles.stat}>{item.vitorias}</Text>
      <Text style={tableStyles.stat}>{item.empates}</Text>
      <Text style={tableStyles.stat}>{item.derrotas}</Text>
      <Text style={tableStyles.pts}>{item.pontos}</Text>
    </View>
  )
}

export default function Classificacao() {
  const { modalidade: paramModalidade } = useLocalSearchParams<{ modalidade?: string }>()
  const [modalidade, setModalidade] = useState<Modalidade>(
    (paramModalidade as Modalidade) ?? 'Futsal'
  )
  const { dados, loading, refreshing, refresh } = useClassificacao(modalidade)

  useEffect(() => {
    if (paramModalidade) setModalidade(paramModalidade as Modalidade)
  }, [paramModalidade])

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [refresh])
  )

  const top3 = dados.slice(0, 3)
  const rest = dados.slice(3)

  return (
    <View style={styles.container}>
      <ModalidadeSelector selected={modalidade} onSelect={setModalidade} />

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={styles.loader} size="large" />
      ) : dados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sem dados</Text>
          <Text style={styles.emptyDesc}>
            Nenhuma equipe registrada em {MODALIDADE_ICONS[modalidade]} ainda.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rest}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <>
              {/* Pódio */}
              <View style={styles.podiumSection}>
                {top3.length === 1 && (
                  <PodiumCard item={top3[0]} rank={1} />
                )}
                {top3.length === 2 && (
                  <>
                    <PodiumCard item={top3[0]} rank={1} />
                    <View style={styles.podiumRow}>
                      <PodiumCard item={top3[1]} rank={2} />
                    </View>
                  </>
                )}
                {top3.length >= 3 && (
                  <>
                    <PodiumCard item={top3[0]} rank={1} />
                    <View style={styles.podiumRow}>
                      <PodiumCard item={top3[1]} rank={2} />
                      <PodiumCard item={top3[2]} rank={3} />
                    </View>
                  </>
                )}
              </View>

              {/* Cabeçalho da tabela */}
              {rest.length > 0 && (
                <View style={tableStyles.header}>
                  <View style={tableStyles.posWrapper} />
                  <Text style={[tableStyles.headerCell, { flex: 1 }]}>Time</Text>
                  <Text style={tableStyles.headerCell}>J</Text>
                  <Text style={tableStyles.headerCell}>V</Text>
                  <Text style={tableStyles.headerCell}>E</Text>
                  <Text style={tableStyles.headerCell}>D</Text>
                  <Text style={[tableStyles.headerCell, tableStyles.headerPts]}>Pts</Text>
                </View>
              )}
            </>
          }
          renderItem={({ item, index }) => (
            <TableRow item={item} position={index + 4} />
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  )
}

const podiumStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  first: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    marginBottom: 10,
    paddingVertical: 22,
  },
  other: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeGold: { backgroundColor: 'rgba(255,255,255,0.25)' },
  badgeSilver: { backgroundColor: '#f3f4f6' },
  badgeBronze: { backgroundColor: '#fef3c7' },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  nameFirst: { color: '#ffffff', fontSize: 22 },
  pts: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 4,
  },
  ptsFirst: { color: '#ffffff' },
  ptsLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: -2,
  },
  stats: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
})

const tableStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  headerCell: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    width: 30,
    textAlign: 'center',
  },
  headerPts: {
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  posWrapper: {
    width: 28,
    alignItems: 'center',
  },
  pos: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  stat: {
    width: 30,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  pts: {
    width: 30,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  podiumSection: {
    padding: 16,
    paddingBottom: 4,
  },
  podiumRow: {
    flexDirection: 'row',
    gap: 10,
  },
  loader: {
    marginTop: 60,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
})

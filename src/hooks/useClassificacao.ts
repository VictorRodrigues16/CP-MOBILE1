import { useCallback, useEffect, useState } from 'react'
import { Entrada, Modalidade } from '@/types'
import { computeClassificacao } from '@/lib/state'

export function useClassificacao(modalidade: Modalidade) {
  const [dados, setDados] = useState<Entrada[]>(() => computeClassificacao(modalidade))
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setDados(computeClassificacao(modalidade))
  }, [modalidade])

  const refresh = useCallback(() => {
    setRefreshing(true)
    setDados(computeClassificacao(modalidade))
    setRefreshing(false)
  }, [modalidade])

  return { dados, loading: false, refreshing, refresh }
}

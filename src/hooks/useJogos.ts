import { useCallback, useState } from 'react'
import { Jogo } from '@/types'
import { jogos } from '@/lib/state'

export function useJogos() {
  const [jogosState, setJogosState] = useState<Jogo[]>([...jogos])
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(() => {
    setJogosState([...jogos])
    setRefreshing(false)
  }, [])

  const refresh = useCallback(() => {
    setRefreshing(true)
    load()
  }, [load])

  return { jogos: jogosState, refreshing, refresh, reload: load }
}

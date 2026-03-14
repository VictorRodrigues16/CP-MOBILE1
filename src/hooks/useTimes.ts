import { useCallback, useState } from 'react'
import { Time } from '@/types'
import { times } from '@/lib/state'

export function useTimes() {
  const [list, setList] = useState<Time[]>(times)
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(() => {
    setRefreshing(true)
    setList([...times])
    setRefreshing(false)
  }, [])

  return { times: list, loading: false, refreshing, refresh, reload: refresh }
}

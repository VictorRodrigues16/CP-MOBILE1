import AsyncStorage from '@react-native-async-storage/async-storage'
import { Jogo } from '@/types'
import { STORAGE_KEYS } from '@/constants/storageKeys'

export async function getJogos(): Promise<Jogo[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.JOGOS)
  return raw ? (JSON.parse(raw) as Jogo[]) : []
}

export async function setJogos(jogos: Jogo[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.JOGOS, JSON.stringify(jogos))
}

export async function appendJogo(jogo: Jogo): Promise<void> {
  const lista = await getJogos()
  await setJogos([...lista, jogo])
}

export async function clearJogos(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.JOGOS)
}

export async function updateJogo(id: number, changes: Partial<Jogo>): Promise<void> {
  const lista = await getJogos()
  const updated = lista.map((j) => (j.id === id ? { ...j, ...changes } : j))
  await setJogos(updated)
}

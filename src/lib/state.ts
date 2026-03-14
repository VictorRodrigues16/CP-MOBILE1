import type { Time, Entrada, Jogo, Modalidade } from '@/types'

export const times: Time[] = [
  { id: 1, nome: 'ADS' },
  { id: 2, nome: 'ES Lins' },
  { id: 3, nome: 'DS' },
  { id: 4, nome: 'SI' },
  { id: 5, nome: 'ES Paulista' },
]

export const jogos: Jogo[] = []

export function computeClassificacao(modalidade: Modalidade): Entrada[] {
  const map = new Map<string, Entrada>()
  let nextId = 1

  const jogosModalidade = jogos.filter(
    (j) => j.modalidade === modalidade && j.status === 'finalizado'
  )

  for (const j of jogosModalidade) {
    const p1 = j.placarTime1 ?? 0
    const p2 = j.placarTime2 ?? 0
    const empate = p1 === p2

    for (const [nomeTime, venceu] of [[j.time1, p1 > p2], [j.time2, p2 > p1]] as [string, boolean][]) {
      if (!map.has(nomeTime)) {
        map.set(nomeTime, {
          id: nextId++,
          modalidade,
          time: nomeTime,
          pontos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          jogos: 0,
        })
      }
      const entrada = map.get(nomeTime)!
      entrada.jogos += 1
      if (empate) {
        entrada.empates += 1
        entrada.pontos += 1
      } else if (venceu) {
        entrada.vitorias += 1
        entrada.pontos += 3
      } else {
        entrada.derrotas += 1
      }
    }
  }

  return [...map.values()].sort((a, b) => b.pontos - a.pontos)
}

let _nextTimeId = 6
let _nextJogoId = 4

export function nextTimeId() { return _nextTimeId }
export function incrementNextTimeId() { _nextTimeId++ }

export function nextJogoId() { return _nextJogoId }
export function incrementNextJogoId() { _nextJogoId++ }

import { jogos, classificacao } from '@/lib/state'
import type { ResultadoPayload, Entrada } from '@/types'

export async function POST(request: Request): Promise<Response> {
  const body: ResultadoPayload = await request.json()
  const { jogoId, placarTime1, placarTime2 } = body

  if (jogoId === undefined || placarTime1 === undefined || placarTime2 === undefined) {
    return Response.json(
      { error: 'Campos obrigatorios: jogoId, placarTime1, placarTime2' },
      { status: 400 }
    )
  }

  const jogo = jogos.find((j) => j.id === Number(jogoId))
  if (!jogo) {
    return Response.json({ error: 'Jogo nao encontrado' }, { status: 404 })
  }

  if (jogo.status === 'finalizado') {
    return Response.json({ error: 'Este jogo ja foi finalizado' }, { status: 409 })
  }

  jogo.status = 'finalizado'
  jogo.placarTime1 = Number(placarTime1)
  jogo.placarTime2 = Number(placarTime2)

  const p1 = Number(placarTime1)
  const p2 = Number(placarTime2)
  const empate = p1 === p2

  const atualizar = (nomeTime: string, venceu: boolean) => {
    let entrada: Entrada | undefined = classificacao.find(
      (c) => c.modalidade === jogo.modalidade && c.time === nomeTime
    )
    if (!entrada) {
      entrada = {
        id: classificacao.length + 1,
        modalidade: jogo.modalidade,
        time: nomeTime,
        pontos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        jogos: 0,
      }
      classificacao.push(entrada)
    }
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

  atualizar(jogo.time1, p1 > p2)
  atualizar(jogo.time2, p2 > p1)

  return Response.json({ message: 'Resultado registrado com sucesso', jogo })
}

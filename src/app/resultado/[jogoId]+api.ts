import { jogos, classificacao } from '@/lib/state'
import type { Entrada } from '@/types'

export async function PUT(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname
  const jogoId = Number(pathname.split('/').pop())

  const body = await request.json()
  const { placarTime1, placarTime2 } = body

  if (placarTime1 === undefined || placarTime2 === undefined) {
    return Response.json(
      { error: 'Campos obrigatorios: placarTime1, placarTime2' },
      { status: 400 }
    )
  }

  const jogo = jogos.find((j) => j.id === jogoId)
  if (!jogo) {
    return Response.json({ error: 'Jogo nao encontrado' }, { status: 404 })
  }

  if (jogo.status !== 'finalizado') {
    return Response.json({ error: 'Jogo ainda nao foi finalizado' }, { status: 400 })
  }

  // Reverter pontuação anterior
  const reverter = (nomeTime: string, eraVencedor: boolean, eraEmpate: boolean) => {
    const entrada = classificacao.find(
      (c) => c.modalidade === jogo.modalidade && c.time === nomeTime
    )
    if (!entrada) return
    entrada.jogos -= 1
    if (eraEmpate) {
      entrada.empates -= 1
      entrada.pontos -= 1
    } else if (eraVencedor) {
      entrada.vitorias -= 1
      entrada.pontos -= 3
    } else {
      entrada.derrotas -= 1
    }
  }

  const oldP1 = jogo.placarTime1 ?? 0
  const oldP2 = jogo.placarTime2 ?? 0
  const oldEmpate = oldP1 === oldP2
  reverter(jogo.time1, oldP1 > oldP2, oldEmpate)
  reverter(jogo.time2, oldP2 > oldP1, oldEmpate)

  // Aplicar nova pontuação
  const newP1 = Number(placarTime1)
  const newP2 = Number(placarTime2)
  jogo.placarTime1 = newP1
  jogo.placarTime2 = newP2

  const novoEmpate = newP1 === newP2
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
    if (novoEmpate) {
      entrada.empates += 1
      entrada.pontos += 1
    } else if (venceu) {
      entrada.vitorias += 1
      entrada.pontos += 3
    } else {
      entrada.derrotas += 1
    }
  }

  atualizar(jogo.time1, newP1 > newP2)
  atualizar(jogo.time2, newP2 > newP1)

  return Response.json({ message: 'Resultado atualizado com sucesso', jogo })
}

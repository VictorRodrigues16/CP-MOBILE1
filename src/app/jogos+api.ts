import { jogos, nextJogoId, incrementNextJogoId } from '@/lib/state'
import type { NovoJogoPayload } from '@/types'

export async function GET(_request: Request): Promise<Response> {
  return Response.json(jogos)
}

export async function POST(request: Request): Promise<Response> {
  const body: NovoJogoPayload = await request.json()
  const { modalidade, time1, time2, horario, local } = body

  if (!modalidade || !time1 || !time2 || !horario) {
    return Response.json(
      { error: 'Campos obrigatorios: modalidade, time1, time2, horario' },
      { status: 400 }
    )
  }

  if (time1 === time2) {
    return Response.json(
      { error: 'Os dois times nao podem ser iguais' },
      { status: 400 }
    )
  }

  const novoJogo = {
    id: nextJogoId(),
    modalidade,
    time1,
    time2,
    horario,
    local: local || '',
    status: 'agendado' as const,
  }

  incrementNextJogoId()
  jogos.push(novoJogo)

  return Response.json(novoJogo, { status: 201 })
}

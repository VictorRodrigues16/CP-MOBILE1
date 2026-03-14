import { times, nextTimeId, incrementNextTimeId } from '@/lib/state'
import type { NovoTimePayload } from '@/types'

export async function GET(_request: Request): Promise<Response> {
  return Response.json(times)
}

export async function POST(request: Request): Promise<Response> {
  const body: NovoTimePayload = await request.json()
  const { nome } = body

  if (!nome || !nome.trim()) {
    return Response.json({ error: 'Campo obrigatorio: nome' }, { status: 400 })
  }

  const nomeTrimmed = nome.trim()
  const existe = times.find((t) => t.nome.toLowerCase() === nomeTrimmed.toLowerCase())
  if (existe) {
    return Response.json({ error: 'Ja existe um time com esse nome' }, { status: 409 })
  }

  const novoTime = { id: nextTimeId(), nome: nomeTrimmed }
  incrementNextTimeId()
  times.push(novoTime)

  return Response.json(novoTime, { status: 201 })
}

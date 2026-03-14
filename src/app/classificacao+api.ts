import { computeClassificacao } from '@/lib/state'
import type { Modalidade } from '@/types'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const modalidade = searchParams.get('modalidade') as Modalidade | null

  if (!modalidade) {
    return Response.json({ error: 'Parâmetro modalidade é obrigatório' }, { status: 400 })
  }

  return Response.json(computeClassificacao(modalidade))
}

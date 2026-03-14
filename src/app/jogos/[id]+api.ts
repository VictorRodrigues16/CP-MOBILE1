import { jogos } from '@/lib/state'

export async function DELETE(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname
  const id = Number(pathname.split('/').pop())

  const index = jogos.findIndex((j) => j.id === id)
  if (index === -1) {
    return Response.json({ error: 'Jogo nao encontrado' }, { status: 404 })
  }

  const [removed] = jogos.splice(index, 1)
  return Response.json({ message: 'Jogo removido', jogo: removed })
}

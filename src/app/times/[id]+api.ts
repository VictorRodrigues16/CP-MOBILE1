import { times, jogos, classificacao } from '@/lib/state'

export async function PUT(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname
  const id = Number(pathname.split('/').pop())

  const body = await request.json()
  const { nome } = body

  if (!nome || !nome.trim()) {
    return Response.json({ error: 'Campo obrigatorio: nome' }, { status: 400 })
  }

  const time = times.find((t) => t.id === id)
  if (!time) {
    return Response.json({ error: 'Time nao encontrado' }, { status: 404 })
  }

  const nomeTrimmed = nome.trim()
  const conflito = times.find(
    (t) => t.id !== id && t.nome.toLowerCase() === nomeTrimmed.toLowerCase()
  )
  if (conflito) {
    return Response.json({ error: 'Ja existe um time com esse nome' }, { status: 409 })
  }

  // Atualizar referências nos jogos e na classificação
  jogos.forEach((j) => {
    if (j.time1 === time.nome) j.time1 = nomeTrimmed
    if (j.time2 === time.nome) j.time2 = nomeTrimmed
  })
  classificacao.forEach((c) => {
    if (c.time === time.nome) c.time = nomeTrimmed
  })
  time.nome = nomeTrimmed

  return Response.json(time)
}

export async function DELETE(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname
  const id = Number(pathname.split('/').pop())

  const index = times.findIndex((t) => t.id === id)
  if (index === -1) {
    return Response.json({ error: 'Time nao encontrado' }, { status: 404 })
  }

  const [removed] = times.splice(index, 1)
  return Response.json({ message: 'Time removido', time: removed })
}

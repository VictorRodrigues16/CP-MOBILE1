export type Modalidade = 'Futsal' | 'Volei' | 'Basquete' | 'E-sports'

export type Time = {
  id: number
  nome: string
}

export type Entrada = {
  id: number
  time: string
  modalidade: Modalidade
  pontos: number
  vitorias: number
  empates: number
  derrotas: number
  jogos: number
}

export type JogoStatus = 'agendado' | 'finalizado'

export type Jogo = {
  id: number
  modalidade: Modalidade
  time1: string
  time2: string
  horario: string
  local: string
  status: JogoStatus
  placarTime1?: number
  placarTime2?: number
}

export type NovoJogoPayload = {
  modalidade: Modalidade
  time1: string
  time2: string
  horario: string
  local: string
}

export type ResultadoPayload = {
  jogoId: number
  placarTime1: number
  placarTime2: number
}

export type NovoTimePayload = {
  nome: string
}

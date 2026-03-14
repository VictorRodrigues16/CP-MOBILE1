# CP1 — Gerenciador de Jogos

## Descrição

Aplicativo mobile desenvolvido com **React Native + Expo Router** para gerenciar campeonatos esportivos universitários. Permite cadastrar times, agendar jogos, registrar resultados e acompanhar o ranking por modalidade em tempo real.

### Funcionalidades

- **Ranking** — classificação calculada dinamicamente a partir dos resultados registrados, separada por modalidade. Atualiza automaticamente ao voltar para a aba.
- **Jogos** — agendamento de partidas com seleção de modalidade, times, data e hora.
- **Times** — cadastro, edição e exclusão de equipes.
- **Resultados** — registro e edição de placares; ao salvar, o ranking é recalculado.

---


## Como executar

```bash
# Instalar dependências
npm install

# Iniciar projeto
npm run start

```

---

## Estrutura de pastas

```
src/
├── app/                        # Telas e API routes (Expo Router)
│   ├── _layout.tsx             # Layout raiz com navegação por abas
│   ├── index.tsx               # Tela inicial (redirecionamento)
│   ├── classificacao.tsx       # Tela de ranking
│   ├── classificacao+api.ts    # API: GET /classificacao
│   ├── adicionar-jogo.tsx      # Tela de jogos agendados e criação
│   ├── jogos+api.ts            # API: GET /jogos  POST /jogos
│   ├── jogos/
│   │   └── [id]+api.ts         # API: DELETE /jogos/:id
│   ├── resultado.tsx           # Tela de resultados
│   ├── resultado+api.ts        # API: POST /resultado
│   ├── resultado/
│   │   └── [jogoId]+api.ts     # API: PUT /resultado/:jogoId
│   ├── times.tsx               # Tela de times
│   ├── times+api.ts            # API: GET /times  POST /times
│   └── times/
│       └── [id]+api.ts         # API: PUT /times/:id  DELETE /times/:id
│
├── components/                 # Componentes reutilizáveis
│   ├── ClassificacaoItem.tsx
│   ├── JogoCard.tsx
│   ├── ModalidadeSelector.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
│
├── constants/                  # Constantes globais
│   ├── colors.ts               # Paleta de cores
│   ├── modalidades.ts          # Lista de modalidades
│   └── storageKeys.ts          # Chaves do AsyncStorage
│
├── hooks/                      # Custom hooks
│   ├── useClassificacao.ts     # Lê e recomputa o ranking
│   ├── useJogos.ts             # Gerencia lista de jogos
│   └── useTimes.ts             # Gerencia lista de times
│
├── lib/
│   └── state.ts                # Estado em memória (times, jogos) + computeClassificacao()
│
├── services/
│   └── api.ts                  # Instância do axios com baseURL dinâmica
│
├── storage/
│   └── jogos.ts                # Persistência local com AsyncStorage
│
└── types/
    └── index.ts                # Tipos TypeScript (Time, Jogo, Entrada, etc.)
```

---

## API Routes (Expo Router)

As rotas de API são definidas por arquivos `+api.ts` dentro de `src/app/` e funcionam no modo web com `output: "server"`.

### Times

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/times` | Lista todos os times |
| `POST` | `/times` | Cria um novo time `{ nome }` |
| `PUT` | `/times/:id` | Edita o nome de um time `{ nome }` |
| `DELETE` | `/times/:id` | Remove um time |

### Jogos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/jogos` | Lista todos os jogos |
| `POST` | `/jogos` | Cria um jogo `{ modalidade, time1, time2, horario, local }` |
| `DELETE` | `/jogos/:id` | Remove um jogo |

### Resultados

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/resultado` | Registra resultado `{ jogoId, placarTime1, placarTime2 }` |
| `PUT` | `/resultado/:jogoId` | Edita resultado `{ placarTime1, placarTime2 }` |

### Classificação

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/classificacao?modalidade=Futsal` | Retorna ranking calculado para a modalidade |

> **Pontuação:** vitória = 3 pts · empate = 1 pt · derrota = 0 pts

---

## Integrantes

| Nome | RM |
|------|----|
| Erick Molina | 553852 |
| Felipe Castro Salazar | 553464 |
| Marcelo Vieira de Melo | 552953 |
| Rayara Amaro Figueiredo | 552635 |
| Victor Rodrigues | 554158 |

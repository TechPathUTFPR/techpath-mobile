# Questionário de Afinidade, Resultado, Histórico e Etapa Concluída

Fonte das regras: **"TechPath — Especificação do Questionário de Afinidade" (PO @erick, 27/10/2026)**.

## Fluxo e rotas
```
App abre SEMPRE em /login  (app/index.tsx)
      │ login ou cadastro com sucesso  ->  useGoToStart()
      ├─ SEM resultados salvos (1ª vez / sem trilha) ─► /landing ─► /how-it-works ─► /assessment ─► /result ─► /result-details
      └─ COM resultados salvos ────────────────────────► /home  ──"Ver resultado"──► /result-details (último resultado)
                                                          └─ "Nova avaliação" ─► /how-it-works ─► /assessment …
Perfil ─► Histórico de Resultados (/history) ─(cartão)─► /result-details
```
- "Sair" nas telas do questionário/resultado volta ao mesmo ponto de partida (Landing ou Home, conforme houver resultados).
- Com uma avaliação **em andamento**, os botões da Landing e do Como Funciona viram **"Continuar de onde parei"** / **"Continuar minha Avaliação"** (RN07).
- Home, trilhas e demais telas: ver `TRILHAS_HOME.md`.

## O que da especificação foi implementado
| Regra | Estado |
|---|---|
| 30 afirmações, 6 áreas, escala de 5 opções (0–4) com os rótulos exatos | Implementado (`src/data/questionnaire.ts`, textos copiados do PDF) |
| Cálculo: Pontos = Σ valor×peso; Máximo = Σ 4×peso; % = Pontos/Máximo×100, comparado sem arredondar | Implementado (`scoring.ts`, funções puras) |
| Desempate: mais "Sempre é verdade" → senão todas principais + **perfil híbrido**; meio do ranking igual; por fim ordem de cadastro | Implementado |
| Perfil em descoberta (nenhuma área **passa** de 40%; 40% exato ainda é descoberta) e respostas uniformes | Implementado (avisos na tela) |
| RN02 100% respondido para finalizar (equivale ao 422) | Implementado (`IncompleteAssessmentError`) |
| RN03 responder de novo substitui | Implementado |
| RN04 ordem embaralhada, sorteada **uma vez** por avaliação e mantida ao voltar | Implementado |
| RN05 usuário não vê área nem peso; payload das telas sem área/peso/valor (CT15) | Implementado (`toUiQuestions`); categoria exibida é o genérico "Interesses" |
| RN06 salva a cada resposta e retoma de onde parou | Implementado (AsyncStorage, por usuário) |
| RN07 no máximo uma avaliação em andamento por usuário | Implementado |
| RN08 avaliação concluída não muda; refazer = nova avaliação | Implementado |
| RN09 histórico de todas as avaliações concluídas | Implementado (tela Histórico) |
| RN11 resposta grava cópia de valor, peso e área | Implementado (`StoredAnswer`) |
| RN13 área só entra se ativa com ≥ 5 perguntas ativas | Implementado (`eligibleQuestions`) |
| "Próxima só habilita com uma opção escolhida" | Botão fica com aparência desabilitada; ao tocar explica o motivo |
| RN01 só autenticados respondem | O app abre no Login; as telas sem sessão redirecionam ao Login |

**Testado** (mais de 100 casos no código puro, somando as suítes de questionário, histórico e trilhas): CT01–CT06 (cálculo), CT07 (29/30 → erro), CT08 (substituir), CT09 (retomar com mesma ordem), CT13 (mudar o banco não altera resultado antigo), CT14 (pergunta/área desativada não entra em novas avaliações), CT15 (payload sem área/peso), além de armazenamento, desempate no meio do ranking e avisos.

## ⚠️ Divergência com a especificação (precisa de decisão do time)
A especificação manda o **cálculo no backend** (RN10) e diz que o app **nunca recebe área nem peso** (RN05). Você pediu para implementar o scoring no app, e o README do backend não lista os endpoints de questionário. Então:
- O **banco de perguntas com área/peso e o cálculo estão no app**, de forma **temporária e isolada**. A interface nunca os vê, mas quem inspecionar o pacote do app consegue ver qual pergunta pontua qual área.
- Os dados ficam **só neste aparelho** (não sincronizam entre aparelhos/web).
- Quando o backend implementar a API, troque a camada de dados (`AssessmentContext` + `assessmentModel`/`storage`) por chamadas e **descarte** `scoring.ts` e as áreas/pesos do app:

| Hoje (local) | API da especificação |
|---|---|
| `createAssessment` / retomar | `POST /avaliacoes` |
| perguntas da avaliação | `GET /avaliacoes/:id` |
| `select` + salvar | `PUT /avaliacoes/:id/respostas` |
| `finalizeAssessment` | `POST /avaliacoes/:id/finalizar` |
| `toAssessmentResult` | `GET /avaliacoes/:id/resultado` |
| `history` | `GET /avaliacoes` |

## Onde ficam os dados
`AsyncStorage`, chave `techpath.assessments.v1:<e-mail do usuário>`: `{ inProgress, history[] }`. Cada usuário (e-mail) tem o seu. **Sair da conta não apaga** esses dados. Senhas/tokens não ficam aqui.
**Dependência adicionada:** `@react-native-async-storage/async-storage` (o SecureStore tem limite de ~2 KB por valor e o histórico passa disso). Funciona no Expo Go.

## Histórico de Resultados (`/history`)
- Cartões em 2 colunas: capa quadrada **provisória** (não há capas de trilha) + nome da(s) área(s) principal(is) + data e %. Cada cartão mostra dados do **seu** resultado.
- Toque no cartão → Resultado Completo daquela avaliação (somente leitura).
- Filtros: **Todos** (ordem de conclusão, mais antigo primeiro), **Recentes** (mais novo primeiro; é o filtro inicial), **Favoritos**.
- **Favoritos:** a especificação não prevê favoritos, então não há como marcar; o filtro mostra um aviso. O campo `favorite` já existe no modelo para quando isso for definido.
- "Nova Avaliação" → `/how-it-works` → `/assessment` (retoma se houver andamento).
- Estados: carregando, erro de leitura, vazio (por filtro).

## Resultado e Resultado Completo
- Leem o mesmo objeto; abrir ou voltar **nunca recalcula**. Mostram todas as áreas do ranking (6 na v1), em barras.
- Avisos conforme a especificação: perfil híbrido (lista as áreas empatadas), perfil em descoberta (sugere as duas primeiras) e respostas uniformes.
- **Híbrido:** o cartão do topo mostra a primeira área principal e as demais empatadas aparecem em "Outras áreas" + aviso (a especificação pede "lado a lado"; o Figma tem um cartão só).
- "Refazer questionário" (especificação) = "Nova Avaliação" no Histórico; não há botão extra no Resultado porque o Figma não o tem.
- "Ver minha trilha de estudos" abre a Visão Geral da trilha da área principal do resultado.
- Imagem da área: sem `imageUrl`, quadrado escuro provisório do Figma.

## Etapa Concluída (`/trail-progress`)
Só exibe "Etapa Concluída!" se a etapa estiver realmente concluída no progresso salvo (ver `TRILHAS_HOME.md`).

## Fora do escopo desta entrega
Painel admin (áreas/perguntas), Swagger, vagas com LLM, trilhas de estudo, validação com 10–15 pessoas (pontos em aberto do PDF).

## Observações sobre o Figma
Margens variam por tela e alguns elementos estão desalinhados por descuido de design; reproduzi cada margem e centralizei o que estava deslocado. Medidas em `src/theme/screens.ts`.

# Home, Minhas Trilhas, Visão Geral da Trilha, Conteúdo da Etapa e Etapa Concluída

## 1) Verificação do que já existe no projeto web/backend (antes de criar)
| Fonte | O que foi checado | Resultado |
|---|---|---|
| `techpath-backend` (README) | endpoints de trilhas, etapas, conteúdo, progresso, favoritos | **Não existem.** Só `POST /users/register`, `POST /users/login` e `POST /auth/login` (admin) |
| `techpath-backend/src`, `techpath-frontend/app`, `public` | modelos/dados de trilha | **Bloqueados** (o GitHub nega acesso automatizado às pastas); não foi possível ler o código |
| `techpath-frontend` (`CLAUDE.md`, `AGENTS.md`) | regras de negócio documentadas | Só avisos genéricos do Next.js, sem regra de negócio |
| Especificação do Questionário (PDF do PO) | áreas, resultado, trilhas | Áreas e regras do resultado (**reaproveitadas**). Diz que trilhas e vagas "têm especificação própria" (não fornecida) |

**Reaproveitado:** as 6 áreas (códigos DEV, UX, QA, DSO, DAD, PRD) e o resultado da avaliação, que decide qual trilha é recomendada.
**Não existe e foi criado como EXEMPLO (identificado na tela):** o catálogo de trilhas/etapas/conteúdo (`src/data/trails.ts`).
👉 Se o time web tiver modelos/dados de trilha, me envie: troco o catálogo e a camada de dados sem mexer nas telas.

## 2) Fluxo e rotas
```
Login ──► sem resultados ─► Landing ─► Como Funciona ─► Questionário ─► Resultado
      └─► com resultados ─► HOME ──► "Ver resultado" ───────────────► Resultado Completo (último resultado)
                              ├─ "Nova avaliação" ─► Como Funciona ─► Questionário …
                              ├─ "Continuar trilha" ─► Visão Geral da Trilha
                              └─ toque em "Olá, …!" ─► Perfil (acesso provisório) ─► Minhas Trilhas / Histórico / Editar Cadastro

Perfil ─► Minhas Trilhas (/trails) ─► Visão Geral (/trail-overview?trailId=…) ─► Conteúdo da Etapa (/trail-step?trailId=…&stepId=…)
                                                                                   └─ "Marcar como concluído" ─► Etapa Concluída (/trail-progress?trailId=…&stepId=…)
Resultado / Resultado Completo ─► "Ver minha trilha de estudos" ─► Visão Geral da trilha da área principal
```
- O app abre sempre no Login. Depois: **sem resultados salvos → Landing; com resultados → Home.**
- Acesso provisório ao Perfil: tocar na saudação da Home (o Figma ainda não tem menu/aba para isso).
- Sem uma trilha em andamento, "Continuar trilha" mostra "Nenhuma trilha em andamento"; sem avaliação, o cartão do topo vira um convite para começar.

## 3) Dados — uma única fonte para as cinco telas
| O quê | Onde | Observação |
|---|---|---|
| Catálogo (trilhas/etapas/conteúdo) | `src/data/trails.ts` | **EXEMPLO** (6 trilhas, 4 a 8 etapas, 3 a 7 tópicos). Aviso "CONTEÚDO DE EXEMPLO" nas telas enquanto `TRAILS_ARE_SAMPLE = true` |
| Progresso do usuário | `TrailContext` → AsyncStorage `techpath.trails.v1:<e-mail>` | `{ trailId: { stepId: dataISO } }`; só existe entrada para etapa **concluída** |
| Trilhas do usuário | derivadas do histórico de avaliações | cada avaliação recomenda a trilha da(s) área(s) principal(is); híbrido = várias; repetidas aparecem uma vez |

Formato de uma trilha (`src/features/trail/types.ts`):
```ts
{ id, areaCode, name, areaName, coverUrl?,
  steps: [{ id, title, description, whyImportant, topics: string[] }, …] }   // quantidade livre
```
Para usar o conteúdo real: substitua `TRAILS` e ponha `TRAILS_ARE_SAMPLE = false`. **Ids de trilha e de etapa precisam ser estáveis**, pois o progresso é guardado por eles.

## 4) Regra de progresso (única função: `getTrailPercent`)
- **Progresso = etapas concluídas ÷ total de etapas × 100** (arredondado), todas com o mesmo peso (não há pesos definidos).
- Usada na Home, Minhas Trilhas, Visão Geral, Conteúdo da Etapa e Etapa Concluída — nenhuma tela calcula por conta própria.
- Trilha sem etapas → 0% ("0 de 0 etapas"), sem divisão por zero. Todas concluídas → 100% e a tela de conclusão diz "Você concluiu todas as etapas…".
- **Estados das etapas:** concluída (círculo roxo com check, linha roxa depois dela), **atual** = a primeira ainda não concluída (círculo roxo cheio), futura (círculo cinza).
- **Acesso livre:** não há regra de liberação definida, então qualquer etapa pode ser aberta e concluída em qualquer ordem. Não foi criado bloqueio.
- Abrir o conteúdo **nunca** conclui a etapa.

## 5) Conclusão de etapa
- "Marcar como concluído": mostra carregamento, bloqueia toque duplo, **grava no aparelho e só depois atualiza** o estado. Se a gravação falhar, aparece um aviso e a etapa **não** é marcada.
- Já concluída: o botão vira "Etapa concluída" (desabilitado) e nada é registrado de novo.
- Sucesso → tela **Etapa Concluída** (próxima etapa pendente, % atualizado). Não avança sozinho para a próxima etapa.
- "Voltar para a etapa anterior" abre a etapa anterior da mesma trilha; **desabilitado na primeira**. Na última etapa não há etapa posterior.
- A conclusão fica salva por usuário e continua após fechar e reabrir o app.

## 6) Minhas Trilhas — filtros
- **Todos:** na ordem em que as trilhas foram recomendadas (mais antiga primeiro).
- **Recentes:** por **última atividade** (etapa concluída mais recente ou, sem progresso, a data da recomendação), da mais recente para a mais antiga.
- **Favoritos:** não existe sistema de favoritos → lista vazia com aviso explicando.

## 7) Como testar
1. Entre (`a@b` + 8 caracteres), faça o questionário até o fim → Resultado → "Ver minha trilha de estudos": abre a trilha da **sua** área (compare a quantidade de etapas entre áreas).
2. Abra a etapa 1: "Voltar para a etapa anterior" está desabilitado. Toque em "Marcar como concluído" → Etapa Concluída (X% → mostra o próximo) → "Ver minha trilha de estudos": a linha do tempo já mostra a 1ª concluída e a 2ª como atual, e o **%** bate com a Home.
3. **Etapa intermediária:** abra a etapa 3 → "Voltar para a etapa anterior" leva à 2ª; conclua fora de ordem (acesso livre) e veja os estados.
4. **Última etapa:** conclua todas (a de uma trilha de 4 etapas é a mais rápida: UX ou PRD) → "Você concluiu todas as etapas…", 100%, sem "Próxima etapa"; na Home, "Continuar trilha" passa a "Nenhuma trilha em andamento".
5. Feche o app, entre de novo: o progresso continua. Entre com **outro e-mail**: progresso e trilhas são independentes.

## 8) Pendências
- Conteúdo, nomes e capas **oficiais** das trilhas (e, se houver, favoritos e pesos de etapa).
- Backend de trilhas/progresso (hoje tudo é local, por aparelho).
- Menu/aba definitivo para chegar a Perfil, Histórico e Minhas Trilhas.
- Capas: sem `coverUrl`, aparece o quadrado escuro provisório do Figma.
- No Figma da Home a descrição do cartão é "Descubra se seu perfil mudou"; o enunciado da tarefa cita "Descubra seu perfil de novo". Foi usado o texto do Figma.

# Landing, Como Funciona, Redefinir Senha, Editar Cadastro + Login simulado

## Fluxo de navegação
O app **sempre abre no Login**. Depois de entrar (ou cadastrar) vai para a Landing (sem resultados salvos) ou para o Histórico (com resultados). Detalhes e diagrama em `QUESTIONARIO_RESULTADO.md`.
- Toques repetidos em "Começar" / "Começar minha Avaliação" abrem a tela uma única vez (`useNavigateOnce`).

## Login SIMULADO (pedido do grupo)
- Padrão: `EXPO_PUBLIC_AUTH_MODE=simulated`. **Nenhuma autenticação é feita.** Valida só na tela: e-mail com `@` e senha com **8+ caracteres**. Abre uma sessão local marcada `simulated: true`, sem token; a senha não é enviada nem guardada.
- A tela temporária `/home` exibe o aviso "MODO SIMULADO" e o console registra um `warn`.
- Para usar o backend: `EXPO_PUBLIC_AUTH_MODE=real` (exige `EXPO_PUBLIC_API_URL`; aí só se exige senha preenchida).
- **Criar Conta continua chamando o backend real** (`POST /users/register`).
- A regra de senha mínima de **8 caracteres** passou a valer também em Criar Conta, Redefinir Senha e Editar Cadastro.

## Landing (`app/landing.tsx`)
Fundo lilás `#E7D7FE`, logo na mesma proporção vertical do Figma (31,9% da altura), botão roxo `#5816B7` "Começar" → `/how-it-works`.

## Como Funciona (`app/how-it-works.tsx`)
Logo horizontal, "Como Funciona", título em 3 linhas, cartões Responda / Descubra / Siga (`StepCard`). Conteúdo rola; o botão "Começar minha Avaliação" fica fixo embaixo e leva a **`/assessment`**.
`/assessment` agora é o questionário dinâmico (ver `QUESTIONARIO_RESULTADO.md`).

## Redefinir Senha (`app/reset-password.tsx`)
Valida e-mail, nova senha (8+) e confirmação. **Não altera nenhuma senha**: o backend não tem redefinição com verificação de identidade (código/token por e-mail), e trocar senha só com o e-mail permitiria sequestro de contas. Ao tocar "Retornar ao Login" com dados válidos, o app avisa que a senha NÃO foi alterada e oferece ir ao Login. Integração futura preparada em `src/services/passwordResetService.ts`.

## Editar Cadastro (`app/edit-profile.tsx`)
- Carrega nome e e-mail da sessão; senha é opcional (se preenchida: 8+ e confirmação igual).
- Salvar: **sessão simulada** → atualiza nome/e-mail **só neste aparelho** (aviso explícito; senha nunca é guardada). **Sessão real** → o backend não tem endpoint de atualização, então **nada é salvo** e a tela explica.
- Avisa antes de descartar alterações (seta, gesto de voltar ou botão do Android).
- Foto: lápis informa que não há suporte (seria preciso `expo-image-picker` + upload no backend).
- Meu Perfil recarrega ao voltar e mostra os dados atualizados.

## Reaproveitamento
`ScreenHeader` e `ProfilePhoto` foram extraídos do Meu Perfil e usados também no Editar Cadastro. `LabeledField`, `PasswordField`, `TextField`, `Button` (nova variante `brand`) e as validações são compartilhados.

## Logo
`techpath-logo.png`, `techpath-icon.png` e `techpath-wordmark.png` são **placeholders com fundo transparente extraídos do print do Figma** (baixa resolução). Substitua pelos originais (PNG transparente, mesmos nomes).

## Observações sobre o Figma
- Em Editar Cadastro os campos estão levemente deslocados para a direita; foram centralizados com margem de 24.
- Medidas estimadas por imagem; ajuste em `src/theme/screens.ts`.

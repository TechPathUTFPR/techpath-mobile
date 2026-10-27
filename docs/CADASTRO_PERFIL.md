# Telas Criar Conta e Meu Perfil — TechPath Mobile

## Arquivos

**Novos:** `app/profile.tsx`, `src/services/session.ts`, `src/theme/screens.ts`,
`src/components/{Avatar,MenuCard,LabeledField,PasswordField,icons,inputProps}`,
`src/utils/{jwt,userName,confirmSignOut}.ts`

**Alterados:** `app/register.tsx` (era placeholder), `app/home.tsx` (agora leva ao perfil e usa a confirmação de saída),
`src/components/TextField.tsx` (aceita ícone à direita), `src/services/authService.ts` (+ `registerWithEmail`, requisição compartilhada com o login),
`src/services/tokenStorage.ts` (+ dados do usuário), `src/utils/validation.ts` (+ regras de senha nova)

**Não alterados:** `app/login.tsx`, `Button`, `Logo`, `GoogleIcon`, `tokens.ts`, `env.ts`

## Criar Conta

- Cadastro **REAL**: `POST /users/register` → `accessToken`; a sessão é iniciada e o app vai para `/home`.
- **O backend exige `name`, e o Figma não tem esse campo.** Enviamos um nome **provisório** derivado do e-mail
  (`joao.silva@x.com` → `Joao Silva`), isolado em `src/utils/userName.ts`. Decisão pendente: manter ou adicionar campo "Nome".
- **Regra de senha: mínimo de 8 caracteres** (`MIN_PASSWORD_LENGTH` em `validation.ts`, definida pelo grupo). Se o servidor recusar (400), a mensagem dele é exibida.
- Validações: campos obrigatórios, formato de e-mail, mínimo de senha, confirmação igual. Erros aparecem sob cada campo.
  Aviso de senhas diferentes também aparece ao sair do campo de confirmação.
- E-mail já cadastrado (HTTP 409) → mensagem específica.
- Olho de mostrar/ocultar senha nos dois campos: **não está no Figma**. Para o visual exato, use `showToggle={false}` em `PasswordField`.
- Loading no botão, campos travados durante o envio e trava síncrona contra duplo envio.
- "Entre aqui" volta ao Login (`router.back()`, ou `replace('/login')` se não houver histórico).

## Meu Perfil

- Dados vêm da **sessão real** (claims do token, se houver `name`/`email`; senão o e-mail digitado no login / nome enviado no cadastro).
  Sem nome → mostra e-mail → sem nada → "Usuário". Sem sessão → redireciona ao Login.
- Seta de voltar: volta na pilha; se não houver histórico, vai para `/home`.
- **Foto**: avatar padrão **provisório** (silhueta), sem foto de ninguém. O lápis informa que não há suporte a foto (não simula salvamento).
- **Minhas Trilhas / Histórico de Resultados**: as telas **não existem** e o backend não tem esses endpoints; o toque mostra um aviso com a dependência (preencher `route` em `MENU`, `app/profile.tsx`). **Editar Cadastro** já está conectado a `/edit-profile` (ver `LANDING_RESET_EDIT.md`).
- **Sair**: confirmação → apaga token e dados de sessão do aparelho → Login. Não apaga a conta.
  O backend não tem logout (JWT sem estado): o token **não é revogado no servidor**, apenas descartado no app.

## Limitações

- Código **não executado em dispositivo** pela IA (sem rede no ambiente); validação por checagem de sintaxe + testes das funções puras.
- Leitura de nome/e-mail do token **não verifica assinatura** (uso apenas visual).
- Medidas/fontes estimadas do Figma; conferir no Dev Mode e ajustar `src/theme/screens.ts`.
- No Figma os 3 cartões do perfil têm um pequeno desalinhamento (o 3º está ~2px deslocado); foram alinhados igualmente.

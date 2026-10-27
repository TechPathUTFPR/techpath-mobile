# Tela de Login — TechPath Mobile

Stack: React Native + Expo + TypeScript + Expo Router (mesma linguagem do backend/frontend do TechPath).

## Arquivos

| Arquivo | Função |
|---|---|
| `app/_layout.tsx` | Layout raiz (Stack sem cabeçalho, barra de status escura, fundo branco) |
| `app/index.tsx` | Entrada: com token salvo → `/home`, senão → `/login` |
| `app/login.tsx` | **Tela de Login** (layout do Figma + validação + chamada ao backend) |
| `app/register.tsx` | Tela TEMPORÁRIA de cadastro (só para a navegação funcionar) |
| `app/home.tsx` | Tela TEMPORÁRIA pós-login (confirma sucesso e permite "Sair") |
| `src/components/TextField.tsx` | Campo de texto com estado de erro |
| `src/components/Button.tsx` | Botão primário (preto) e secundário (cinza), com loading |
| `src/components/Logo.tsx` | Logo (usa `assets/images/techpath-logo.png`) |
| `src/components/GoogleIcon.tsx` | Ícone "G" colorido (SVG) |
| `src/theme/tokens.ts` | Cores, medidas e tamanhos de fonte (ajuste aqui conforme o Figma) |
| `src/utils/validation.ts` | Validação de e-mail e senha |
| `src/services/authService.ts` | `POST /users/login` no backend |
| `src/services/tokenStorage.ts` | Guarda o `accessToken` (SecureStore; memória na web) |
| `src/config/env.ts` | Lê `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_TERMS_URL`, `EXPO_PUBLIC_PRIVACY_URL` |
| `assets/images/techpath-logo.png` | **PLACEHOLDER** da logo (ver limitações) |
| `.env.example` | Modelo de variáveis de ambiente |

## O que é real e o que não é

| Funcionalidade | Estado |
|---|---|
| Login com e-mail e senha | **SIMULADO por padrão** (pedido do grupo: e-mail com `@` + senha de 8+ caracteres, sem servidor). Modo real (`EXPO_PUBLIC_AUTH_MODE=real`): `POST /users/login` |
| Validação de e-mail e senha | **REAL** (no app) |
| Loading e bloqueio de envio duplicado | **REAL** |
| "Criar conta" → tela de cadastro | Navegação **REAL**; a tela de cadastro é um **placeholder** |
| "Esqueceu a senha?" | Abre a tela Redefinir Senha, que **não altera senha** (o backend não tem o recurso) |
| "Continuar com o Google" | **NÃO implementado**: o backend não tem autenticação Google. Mostra um aviso claro, sem simular login |
| Termos de Serviço / Política de Privacidade | Abrem a URL configurada em `.env.local`; sem URL, avisam que a página não está disponível |

O modo simulado é explícito: sessão marcada como simulada, aviso na tela temporária e no console.

## Limitações e decisões

- **Logo**: o repositório do frontend não pôde ser acessado automaticamente (GitHub bloqueia robôs nas pastas). O arquivo `techpath-logo.png` foi **recortado do print do Figma** e tem baixa resolução. Substitua pela logo original (mesmo nome de arquivo).
- **Olho de mostrar/ocultar senha**: não consta no Figma, por isso não foi adicionado. A senha fica sempre oculta.
- **Fonte**: usa a fonte do sistema (sem biblioteca extra). Se o Figma usar Inter, dá para adicionar depois com `@expo-google-fonts/inter`.
- **Medidas/cores**: estimadas pela imagem. Confirme no Figma (Dev Mode) e ajuste em `src/theme/tokens.ts`.
- **Regras de senha**: o app só exige que esteja preenchida; regras de tamanho/complexidade pertencem ao backend.
- **Sessão**: o app reabre direto na home se houver token salvo, sem checar expiração (ainda não há endpoint/rota protegida para isso).
- O backend guarda usuários **em memória** (conforme seu README): ao reiniciar, é preciso cadastrar o usuário de teste de novo.
- Não foram feitas alterações no backend.

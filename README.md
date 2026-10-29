# TechPath Mobile — como rodar no Expo Go

Telas prontas: **Landing**, **Como Funciona**, **Login**, **Criar Conta**, **Redefinir Senha**, **Meu Perfil** e **Editar Cadastro**
(+ telas temporárias: `assessment` = questionário ainda inexistente, e `home`).

> **Login SIMULADO:** por padrão o login NÃO consulta servidor. Entra qualquer e-mail com `@` e senha de **8+ caracteres**
> (`EXPO_PUBLIC_AUTH_MODE=simulated` no `.env.local`). Para usar o backend de verdade, troque para `real`.
> Criar Conta continua usando o backend real.

## Antes de começar
- Node.js (versão LTS atual) instalado: https://nodejs.org
- App **Expo Go** no celular (App Store / Play Store)
- Celular e computador na **mesma rede Wi-Fi**
- Backend `techpath-backend` rodando (porta 3000) — só é necessário para testar login e cadastro de verdade; o visual das telas funciona sem ele.

## Passo a passo
Abra o terminal **dentro desta pasta** (`techpath-mobile`) e rode, um por vez:

```
npm install
npm run setup
```
- `npm install` instala o Expo.
- `npm run setup` instala os demais pacotes **nas versões compatíveis com o Expo Go** (o próprio Expo escolhe). Pode demorar alguns minutos.

Depois edite o arquivo **`.env.local`** e troque `COLOQUE-O-IP-DO-PC` pelo IP do seu computador (ex.: `http://192.168.0.15:3000`).
Não sabe o IP? Rode `npm start`: o terminal mostra `exp://192.168.0.15:8081` — o IP é o mesmo.

```
npm start
```
Leia o QR code: **Android** → pelo próprio app Expo Go; **iPhone** → pela câmera. Depois de editar o `.env.local`, rode `npm start` de novo (ele já limpa o cache).

Se o QR não conectar (redes de faculdade costumam bloquear): `npm run start:tunnel`.
(O túnel só serve para o app; o celular ainda precisa alcançar o backend pelo IP da rede.)

## Como chegar em cada tela
- O app **sempre abre no Login**. Entre com `a@b` e uma senha de 8+ caracteres (login simulado) ou crie uma conta.
- **Primeira vez (sem resultados):** **Landing** → "Começar" → **Como Funciona** → "Começar minha Avaliação" → **Questionário** (30 perguntas) → **Resultado** → "Ver resultado completo" / "Ver minha trilha de estudos".
- **Com resultados salvos:** vai direto para a **Home** ("Ver resultado", "Nova avaliação", "Continuar trilha").
- **Perfil:** na Home, toque na saudação ("Olá, …!") — acesso provisório. No Perfil: Minhas Trilhas, Histórico de Resultados, Editar Cadastro e Sair.
- **Trilhas:** Minhas Trilhas → Visão Geral da Trilha → Conteúdo da Etapa → "Marcar como concluído" → Etapa Concluída.
- Para ver a Landing de novo, use outro e-mail (resultados e progresso são guardados por e-mail).

> As trilhas e etapas são **conteúdo de exemplo** (as telas avisam). Resultados, progresso e histórico ficam **neste aparelho**. Detalhes em `docs/`.

## Roteiro de teste
**Home:** abre com "Olá, <nome>!", o cartão "Seu último resultado!" (data, área, %), "Ver resultado" e os dois cartões. Sem avaliação feita, o cartão vira um convite para começar.
**Trilhas:** conclua o questionário → "Ver minha trilha de estudos"; abra a etapa 1 ("Voltar para a etapa anterior" desabilitado) → "Marcar como concluído" → Etapa Concluída; volte à trilha e confira estados (✓ roxo, atual, cinza) e o **mesmo %** na Home e em Minhas Trilhas. Feche e reabra o app: o progresso permanece. Roteiro completo em `docs/TRILHAS_HOME.md`.
**Questionário:** `Pergunta 1 de 30` / `3%`, 5 opções empilhadas ("Nunca é verdade" … "Sempre é verdade"); "Próxima" parece desabilitada até escolher e, ao tocar, explica; escolher → fica lilás; "Voltar" mantém a resposta; na 30ª o botão vira "Concluir". As perguntas aparecem embaralhadas e a **ordem é a mesma** se você sair e voltar.
**Retomar:** responda algumas, toque em "Sair" (confirma), faça login de novo com o mesmo e-mail → Landing mostra **"Continuar de onde parei"** e volta na mesma pergunta com as respostas marcadas.
**Resultado real:** responda tudo → Resultado mostra a área principal com %, e "Ver resultado completo" mostra as 6 áreas em barras. Teste "Sempre é verdade" em todas (aviso de híbrido + uniforme) e "Nunca é verdade" em todas (descoberta + uniforme).
**Histórico:** faça uma avaliação, saia, entre de novo → abre no Histórico com 1 cartão; "Nova Avaliação" e conclua outra → 2 cartões; filtros Todos (mais antigo primeiro), Recentes (mais novo primeiro), Favoritos (aviso: ainda não existe). Toque num cartão → Resultado Completo daquela avaliação.
**Landing / Como Funciona:** compare com o Figma; toque rápido duas vezes em "Começar" abre uma só tela; em celular pequeno o conteúdo rola e o botão fica fixo.
**Login (simulado):** `abc` (sem @) → erro; `a@b` + senha de 7 caracteres → erro; `a@b` + 8 caracteres → entra e a tela temporária mostra "MODO SIMULADO".
**Redefinir Senha:** campos vazios/e-mail inválido/senha < 8/senhas diferentes → erros; dados válidos → aviso de que a senha NÃO foi alterada e opção de ir ao Login.
**Editar Cadastro:** dados atuais já preenchidos; apagar o nome → erro; alterar nome/e-mail e Salvar → aviso "salvo neste aparelho" e o Meu Perfil mostra o novo nome; alterar algo e voltar sem salvar → pergunta se descarta; lápis → aviso de sem suporte.
**Login (modo real, opcional):** campos vazios → erros; e-mail inválido → erro; senha errada → "E-mail ou senha incorretos."; backend desligado → aviso de conexão; "Esqueceu a senha?" e "Continuar com o Google" → avisos (não existem no backend); "Criar conta" → cadastro.
**Criar Conta:** senha < 8 caracteres → erro; senhas diferentes → "As senhas não coincidem."; e-mail já usado → erro específico; olho mostra/oculta a senha; sucesso → vai para a tela temporária e a sessão fica salva; "Entre aqui" → volta ao login.
**Meu Perfil:** na tela temporária toque em "Meu Perfil". Mostra seu e-mail/nome; lápis, "Minhas Trilhas", "Histórico de Resultados" e "Editar Cadastro" avisam que dependem de telas/serviços que ainda não existem; seta volta; "Sair" pede confirmação, encerra a sessão e volta ao login. Feche e reabra o app: sem sessão cai no Login, com sessão vai direto à tela temporária.

## Problemas comuns
| Sintoma | Solução |
|---|---|
| "Project is incompatible with this version of Expo Go" | Atualize o Expo Go na loja e rode `npm run setup` de novo |
| "Unable to resolve module X" | `npx expo install X` e `npm start` |
| "Unable to resolve module @react-native-async-storage/async-storage" (ao atualizar um projeto antigo) | `npx expo install @react-native-async-storage/async-storage` e `npm start` |
| Login/cadastro dizem "Não foi possível conectar" | Confira o IP no `.env.local`; teste `http://IP:3000` no navegador do celular; libere a porta 3000 no firewall do Windows; reinicie com `npm start` |
| "O endereço da API não está configurado" | `.env.local` ausente ou sem `EXPO_PUBLIC_API_URL` |
| Logo borrada | É um placeholder: troque `assets/images/techpath-logo.png` pela logo original (mesmo nome) |
| Dúvida geral de dependências | `npm run doctor` |

## Observações
- Erros de TypeScript no editor **não impedem** o app de rodar; se aparecerem, me envie.
- Documentação detalhada das telas: pasta `docs/`.

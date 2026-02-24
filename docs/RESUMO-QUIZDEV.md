# Resumo QuizDev (backend + mobile)

Data deste documento: 2026-01-31
Escopo: leitura estatica do codigo e configuracoes locais. Nao inclui testes nem execucao de runtime.
Objetivo: registrar o estado atual do projeto, com detalhes tecnicos e operacionais, para servir como contexto persistente.

Observacao de codificacao: este documento usa ASCII (sem acentos), conforme orientacao de ambiente.

---

## 1) Resumo executivo (estado geral)

O projeto QuizDev esta organizado em dois grandes blocos:

- Backend Node/Express com PostgreSQL (pg), JWT, OTP e Swagger.
- Mobile Expo/React Native (SDK 54) com navegacao em stacks e tabs.

Estado atual consolidado:

- Backend funcional com:
  - autenticacao por email/senha (JWT).
  - OTP para cadastro com expiracao.
  - rate limit para login e OTP.
  - CORS configuravel por env.
  - banco com tabelas usuario, pergunta e otps.
  - endpoint para registrar pontuacao no historico.
- Mobile funcional com:
  - fluxo de cadastro com OTP.
  - login com armazenamento local (AsyncStorage).
  - quiz por categorias e registro de pontuacao no backend.
  - configuracao por env para baseURL da API.
- Docker Compose completo com:
  - db (Postgres 16), backend, mobile (Expo dev server), pgadmin.
  - suporte a QR Code do Expo Go (LAN) no terminal.
  - configuracoes de IP para uso com celular fisico.

Estado operacional observado:

- Expo Go no iOS exige SDK 54. O projeto foi atualizado para Expo SDK 54.
- O envio de OTP depende de EMAIL_USER/EMAIL_PASS (Gmail App Password).
- OTP_DEBUG controla se o OTP e exibido no response (modo debug) ou enviado por email.
- O Web (porta 8081) mostra o app web, nao o QR. O QR aparece no terminal do container.

---

## 2) Estrutura atual do repositorio

Raiz: `C:\Users\eikef\OneDrive\Documentos\projects\quiz-dev`

Pastas principais:

- `backend/` : API Node/Express + PostgreSQL
- `mobile/` : App React Native + Expo
- `docs/` : Documentos auxiliares
- `images/` : imagens do README
- `README.md` : documentacao geral
- `docs/ERROS_E_MELHORIAS.md` : lista de erros/bugs e pontos de correcao
- `docs/NOVAS_FUNCIONALIDADES_E_MELHORIAS.md` : backlog de melhorias e novas funcoes

Arquivos de orquestracao:

- `docker-compose.yml`
- `backend/Dockerfile`
- `mobile/Dockerfile`
- `.dockerignore` em backend e mobile

---

## 3) Backend - arquitetura, organizacao e fluxo

### 3.1) Entry points e inicializacao

- `backend/index.js`: instancia a classe `Server` e chama `start()`.
- `backend/server.js`: classe `Server` configura middleware, rotas e init do banco.
  - chama `dbInit()` antes de subir o servidor.
  - expoe Swagger em `/api-docs`.
  - rota raiz `/` responde texto simples.

Fluxo de startup:

1. Carrega `.env` via `dotenv`.
2. Configura middlewares (JSON, CORS dinamico, morgan).
3. Registra rotas de usuarios e perguntas.
4. Chama `dbInit()` (criacao de tabelas).
5. Sobe servidor na porta `PORT` (default 3000).

### 3.2) Middlewares

Principais middlewares:

- `cors` com suporte a lista de origens via `CORS_ORIGINS`.
  - formato: lista separada por virgula (ex: `https://app.com,https://admin.com`).
  - se vazio, CORS fica aberto (sem restricao).
- `morgan` para log.
- `authMiddleware` (JWT): protege endpoints sensiveis.
- `validateUsuario`: validacao de payload para criar/atualizar usuario.
- `rateLimiters`:
  - `loginLimiter`: padrao 20 req / 15 min (env `LOGIN_RATE_LIMIT_MAX`).
  - `otpLimiter`: padrao 5 req / 10 min (env `OTP_RATE_LIMIT_MAX`).

Middlewares nao acoplados:

- `erroMiddleware` existe, mas nao esta registrado.
- `validadePerguntaMiddleware` existe, mas nao esta em uso.

### 3.3) Conexao com banco (Postgres)

Arquivo: `backend/db/db.js`

- Usa `pg.Pool` com variaveis de ambiente:
  - `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`.
- SSL:
  - `DB_SSL=true` ou `NODE_ENV=production` ativa SSL.
  - em dev, `DB_SSL=false` desativa SSL.
  - quando ativado, `rejectUnauthorized=false` (bom para dev, ajustar em prod).

### 3.4) Criacao de tabelas (dbInit)

Arquivo: `backend/db/dbInit.js`
Tabelas:

1. `usuario`
   - `id SERIAL PK`
   - `nome`, `sobrenome` (VARCHAR 100, NOT NULL)
   - `data_nascimento` (DATE, NOT NULL)
   - `email` (VARCHAR 100, UNIQUE, NOT NULL)
   - `password` (hash bcrypt, VARCHAR 100)
   - `historico_pontuacoes` (JSONB)
   - `tentativas_login` (INT, default 0)
   - `tempo_bloqueio` (TIMESTAMP NULL)

2. `pergunta`
   - `id SERIAL PK`
   - `categoria` (TEXT)
   - `pontuacao` (INTEGER)
   - `pergunta` (TEXT)
   - `resposta_correta` (TEXT)
   - `respostas_incorretas` (JSONB)

3. `otps`
   - `email` (PK)
   - `otp` (VARCHAR 10)
   - `criado_em` (TIMESTAMP DEFAULT NOW())
   - `expira_em` (TIMESTAMP NOT NULL)

Obs:

- A tabela `otps` tambem e garantida no `otpRepository` (redundancia defensiva).

### 3.5) Camadas (Controller / Service / Repository)

Camada Repository:

- `usuarioRepository`: CRUD + login attempts + bloqueio + historico pontuacao.
- `perguntasRepository`: CRUD + filtro por categoria.
- `otpRepository`: gerencia OTP com expira_em.

Camada Service:

- `usuarioService`:
  - hash de senha no create/update.
  - sanitiza usuario antes de retornar (sem password).
  - controla tentativas, bloqueio e desbloqueio.
  - gera JWT via `authService`.
  - `registrarPontuacao` atualiza historico por categoria.
- `otpService`:
  - valida se email ja existe.
  - gera OTP de 6 digitos e salva com expiracao.
  - envia email via `emailService` se configurado.
  - se `OTP_DEBUG=true`, nao envia email e retorna OTP no response.
  - verifica OTP e cria usuario (com hash).
  - gera JWT (mas controller atual nao devolve token).
- `authService`:
  - `genereteToken` (typo mantido, mas exposto como alias `generateToken`).
  - valida `JWT_SECRET`.
- `perguntasService`: CRUD simples.
- `emailService`: nodemailer Gmail.

Camada Controller:

- `usuarioController`: CRUD + login + OTP + pontuacao.
- `perguntasController`: CRUD de perguntas.

### 3.6) Regras e validacoes de usuario

Middleware `validateUsuario`:

- `validateCreate`:
  - valida nome, sobrenome, email, password, data_nascimento.
  - regex apenas letras e espacos (unicode `\p{L}`).
  - aceita data no formato `DD/MM/AAAA` e converte para `YYYY-MM-DD`.
  - valida formato final `YYYY-MM-DD`.
- `validateUpdate`:
  - exige ao menos um campo.
  - valida nome/sobrenome (mesma regex).

### 3.7) Regras de login e bloqueio

Servico `usuarioService.login`:

- se usuario nao existe: 401.
- se bloqueado (tempo_bloqueio futuro): 403 + minutos restantes.
- se senha incorreta:
  - incrementa tentativas.
  - se >= 5, bloqueia por 15 minutos.
  - retorna 401 com tentativas restantes.
- se senha correta:
  - zera tentativas e bloqueio.
  - retorna token JWT e usuario sanitizado.

### 3.8) OTP (cadastro)

Fluxo:

1. `POST /api/usuarios/solicitar-otp`
   - recebe `email`.
   - valida se usuario ja existe:
     - se existir: 409 (usuario ja cadastrado).
   - gera OTP (6 digitos).
   - salva com expiracao (ttl default 10 min).
   - envia email via Gmail, exceto se `OTP_DEBUG=true`.
   - retorna `{ success, message }` e, se debug, `otp`.
2. `POST /api/usuarios/verificar-otp`
   - exige `email`, `otp`, `nome`, `sobrenome`, `data_nascimento`, `password`.
   - valida OTP (expira_em > NOW()).
   - cria usuario (hash de senha).
   - gera JWT (retornado apenas no service; controller nao retorna token).
   - apaga OTP do banco.
   - controller retorna `{ usuario }` com status 200.

### 3.9) JWT

- Segredo: `JWT_SECRET` (obrigatorio).
- Token gerado com payload: `id`, `email`, `nome` (login), ou `authMethod` (OTP).
- `authMiddleware` valida `Bearer <token>`.

### 3.10) CORS

Configuracao dinamica:

- `CORS_ORIGINS` define lista de origens permitidas.
- Se vazio, CORS fica aberto (sem restricao).

### 3.11) Swagger

URL: `http://localhost:3000/api-docs`
Arquivos:

- `backend/swagger/swaggerConfig.js` + comentarios nas rotas.

---

## 4) Backend - rotas e contratos (detalhado)

Base: `/api`

### 4.1) Usuarios

Prefixo: `/api/usuarios`

1. `GET /api/usuarios`
   - Auth: sim (JWT)
   - Resposta: lista de usuarios (sanitizados)

2. `GET /api/usuarios/:id`
   - Auth: sim
   - Resposta: usuario sanitizado ou 404

3. `POST /api/usuarios`
   - Auth: nao
   - Body: `{ nome, sobrenome, data_nascimento, email, password }`
   - Resposta: 201 com `{ message, token, usuario }`

4. `PUT /api/usuarios/:id`
   - Auth: sim
   - Body: `{ nome?, sobrenome?, data_nascimento?, email?, password? }`
   - Resposta: 200 com usuario atualizado (sanitizado)

5. `DELETE /api/usuarios/:id`
   - Auth: sim
   - Resposta: 200 com usuario removido (sanitizado)

6. `POST /api/usuarios/login`
   - Auth: nao
   - Body: `{ email, password }`
   - Resposta: 200 com `{ message, usuario, token }`
   - Rate limit: sim (LOGIN_RATE_LIMIT_MAX)

7. `POST /api/usuarios/solicitar-otp`
   - Auth: nao
   - Body: `{ email }`
   - Resposta: 200 `{ success, message }`
   - Se debug, inclui `otp`.
   - Rate limit: sim (OTP_RATE_LIMIT_MAX)

8. `POST /api/usuarios/verificar-otp`
   - Auth: nao
   - Body: `{ email, otp, nome, sobrenome, data_nascimento, password }`
   - Resposta: 200 `{ usuario }`
   - Observacao: token nao e retornado aqui (o service gera, mas o controller nao repassa).

9. `POST /api/usuarios/:id/pontuacao`
   - Auth: sim
   - Body: `{ categoria, acertos, total }`
   - Resposta: 200 `{ message, usuario }`
   - Atualiza `historico_pontuacoes` no banco.

### 4.2) Perguntas

Prefixo: `/api/perguntas`

1. `GET /api/perguntas`
   - Auth: nao
   - Resposta: lista completa de perguntas

2. `GET /api/perguntas/categoria?categoria=...`
   - Auth: nao
   - Resposta: lista filtrada por categoria

3. `GET /api/perguntas/:id`
   - Auth: nao
   - Resposta: pergunta por id

4. `POST /api/perguntas`
   - Auth: sim (JWT)
   - Body: `{ categoria, pontuacao, pergunta, resposta_correta, respostas_incorretas }`
   - Resposta: 201

5. `PUT /api/perguntas/:id`
   - Auth: sim
   - Body: campos de pergunta
   - Resposta: 200

6. `DELETE /api/perguntas/:id`
   - Auth: sim
   - Resposta: 204/200

---

## 5) Mobile - arquitetura e fluxo

### 5.1) Tecnologias atuais

- Expo SDK 54 (expo ~54.0.0)
- React 19.1.0
- React Native 0.81.5
- React Navigation (native, bottom-tabs, native-stack)
- Axios para API
- AsyncStorage para persistencia local

### 5.2) Entrada

- `mobile/App.jsx` renderiza `AppNavigator`.

### 5.3) Navegacao

Stack principal (AppNavigator):

- Home
- Login
- Cadastro
- MainTabs
- Temas
- Editar
- QuizLoading
- Quiz
- QuizResultado

Tabs (TabNavigator):

- Inicio
- Usuario

### 5.4) Base URL da API

Arquivo: `mobile/app/api/api.jsx`

- `baseURL` usa `process.env.EXPO_PUBLIC_API_URL`.
- fallback local: `http://192.168.0.6:3000/api`.

### 5.5) Persistencia local

AsyncStorage:

- `token`: JWT (string)
- `usuario`: objeto com dados do usuario (sem password)

### 5.6) Fluxo de cadastro (OTP)

Tela: `CadastroScreen.jsx`

1. Usuario preenche:
   - nome, sobrenome, data nascimento, email, senha.
2. `solicitarOtp`:
   - valida nome/sobrenome com regex.
   - chama `POST /usuarios/solicitar-otp`.
   - mostra alerta:
     - se response inclui `otp` (OTP_DEBUG=true), alerta com codigo.
     - caso contrario, alerta que email foi enviado.
3. `verificarOtp`:
   - chama `POST /usuarios/verificar-otp` com todos os campos.
   - se status 2xx, considera cadastro ok e volta para Home.
   - nao faz login automatico (nao salva token).

### 5.7) Fluxo de login

Tela: `LoginScreen.jsx`

1. Usuario informa email/senha.
2. `POST /usuarios/login`.
3. Salva `usuario` + `token` em AsyncStorage.
4. Navega para `MainTabs`.
5. Mensagens de erro:
   - 403: usuario bloqueado.
   - outros: email/senha incorretos.

### 5.8) Fluxo de quiz

1. Inicio -> Temas.
2. QuizLoading (contagem regressiva).
3. Quiz:
   - busca perguntas via `/perguntas/categoria?categoria=...`.
   - seleciona ate 10.
   - barra de tempo animada (8s).
4. Resultado:
   - registra pontuacao no backend (`POST /usuarios/:id/pontuacao`).
   - atualiza AsyncStorage com usuario retornado.

### 5.9) Tela Usuario

Tela: `UsuarioScreen.jsx`

- Carrega usuario do AsyncStorage ao focar.
- Converte historico_pontuacoes se vier como string.
- Exibe pontuacao total e dados pessoais.
- Botao para editar dados.

### 5.10) Tela Editar

Tela: `EditarScreen.jsx`

- Permite editar dados do usuario.
- Sintaxe corrigida anteriormente.

---

## 6) Docker - ambiente atual

Arquivo: `docker-compose.yml`

### 6.1) Servicos

1. `db`
   - Image: `postgres:16`
   - Porta: 5432
   - Volumes: `db_data`

2. `backend`
   - Build: `./backend`
   - Porta: 3000
   - Env:
     - `DB_*` (host, user, password, name, port)
     - `DB_SSL`
     - `JWT_SECRET`
     - `CORS_ORIGINS`
     - `OTP_TTL_MINUTES`
     - `OTP_DEBUG`
     - (opcional) `EMAIL_USER`, `EMAIL_PASS`
   - Volume bind: `./backend:/app`

3. `mobile`
   - Build: `./mobile`
   - Command: `npx expo start --lan --go`
   - Ports: 19000, 19001, 19002, 8081
   - Env:
     - `EXPO_PUBLIC_API_URL`
     - `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0`
     - `REACT_NATIVE_PACKAGER_HOSTNAME` (IP local do host)
     - `CI=false` (forca modo interativo)
   - `tty: true` e `stdin_open: true` (QR code no terminal)

4. `pgadmin`
   - Image: `dpage/pgadmin4:8`
   - Porta: 5050
   - Credenciais:
     - Email: `admin@quizdev.com`
     - Senha: `admin`
   - Volume: `pgadmin_data`

### 6.2) Observacoes de uso (Expo Go + QR)

- O QR code aparece no terminal do container `mobile`.
- `http://localhost:8081` abre o app web (nao o QR).
- Para celular fisico:
  - `REACT_NATIVE_PACKAGER_HOSTNAME` deve apontar para o IP local da maquina.
  - `EXPO_PUBLIC_API_URL` deve usar o mesmo IP e porta 3000.
- iOS (Expo Go):
  - Expo Go sempre exige o SDK mais recente (SDK 54 no momento deste doc).
  - Projeto esta em SDK 54 (expo ~54.0.0).

### 6.3) Dockerfiles

Backend:

- Base: `node:20-bullseye-slim`
- `npm install` no build
- `CMD ["npm", "run", "dev"]`

Mobile:

- Base: `node:20-bullseye-slim`
- `npm install` no build
- `CMD ["npm", "start"]` (override no compose com `npx expo start --lan --go`)

---

## 7) Variaveis de ambiente (lista completa e significado)

### Backend

- `PORT`: porta da API (default 3000).
- `NODE_ENV`: dev/prod (afeta SSL em DB).
- `DB_HOST`: host do Postgres (em Docker = `db`).
- `DB_PORT`: porta do Postgres (default 5432).
- `DB_USER`: usuario do banco.
- `DB_PASSWORD`: senha do banco.
- `DB_NAME`: nome do banco.
- `DB_SSL`: `true`/`false`.
  - `true`: ativa SSL no pg Pool.
  - `false`: desativa SSL.
- `JWT_SECRET`: segredo do JWT (obrigatorio).
- `CORS_ORIGINS`: lista separada por virgula de origens permitidas.
- `OTP_TTL_MINUTES`: tempo de validade do OTP em minutos (default 10).
- `OTP_DEBUG`:
  - `true`: nao envia email, retorna otp na resposta.
  - `false`: tenta enviar email via nodemailer.
- `LOGIN_RATE_LIMIT_MAX`: max de tentativas de login por janela (default 20/15 min).
- `OTP_RATE_LIMIT_MAX`: max de solicitacoes OTP por janela (default 5/10 min).
- `EMAIL_USER`: email remetente (ex: Gmail).
- `EMAIL_PASS`: senha de app (Gmail).

### Mobile (Expo)

- `EXPO_PUBLIC_API_URL`: base URL do backend (ex: `http://192.168.0.6:3000/api`).
- `EXPO_DEVTOOLS_LISTEN_ADDRESS`: `0.0.0.0` para devtools.
- `REACT_NATIVE_PACKAGER_HOSTNAME`: IP local para gerar QR Code com o host correto.
- `CI`: `false` para habilitar modo interativo (QR no terminal).

---

## 8) Atualizacoes realizadas desde a analise base

Backend:

- Corrigido export de `db.js` e SSL por env.
- OTP agora possui expiracao real (`expira_em`).
- OTP table criada no `dbInit`.
- OTP service retorna `otp` no modo debug.
- Rate limit em login e OTP.
- CORS configuravel por env.
- Protecao JWT adicionada para:
  - `GET /api/usuarios`
  - `POST/PUT/DELETE /api/perguntas`
- `authService` valida `JWT_SECRET` e expoe alias `generateToken`.
- `usuarioService` sanitiza usuario (nao retorna password).
- `usuarioService.update` aceita `senha` como alias e evita mutacao do input.
- `registrarPontuacao` criado (servico + rota + controller).

Mobile:

- Dependencia `@react-navigation/native-stack` adicionada.
- Base URL configuravel via `EXPO_PUBLIC_API_URL`.
- Tela `QuizResultado` registra pontuacao no backend.
- Tela `Usuario` atualiza usuario ao focar (useFocusEffect).
- `QuizScreen` corrigiu stop da animacao.
- `EditarScreen` corrigido (sintaxe).
- `app.json`: `web.output` = `single` (remove dependencia de expo-router).
- Atualizacao para Expo SDK 54 (compatibilidade com Expo Go iOS).

Docker:

- `docker-compose.yml` com servicos db/backend/mobile/pgadmin.
- `pgadmin` configurado (porta 5050).
- `mobile` inicia com `--lan --go` e `tty` para QR.
- `REACT_NATIVE_PACKAGER_HOSTNAME` configurado para IP local.

Dependencias:

- Vulnerabilidades resolvidas no backend e mobile.
- Expo e dependencias atualizadas para SDK 54.

---

## 9) Documentacao atual

- `README.md` atualizado para refletir o estado atual.
- `docs/RODAR_PROJETO.md` atualizado com Expo LAN/QR, envs e SDK 54.
- `docs/RESUMO-QUIZDEV.md` traz resumo curto.

---

## 10) Pontos ainda pendentes / riscos atuais

1. Fluxo OTP nao retorna token no controller
   - `otpService` gera token, mas `usuarioController.verificarOtp` devolve apenas `{ usuario }`.
   - Efeito: apos cadastro, usuario precisa logar manualmente.

2. Email OTP depende de Gmail com App Password
   - Sem `EMAIL_USER`/`EMAIL_PASS`, `solicitar-otp` falha (500).
   - Recomendacao: configurar variaveis ou trocar para provedor dedicado.

3. Admin/roles nao implementados
   - Hoje, qualquer usuario autenticado pode criar/editar/remover perguntas.
   - Sem controle de permissao.

4. `TrocarEmailService` permanece incompleto
   - Arquivo existe mas nao esta integrado ao fluxo.

5. `erroMiddleware` nao esta registrado
   - Erros sao tratados pelo handler simples no `server.js`.

6. `validadePerguntaMiddleware` nao usado
   - Se existir validacao de dificuldade, esta desconectada das rotas.

7. `coverage/` versionado
   - Pode poluir o repo se for commitado continuamente.

8. CORS aberto quando `CORS_ORIGINS` vazio
   - Em prod, deveria haver lista explicita.

---

## 11) Como rodar (estado atual)

### 11.1) Via Docker

1. Ajuste IP local no compose:
   - `EXPO_PUBLIC_API_URL` e `REACT_NATIVE_PACKAGER_HOSTNAME`.
2. Se OTP por email:
   - Defina `EMAIL_USER` e `EMAIL_PASS`.
3. Rodar:
   - `docker compose up --build`
4. Acessos:
   - API: `http://localhost:3000`
   - Swagger: `http://localhost:3000/api-docs`
   - PgAdmin: `http://localhost:5050`
   - Expo web: `http://localhost:8081`
5. Expo Go:
   - QR aparece no terminal do container.

### 11.2) Sem Docker (local)

Backend:

1. `cd backend`
2. `npm install`
3. `npm run dev`

Mobile:

1. `cd mobile`
2. `npm install`
3. `npm start`
4. Ajustar `EXPO_PUBLIC_API_URL` para o IP correto.

---

## 12) Estado de testes

Backend:

- Jest configurado em `backend/jest.config.js`.
- Cobertura minima definida (mais permissiva do que 95% original).

Mobile:

- Jest + jest-expo (SDK 54).
- Sem suite extensa de testes, apenas utilitarios.

---

## 13) Inventario de arquivos relevantes (lista expandida)

Backend:

- `backend/index.js`
- `backend/server.js`
- `backend/db/db.js`
- `backend/db/dbInit.js`
- `backend/models/usuarioModel.js`
- `backend/models/perguntaModel.js`
- `backend/repositories/usuarioRepository.js`
- `backend/repositories/perguntasRepository.js`
- `backend/repositories/otpRepository.js`
- `backend/services/authService.js`
- `backend/services/usuarioService.js`
- `backend/services/perguntasService.js`
- `backend/services/otpService.js`
- `backend/services/emailService.js`
- `backend/services/TrocarEmailService.js`
- `backend/controllers/usuarioController.js`
- `backend/controllers/perguntasController.js`
- `backend/routes/usuarioRoutes.js`
- `backend/routes/perguntasRoutes.js`
- `backend/middleware/authMiddleware.js`
- `backend/middleware/validateUsuario.js`
- `backend/middleware/rateLimiters.js`
- `backend/swagger/swaggerConfig.js`
- `backend/Dockerfile`
- `backend/.dockerignore`

Mobile:

- `mobile/App.jsx`
- `mobile/app.json`
- `mobile/app/api/api.jsx`
- `mobile/app/navigation/AppNavigator.jsx`
- `mobile/app/navigation/TabNavigator.jsx`
- `mobile/app/screens/Home/HomeScreen.jsx`
- `mobile/app/screens/Login/LoginScreen.jsx`
- `mobile/app/screens/Cadastro/CadastroScreen.jsx`
- `mobile/app/screens/Inicio/InicioScreen.jsx`
- `mobile/app/screens/Temas/TemaScreen.jsx`
- `mobile/app/screens/Quiz/QuizLoadingScreen.jsx`
- `mobile/app/screens/Quiz/QuizScreen.jsx`
- `mobile/app/screens/Quiz/QuizResultadoScreen.jsx`
- `mobile/app/screens/Usuario/UsuarioScreen.jsx`
- `mobile/app/screens/Editar/EditarScreen.jsx`
- `mobile/app/components/*`
- `mobile/Dockerfile`
- `mobile/.dockerignore`

Raiz:

- `docker-compose.yml`
- `README.md`
- `docs/RODAR_PROJETO.md`
- `docs/RESUMO-QUIZDEV.md`
- `docs/ERROS_E_MELHORIAS.md`
- `docs/NOVAS_FUNCIONALIDADES_E_MELHORIAS.md`

---

## 14) Observacoes finais

O projeto esta funcional em ambiente local, com suporte total a Docker.
Os principais ajustes de estabilidade e seguranca foram aplicados (OTP com expiracao, rate limit, CORS, auth em rotas sensiveis, sanitizacao de usuario).
O maior foco pendente e:

- consolidar documentacao (README e DOCKER),
- definir politica de permissao/admin,
- e opcionalmente fazer auto-login apos cadastro (retornar token em verificar-otp).

Este documento serve como contexto persistente para futuras mudancas e commits.

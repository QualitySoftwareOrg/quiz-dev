# QuizDev

<p align="center">
  <img src="https://github.com/eikefrota/quiz-dev/blob/main/images/mockup.png" alt="QuizDev mockup" width="600"/>
</p>

QuizDev e um app de quiz interativo feito em React Native (Expo) com backend em Node.js. Foi criado como projeto pratico do curso Tecnico em Desenvolvimento de Sistemas do SENAC CE, com o objetivo de unir aprendizado e diversao por meio de quizzes em varios temas.

---

## Objetivo

Oferecer uma experiencia educativa leve e envolvente, usando perguntas de multipla escolha sobre assuntos como Geografia, Historia, Ciencias e Matematica. O app tambem pode ser usado como ferramenta pedagogica em escolas.

---

## Funcionalidades

- Quizzes com multiplos temas e categorias
- Perguntas de multipla escolha (4 opcoes)
- Feedback visual imediato
- Calculo automatico de pontuacao
- Autenticacao com JWT e cadastro via OTP
- Documentacao da API com Swagger

---

## Telas do app

<p align="center">
  <img src="https://github.com/eikefrota/quiz-dev/blob/main/images/funcionalidades.png" alt="QuizDev features" width="800"/>
</p>

<p align="center">
  <img src="https://github.com/eikefrota/quiz-dev/blob/main/images/telas.png" alt="QuizDev screens" width="800"/>
</p>

---

## Tecnologias

### Mobile (front-end)

- React Native
- Expo (SDK 54)
- React Navigation
- Axios

### Backend

- Node.js
- Express
- PostgreSQL (pg)
- Swagger (OpenAPI)

---

## Como executar

### Opcao 1: Docker (recomendado)

Veja `docs/DOCKER.md` para o passo a passo completo (Postgres, backend, mobile e PgAdmin).

Inicio rapido:

```
docker compose up --build
```

Notas:

- Expo Go no iOS exige o SDK mais recente (o projeto esta no SDK 54).
- O QR Code aparece no terminal do container `mobile`.
- Para celular fisico, configure o IP da sua rede local em:
  - `EXPO_PUBLIC_API_URL`
  - `REACT_NATIVE_PACKAGER_HOSTNAME`

### Opcao 2: Local (sem Docker)

Backend:

```
cd backend
npm install
npm run dev
```

Mobile:

```
cd mobile
npm install
npm start
```

Defina a baseURL da API com:

- `EXPO_PUBLIC_API_URL` (ex: `http://192.168.0.6:3000/api`)

---

## OTP por email (opcional)

Para enviar OTP por email (ao inves do modo debug):

- Defina `EMAIL_USER` e `EMAIL_PASS` (Gmail App Password)
- Use `OTP_DEBUG=false`

---

## Documentacao extra

- `docs/DOCKER.md` (Docker e Expo Go)
- `docs/RESUMO-QUIZDEV.md` (documento detalhado)

---

## Equipe

- Eike Frota
- Pablo Angelo

---

## Contribuicoes

Contribuicoes sao bem-vindas. Abra issues ou pull requests com sugestoes, melhorias ou correcoes.

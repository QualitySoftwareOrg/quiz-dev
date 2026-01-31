# Resumo rapido - estado atual do QuizDev

Data deste resumo: 2026-01-31

Este arquivo e um resumo curto. Para o detalhamento completo, consulte:
- `docs/ESTADO_ATUAL_PROJETO_QUIZDEV.md`

---

## Visao geral
- Backend: Node.js + Express + PostgreSQL (pg)
- Mobile: Expo/React Native (SDK 54)
- Autenticacao: JWT + OTP no cadastro
- Swagger em `/api-docs`
- Docker Compose com db, backend, mobile e pgadmin

---

## Estado operacional
- Expo Go no iOS exige SDK 54 (projeto ja esta atualizado).
- QR Code do Expo aparece no terminal do container `mobile`.
- `http://localhost:8081` abre o app web, nao o QR.
- OTP por email exige `EMAIL_USER` e `EMAIL_PASS` (Gmail App Password).

---

## Pontos importantes
- `OTP_DEBUG=true` retorna o codigo no response (modo debug).
- `OTP_DEBUG=false` envia OTP por email.
- `EXPO_PUBLIC_API_URL` e `REACT_NATIVE_PACKAGER_HOSTNAME` devem usar o IP local da maquina.

---

## Documentacao atualizada
- `README.md` atualizado com instrucoes atuais
- `docs/DOCKER.md` atualizado com Expo/QR e variaveis


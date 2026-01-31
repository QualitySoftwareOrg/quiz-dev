# Docker (backend, mobile e banco)

Este documento descreve como subir o projeto com Docker e docker-compose.

## Requisitos
- Docker Desktop
- Docker Compose

## Subir todos os servicos
```
docker compose up --build
```

Servicos:
- db: Postgres 16 (porta 5432)
- pgadmin: PgAdmin 4 (porta 5050)
- backend: API Node (porta 3000)
- mobile: Expo dev server (portas 19000-19002, 8081)

## Observacoes importantes (Mobile)
- O Expo dentro do container serve o bundle, mas o dispositivo (ou emulador) precisa acessar a API.
- O valor de `EXPO_PUBLIC_API_URL` fica no `.env` e deve apontar para o IP da sua maquina.
  - Exemplo: `http://192.168.0.6:3000/api`
- Para o QR Code apontar para o IP correto, mantenha:
  - `REACT_NATIVE_PACKAGER_HOSTNAME` = IP local da sua maquina (ex: `192.168.0.6`)
  - `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0`
  - `CI=false` (mantem modo interativo do Expo)
- O QR Code aparece no terminal do container `mobile`.
  - `http://localhost:8081` abre o app web, nao o QR.
- Se precisar usar tunel:
  - Troque o comando do `mobile` para:
    ```
    command: ["npx", "expo", "start", "--tunnel", "--go"]
    ```
  - Obs: tunel pode ser mais lento.

## Variaveis de ambiente principais
Backend (no `.env`):
- `DB_HOST=db`
- `DB_SSL=false`
- `JWT_SECRET=troque-este-segredo`
- `OTP_TTL_MINUTES=10`
- `OTP_DEBUG=false`
- (opcional) `EMAIL_USER` e `EMAIL_PASS` para envio real de OTP

Mobile (no `.env`):
- `EXPO_PUBLIC_API_URL=http://192.168.0.6:3000/api`
- `REACT_NATIVE_PACKAGER_HOSTNAME=192.168.0.6`
- `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0`
- `CI=false`

PgAdmin (no `.env`):
- URL: `http://localhost:5050`
- Email: `admin@quizdev.com`
- Senha: `admin`

## Arquivo .env
- Use `.env` local para rodar o projeto.
- Existe um `.env.example` com o modelo das variaveis.

## Dicas de desenvolvimento
- Os servicos usam bind-mounts para refletir alteracoes em tempo real.
- Se houver erro de dependencias, pare e rode `docker compose build --no-cache`.
- Expo Go (iOS) exige a versao de SDK mais recente. O projeto esta em SDK 54.

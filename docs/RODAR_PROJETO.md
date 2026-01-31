# Como Rodar o Projeto (Docker + Expo)

Este documento descreve o passo a passo para subir **backend, banco, pgAdmin e mobile** usando Docker.

## 1) Requisitos
- Docker Desktop instalado e rodando
- Docker Compose (vem junto com o Docker Desktop)

## 2) Preparar o `.env`
1. Copie o arquivo de exemplo:
   ```
   copy .env.example .env
   ```
2. Edite o `.env` e ajuste **principalmente**:
   - `JWT_SECRET` (coloque um valor forte)
   - `EMAIL_USER` e `EMAIL_PASS` (senha de app do Gmail, se quiser envio real de OTP)
   - **IP local para o mobile**:
     - `EXPO_PUBLIC_API_URL=http://<SEU_IP>:3000/api`
     - `REACT_NATIVE_PACKAGER_HOSTNAME=<SEU_IP>`

### Como descobrir o IP local (Windows)
No PowerShell:
```
ipconfig
```
Use o IPv4 da sua rede Wi‑Fi.

## 3) Subir os serviços com Docker
Na raiz do projeto:
```
docker compose up --build
```

Serviços que sobem:
- `db` (Postgres 16) → porta `5432`
- `pgadmin` (PgAdmin 4) → porta `5050`
- `backend` (API Node) → porta `3000`
- `mobile` (Expo dev server) → portas `19000-19002` e `8081`

## 4) Acessos úteis
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- PgAdmin: `http://localhost:5050`

## 5) Expo Go (QR Code)
O QR Code **aparece no terminal** do serviço `mobile`.
Para visualizar os logs:
```
docker compose logs -f mobile
```

Importante:
- `http://localhost:8081` abre a **versão web**, não o QR Code.
- O celular deve estar na **mesma rede Wi‑Fi**.
- Garanta no `.env`:
  - `EXPO_PUBLIC_API_URL` apontando para o IP do seu PC
  - `REACT_NATIVE_PACKAGER_HOSTNAME` com o mesmo IP
  - `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0`
  - `CI=false`

Se precisar usar túnel:
```
command: ["npx", "expo", "start", "--tunnel", "--go"]
```
Obs: túnel pode ficar mais lento.

## 6) PgAdmin (opcional)
1. Acesse `http://localhost:5050`
2. Login:
   - Email: `PGADMIN_DEFAULT_EMAIL`
   - Senha: `PGADMIN_DEFAULT_PASSWORD`
3. Crie um servidor:
   - Host: `db`
   - Porta: `5432`
   - Usuário/Senha: os mesmos do `.env` (`DB_USER` / `DB_PASSWORD`)

## 7) Popular o banco com perguntas (seed)
O script está em `backend/scripts/seedPerguntas.js`.

Rodar seed (não apaga se já existir):
```
docker compose exec backend node scripts/seedPerguntas.js
```

Forçar reinserção (apaga e recria):
```
docker compose exec -e SEED_FORCE=true backend node scripts/seedPerguntas.js
```

## 8) Parar tudo
```
docker compose down
```

## 9) Problemas comuns
- **Sem QR Code**: confira IP no `.env` e se o celular está na mesma rede.
- **OTP não chega**: configure `EMAIL_USER` e `EMAIL_PASS` (senha de app).
- **Dependências quebradas**: rode `docker compose build --no-cache`.
- **Expo Go (iOS)**: requer SDK atualizado (projeto está em SDK 54).

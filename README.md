# Agenda Fullstack

Aplicação completa de gerenciamento de tarefas com:

- **Backend**: Laravel 10 + MySQL
- **Frontend**: React 18 + Material-UI

## Estrutura

agenda-fullstack/
├── backend/ # API Laravel
│ ├── app/
│ ├── config/
│ └── ...
├── frontend/ # Aplicação React
│ ├── src/
│ ├── public/
│ └── ...


## Primeiros Passos

### 1. Configurar backend
```bash
cd backend
cp .env.example .env
composer install
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate

### 2. Configurar frontend
cd frontend
npm install
npm run dev
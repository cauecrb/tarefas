# Agenda Fullstack

Aplicação completa de gerenciamento de tarefas com:

- **Backend**: Laravel 10 + MySQL
- **Frontend**: React 18 + Material-UI

este projeto foi feito com React, MySQL e Sail, para encapsular o backend Laravel.

## Estrutura

agenda/
├── agenda/ # API Laravel
│ ├── app/
│ ├── config/
│ └── ...
├── agenda-frontend/ # Aplicação React
│ ├── src/
│ ├── public/
│ └── ...


## Primeiros Passos

### 1. Configurar backend
cd backend
composer install
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate

### 2. Configurar frontend
cd frontend
npm install
npm run dev

## 3. executando o projeto
após iniciar o backend e o forntend, acessar localhost:3000 para a view de lista de tarefas.

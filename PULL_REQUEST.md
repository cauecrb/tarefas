# Descrição da Pull Request

Descrição do projeto de criação do projeto de agenda de tarefas.

### Funcionalidades Principais
- **CRUD Completo de Tarefas**
- **Sistema de Favoritos**
- **Personalização de Cores**
- **Filtro por Cor**
- **Criação Rápida Inline**

## Checklist
### Backend
- **CRUD Completo de Tarefas**
    foi criado CRUD para criação, ediçao e apagar tarefas, com seu titulo, descrição e data de criação e conclusão obrigatorias. Através de migration.
    Realizei a configuraçao co Cors, para o frontend poder acessar a Api laravel.
    Atualização do CRUD atraves de migration para adicionar tarefas favoritas e cores das tarefas, e tornar as datas de conclusão não obrigatórias.

### Frontend
    Após criar o backend, comecei as funcionalidades frontend com a pagina de listagem das tarefas, mostrando toas as tarefas e com um botao para criar uma nova.
    depois atualizei a vizualização das tarefas para o sitemas de cards.
    Apos implementação da visualização dos cards, implementei o sistema de favoritos e removi a obrigatoriedade de datas das tarefas.
    e por fim, implementei a criação de novas tarefas na mesma pagina das listadas e a filtragem por cores.

- **Versão do Node:** v18.16.0
- **Versão do PHP:** 8.2.8
- **Versão do Composer:** 2.5.8

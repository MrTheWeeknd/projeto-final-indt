Sistema de Gestão de Stock e IoT (API)

Este projeto é uma API REST desenvolvida em Node.js com TypeScript, utilizando TypeORM para persistência de dados num banco PostgreSQL via Docker. O projeto também conta com testes de integração automatizados utilizando Cypress.

🚀 Tecnologias Utilizadas

Backend: Node.js, Express, TypeScript

Base de Dados: PostgreSQL (via Docker)

ORM: TypeORM

Validação: Zod

Testes: Cypress

Infraestrutura: Docker & Docker Compose

🛠️ Como Executar o Projeto

1. Pré-requisitos

Certifique-se de ter instalado na sua máquina:

Docker

Node.js (recomendado v18+)

2. Configuração do Ambiente

Crie um ficheiro .env na raiz do projeto com as seguintes variáveis (ajuste conforme necessário):

PORT=6060
DB_HOST=postgres-db
DB_PORT=5432
DB_USER=postgres
DB_PASS=suasenha
DB_NAME=reservaIot2


3. Subir os Contentores (Docker)

Para iniciar a API e a Base de Dados, execute:

docker compose up --build


A API estará disponível em: http://localhost:6060/api
Pode verificar a saúde da API em: http://localhost:6060/api/health

🧪 Testes Automatizados (Cypress)

Os testes foram configurados para validar o fluxo completo das entidades (Categorias, Usuários, Insumos e Movimentações).

Executar via Interface Gráfica (Recomendado)

npx cypress open


Selecione E2E Testing -> Escolha o Browser -> Clique no ficheiro de teste (ex: fluxo_estoque.api.cy.ts).

Executar via Terminal (Modo Headless)

npx cypress run


📂 Estrutura de Pastas

.
├── src/                  # Código fonte da API
│   ├── entities/         # Definição das tabelas do banco de dados
│   ├── routes/           # Definição das rotas (prefixo /api)
│   ├── controllers/      # Lógica de receção de pedidos
│   ├── services/         # Lógica de negócio
│   └── database/         # Configuração do DataSource
├── cypress/              # Testes automatizados
│   └── e2e/              # Ficheiros de teste (.cy.ts)
├── docker-compose.yml    # Orquestração dos serviços
├── cypress.config.ts     # Configuração global do Cypress
├── tsconfig.json         # Configuração do TypeScript (ajustada para ignorar testes no build)
└── package.json          # Dependências e scripts


🖥️ Acesso à Base de Dados (Útil)

Para verificar os dados inseridos pelos testes diretamente no PostgreSQL:

Entrar no contentor:

docker exec -it postgres-db psql -U postgres


Conectar ao banco correto:

\c reservaIot2


Comandos rápidos:

Listar tabelas: \dt

Ver categorias: SELECT * FROM categoria;

Ver stock atual: SELECT nome, estoque_atual FROM insumo;

Sair: \q

⚠️ Observações Importantes

Build do TypeScript: O ficheiro tsconfig.json foi configurado com exclude: ["cypress"] para evitar erros de compilação durante o npm run build no Docker.

Prefixos de Rota: Todas as rotas da API devem ser acedidas via /api (ex: /api/categorias).

Nomes Únicos: Os testes utilizam Date.now() para gerar nomes e emails únicos, permitindo que os testes sejam executados várias vezes sem conflitos de integridade no banco.
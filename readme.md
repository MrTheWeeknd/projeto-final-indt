# Sistema de Gestão de Estoque de Insumos

Este projeto é uma API REST desenvolvida em **Node.js** com **TypeScript**, utilizando **TypeORM** para persistência de dados num banco **PostgreSQL** via **Docker**. O projeto também conta com testes de integração automatizados utilizando **Cypress**, o projeto foi desenvolvido como atividade final do curso de desenvolvimento FullStack para o INDT.

## 🚀 Tecnologias Utilizadas

* **Backend:** Node.js, Express, TypeScript
* **Base de Dados:** PostgreSQL (via Docker)
* **ORM:** TypeORM
* **Validação:** Zod
* **Testes:** Cypress
* **Infraestrutura:** Docker & Docker Compose

---

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos

Certifique-se de ter instalado na sua máquina:
* [Docker](https://www.docker.com/)
* [Node.js](https://nodejs.org/) (v18 ou superior recomendada)

### 2. Configuração do Ambiente

Crie um ficheiro `.env` na raiz do projeto com as seguintes variáveis:

```env
JWT_ACCESS_SECRET="CHAVE SECRETA ACCESS"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_SECRET="CHAVE SECRETA REFRESH"
JWT_REFRESH_EXPIRATION="7d"
PORT=6060
NODE_ENV="development"
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=123
DB_NAME=localhost
```
No código já está fornecido o `.env.example`, então você pode rodar o seguinte comando:
```env.example
cp .env.example .env
```

Após copiar o arquivo do example, você terá que criar sua própria chave JWT, você pode rodar os seguintes comandos para a obtenção das chaves para o `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` (Rode duas vezes para gerar duas chaves diferentes):

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Após esses passos você poderá finalmente rodar o docker para gerar os containers que rodarão a aplicação:
```
docker compose up --build
```

A API estará diponível em: `http://localhost:6060/api`


### 3. Testes Automatizados (Cypress)

Você poderá ver o funcionamento da API mandando requisições através do Postman, Yaak, mas a princípio deixamos todas as rotas atuais com testes automatizados através do cypress, você pode rodar tanto pela `GUI` (Interface Gráfica) ou pelo `CLI` (Terminal)

Execuntando pelo `GUI`

```GUI
npx cypress open
```


1. Selecione **E2E Testing**.
2. Escolha o Browser.
3. Clique no ficheiro de teste.

Executando pelo `CLI`

```
npx cypress run
```

### 4. Estrutura de Pastas

```Pastas
.
├── cypress/              # Testes automatizados
├── src/                  # Código fonte da API
├── .env.example          # Variáveis de Ambiente
├── cypress.config.ts     # Configuração Cypress
├── docker-compose.yml    # Orquestração Docker
├── Dockerfile            # Configuração Docker
└── package.json          # Dependências
├── tsconfig.json         # Configuração TypeScript
└── readme.md             # Apresentação do projeto
```


### 5. Acesso à Base de Dados (PSQL)

Para verificar os dados inseridos pelo Cypress diretamento no Postgres:

1. Entrar no container:
   
```container
docker exec -it postgres-db psql -U postgres
```

2. Conectar ao banco:

```
\c localhost
```

3. Colsulta rápidas:

Listar tabelas: `\dt`
Ver tabelas: `SELECT * FROM tabela`
Sair: `\q`


### 6. Ao finalizar os testes rode para finalizar o container

```
docker compose down
```

```
docker compose down -v
```

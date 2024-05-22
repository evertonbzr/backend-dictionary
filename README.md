# Back-end Challenge - Dictionary

> This is a challenge by [Coodesh](https://coodesh.com/)

## Description

This is a simple dictionary API that allows users to create an account, login, and search for words. The API is a proxy to the Words API and will allow the user to save words as favorites, see the history of words searched, and delete words from the favorites list.

[X] - Como usuário, devo ser capaz de realizar login com usuário e senha
[X] - Como usuário, devo ser capaz de visualizar a lista de palavras do dicionário
[X] - Como usuário, devo ser capaz de guardar no histórico palavras já visualizadas
[X] - Como usuário, devo ser capaz de visualizar o histórico de palavras já visualizadas
[X] - Como usuário, deve ser capaz de guardar uma palavra como favorita
[X] - Como usuário, deve ser capaz de apagar uma palavra favorita
[] - Internamente, a API deve fazer proxy da Words API, pois assim o front irá acessar somente a sua API
[X] - Configurar Docker no Projeto para facilitar o Deploy da equipe de DevOps;
[X] - Implementar paginação com cursores ao inves de usar page e limit

## The Stack

The application is build with the following technologies to provide a few key development experience:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Fastify](https://fastify.dev/) - Fastify is a web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture.
- [DrizzleORM](https://orm.drizzle.team/) - Drizzle ORM is a headless TypeScript ORM with a head
- [Postgres](https://www.postgresql.org/) - A database management system emphasizing extensibility and SQL compliance.
- [Docker](https://www.docker.com/) - Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers
- [Pnpm](https://pnpm.io/) - Fast, reliable, and secure dependency management
- [Redis](https://redis.io/) - Redis is a source-available, in-memory storage, used as a distributed, in-memory key–value database, cache and message broker, with optional durability.

- [TypeScript](https://www.typescriptlang.org/)

## How to use

You can use docker and docker compose to run the project in your local environment.

1. Clone the repository:

```bash
git clone
```

2. Run the project:

```bash
docker-compose up
```

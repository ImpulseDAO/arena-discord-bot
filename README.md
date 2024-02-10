# Discord bot app

This is a simple discord bot app that can be used to create vouchers for [Vara Network](https://vara.network/) dapps.

### Installation

1. Install the dependencies

```sh
npm install
```

2. Copy the `_env.example` file to `.env` and fill in the required fields.

```sh
cp _env.example .env
```

3. Fill in the required fields in the `.env` file such as `DISCORD_TOKEN` and `APPLICATION_ID` (you can get these values in [Discord Developer Portal](https://discord.com/developers/applications))

4. Install and start PostgreSQL <https://www.postgresql.org/download/linux/ubuntu/>
5. Create user and database, fill in databse-related fields in the `.env` file
6. Build and run the app

```sh
npm run build
npm start
```

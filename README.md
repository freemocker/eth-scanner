# ETH Scanner

A RESTful JSON API backend with either MongoDB or Postgres database store of your choice or even both.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (>= v8.9.4)
- npm (>= v3.10.9)
- Database of your choice: MongoDB, Postgres or both
	- [Suggested MongoDB installation] (https://docs.mongodb.com/manual/installation/)
	- [Suggested Postgres installation] (https://postgresapp.com/)

### Installing

```
$ # Install Mongo or/and Postgres by the suggested links above...
$ npm install
```

### Testing Databases CRUD operations

#### MongoDB Driver

```
$ # Start MongoDB daemon...
$ ./examples/database/mongo.sample.js
$ # It should print out the result of each CRUD operations...
```

#### Postgres Driver

```
$ # Start Postgres server...
$ ./examples/database/postgres.sample.js
$ # It should print out the result of each CRUD operations...
```

### Running Server Locally

```
$ # Start MongoDB daemon or/and Postgres server...
$ npm start
```

***[Note] It runs with MongoDB driver by default. Switching to Posgres driver requires only the following one change to any of database strategy object of your choice:***

```
{
  storeType: constants.STORE.TYPES.MONGO_DB, // CHANGE THIS TO `constants.STORE.TYPES.POSTGRES`
  operation: {
    type: constants.STORE.OPERATIONS.SELECT,
    data: [
      { address: state.address }
    ]
  },
  tableName: constants.STORE.TABLE_NAMES.ADDRESS_INFO
}
```

### Verify if it running properly

#### Step 1 - Sync with [Etherscan API] (https://etherscan.io/apis) for the given ETH address

- Open a shell you prefer and type the following command:

```
$ curl -X POST -H "Content-Type: application/json" -d '{"address": "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"}' http://localhost:8087/api/v1/eth/sync

```

- It should print the output similar to the following:

```
{"result":{"meta":{"name":"SYNC"},"data"[{"success":true,"detail":{"balance":"669816154518885498951364","transactions":[...],"address":"0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae","version":"1","systemData":{...}
```

#### Step 2 - Fetch the balance for the given ETH address

- Open a shell you prefer and type the following command:

```
curl -X GET http://localhost:8087/api/v1/eth/balance?address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae

```

- It should print the output similar to the following:

```
{"result":{"meta":{"name":"FETCH_BALANCE"},"data":[{"success":true,"detail":{"balance":"669816154518885498951364"}}]}}
```

#### Step 3 - Fetch the transactions for the given ETH address

- Open a shell you prefer and type the following command:

```
curl -X GET http://localhost:8087/api/v1/eth/transactions?address=+0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae

```

- It should print out somthing similar to the following:

```
{"result":{"meta":{"name":"FETCH_TRANSACTIONS"},"data":[{"success":true,"detail":{"transactions":[...]}}]}}
```

## Testing and Contributing

### Style Lint

```
$ npm run lint
```

### Unit test

```
$ npm run unit-test
```


## Technology

* [Express.js] (http://expressjs.com/)
* [Sequelize] (http://docs.sequelizejs.com/en/latest/)
* [Mongojs] (https://github.com/mafintosh/mongojs)

***[Note] All required packages and versions are listed in `package.json`***

## Author

* **Marcus Hsu** - *Initial work*

## License

This project is licensed under the MIT License

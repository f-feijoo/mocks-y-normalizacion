const knexMySql = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "databasecoder",
  },
  pool: { min: 2, max: 8 },
});

knexMySql.schema
  .createTableIfNotExists("productos", function (table) {
    table.increments("id").primary();
    table.string("title");
    table.string("price");
    table.string("thumbnail");
  })
  .then(() => {
    console.log("Tabla productos creada");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = { knexMySql };

require("./db/mongoconfig");
const express = require("express");
const productos = require("./routes/productos.js");
const http = require("http");
const { knexMySql } = require("./db/db.js");
const Mensaje = require("./models/Mensajes");

const app = express();
const server = http.createServer(app);

app.set("views", "./views");
app.set("view engine", "ejs");

const { Server } = require("socket.io");
const moment = require("moment");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", productos);

const PORT = process.env.PORT || 8080;

io.on("connection", (socket) => {
  knexMySql
    .from("productos")
    .select("*")
    .then((resp) => {
      socket.emit("productos", resp);
      socket.on("dataMsn", (x) => {
        const { title, price, thumbnail } = x;
        let objNew = {
          title: title,
          price: price,
          thumbnail: thumbnail,
        };
        knexMySql("productos")
          .insert(objNew)
          .then(() => {
            console.log("Registro ok!");
            knexMySql
              .from("productos")
              .select("*")
              .then((resp) => {
                io.sockets.emit("productos", resp);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  const getAll = async () => {
    try {
      const documentos = await Mensaje.find();
      return JSON.parse(JSON.stringify(documentos));
    } catch {}
  };
  getAll().then((resp) => {
    socket.emit("mensajes", resp);
  });

  socket.on("Msn", (x) => {
    const { user, ms } = x;
    let newMen = {
      user: user,
      time: moment().format("DD/MM/YYYY hh:mm:ss"),
      ms: ms,
    };
    const saveMen = async (ms) => {
      let doc = Mensaje.create(ms);
      getAll().then((resp) => {
        io.sockets.emit("mensajes", resp);
      });
    };
    saveMen(newMen);
  });
});

app.get("/", (req, res) => {
  knexMySql
    .from("productos")
    .select("*")
    .then((resp) => {
      res.render("index", { data: resp });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  let objNew = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
  };
  knexMySql("productos")
    .insert(objNew)
    .then(() => {
      console.log("Registro ok!");
    })
    .catch((err) => {
      console.log(err);
    });
});

server.listen(PORT, () => {
  console.log(
    `Servidor http creado con express escuchando en el puerto ${PORT}`
  );
});

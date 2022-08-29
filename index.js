const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");

const db = lowDb(new FileSync("db.json"));
const app = express();
const PORT = 4000;

app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res) =>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/persons", (req, res) => {
  const data = db.get("persons").value();
  return res.json(data);
});

app.get("/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const data = db.get("persons").find({ id: id }).value();
  return res.json(data);
});

app.delete("/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const data = db.get("persons").remove({ id: id }).write();
  res.json({ success: true });
});

app.post("/persons", (req, res) => {
    console.log("Post");

  const lastPerson = db.get("persons").takeRight(1).value()[0];
  const person = req.body;
  db.get("persons")
    .push({
      id: lastPerson.id + 1,
      nombre: person.nombre,
      apellido: person.apellido,
      cedula: person.cedula,
    })
    .write();
  res.json({ success: true });
});

app.put("/persons", (req, res) => {
  const person = req.body;

  console.log('actualizar: '+req.body.id)

  db.get("persons")
    .find({ id: person.id })
    .assign({
      id: person.id,
      nombre: person.nombre,
      apellido: person.apellido,
      cedula: person.cedula
    })
    .write();
  res.json("Actualizado!!");
});

app.listen(PORT, function () {
  console.log(`Backend is running on http://localhost:${PORT}`);
});

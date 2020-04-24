// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const pug = require("pug");

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");

var adapter = new FileSync("db.json");
var db = low(adapter);

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

db.defaults({ todos: [] }).write();

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("I love CodersX");
});

//app.get("/todos", (request, response) => {
//  response.render("index", {
//todoList: todoList;
//  });
//});

app.get("/todos", function(request, response) {
  var q = request.query.q;
  if (q === undefined) {
    response.render("index", {
      todoList: db.get("todos").value()
    });
  } else {
    var matchTodoList = db
      .get("todos")
      .value()
      .filter(function(todo) {
        return todo.text.toLowerCase().indexOf(q.toLowerCase()) !== -1;
      });
    response.render("index", {
      todoList: matchTodoList
    });
  }
});

app.post("/todos/create", function(request, response) {
  db.get("todos")
    .push(request.body)
    .write();
  response.redirect("back");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});

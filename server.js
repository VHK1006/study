// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const pug = require("pug");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var todoList = [
  { id: 1, todo: "Đi chợ" },
  { id: 1, todo: "Nấu cơm" },
  { id: 1, todo: "Rửa bát" },
  { id: 1, todo: "Học tại CodersX" }
];

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
      todoList: todoList
    });
  } else {
    var matchTodoList = todoList.filter(function(todo) {
      return todo.todo.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    response.render("index", {
      todoList: matchTodoList
    });
  }
});

app.post("/todos/create", function(request, response) {
  todoList.push(request.body);
  response.redirect("back");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});

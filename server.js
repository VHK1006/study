// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var pug = require("pug");
var shortid = require("shortid");
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");

var adapter = new FileSync("db.json");
var db = low(adapter);

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

db.defaults({ books: [], users: [] }).write();

app.get("/", function(request, response) {
  response.render("index", {
    books: db.get("books").value()
  });
});

//find
app.get("/books", function(request, response) {
  var q = request.query.q;
  if (q === undefined) {
    response.render("index", {
      books: db.get("books").value()
    });
  } else {
    var matchBook = db
      .get("books")
      .value()
      .filter(function(book) {
        return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
      });
    response.render("index", {
      books: matchBook
    });
  }
});

//delete
app.get("/books/:id/delete", function(request, response) {
  var id = request.params.id;
  db.get("books")
    .remove({ id: id })
    .write();
  response.redirect("/books");
});

//update
app.get("/books/update", function(request, response) {
  var title = request.query.title;
  var newTitle = request.query.newtitle;
  db.get("books")
    .find({ title: title })
    .assign({ title: newTitle })
    .write();
  response.redirect("back");
});

//create
app.get("/books/create", function(request, response) {
  response.render("createbook");
});

app.post("/books/create", function(request, response) {
  request.body.id = shortid.generate();
  db.get("books")
    .push(request.body)
    .write();
  response.redirect("/books");
});

//find user
app.get("/users", function(request, response) {
  var q = request.query.q;
  if (q === undefined) {
    response.render("users", {
      users: db.get("users").value()
    });
  } else {
    var matchUser = db
      .get("users")
      .value()
      .filter(function(user) {
        return (
          user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 ||
          user.phonenumber.indexOf(q) !== -1
        );
      });
    response.render("users", {
      users: matchUser
    });
  }
});

//delete user
app.get("/users/:id/delete", function(request, response) {
  var id = request.params.id;
  db.get("users")
    .remove({ id: id })
    .write();
  response.redirect("/users");
});

//create user
app.get("/users/create", function(request, response) {
  response.render("createuser");
});

app.post("/users/create", function(request, response) {
  request.body.id = shortid.generate();
  db.get("users")
    .push(request.body)
    .write();
  response.redirect("/users");
});

//update user
app.get("/users/update", function(request, response) {
  var name = request.query.name;
  var phoneNumber = request.query.phonenumber;
  var newPhoneNumber = request.query.newphonenumber;
  db.get("users")
    .find({ phonenumber: phoneNumber })
    .assign({ phonenumber: newPhoneNumber })
    .write();
  response.redirect("back");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

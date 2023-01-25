const express = require("express");
const { generateRandomString,checkDuplicateEmail } = require('./helperFunctions');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user : users[req.cookies.user_id]
  };
  console.log(templateVars.user);
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user : users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});
app.post("/urls/:id/delete", (req, res) => {
  const urlDelete = req.params.id;
  delete urlDatabase[urlDelete];
  res.redirect("/urls");
});
app.post("/urls/:id/update", (req, res) => {
  const updatedURLID = req.params.id;
  urlDatabase[updatedURLID] = req.body.URL;
  res.redirect(`/urls/${updatedURLID}`);
});
app.post("/login", (req, res) => {
  res.cookie("user_id", req.body.username);
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
app.get("/register", (req, res) => {
  const templateVars = {user : users[req.cookies.user_id]};
  res.render("urls_register", templateVars);
});
app.post("/register", (req, res) => {
  const newRandomID = generateRandomString();
  if (req.body.pass === "" || req.body.email === "") {
    res.status(400);
    res.send("Email or password cannot be empty");
    return res.redirect("/register");
  }
  if (checkDuplicateEmail(users, req.body.email)) {
    res.status(400);
    res.send("Email is already signed up");
    return res.redirect("/register");
  }
  users[newRandomID] = {
    id : newRandomID,
    email: req.body.email,
    password: req.body.pass
  };
  res.cookie("user_id", newRandomID);
  console.log(users);
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
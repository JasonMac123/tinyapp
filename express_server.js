const express = require("express");
const { generateRandomString, checkEmail ,checkPassword, urlsForUser } = require('./helperFunctions');
const cookieParser = require('cookie-parser');
const { resolveInclude } = require("ejs");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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
    allowedUrls: urlsForUser(req.cookies.user_id, urlDatabase),
    user : users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    return res.redirect("/login");
  }
  const templateVars = {user : users[req.cookies.user_id]};
  res.render("urls_new", templateVars);
});
app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404);
    res.send("the url link does not exist");
    return;
  }
  if (!req.cookies.user_id) {
    res.status(401);
    res.send("you must be logged in to continue");
    return;
  }
  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    res.status(401);
    res.send("you do not own the link");
    return;
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user : users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:id", (req, res) => {
  const link = urlDatabase[req.params.id].longURL;
  res.redirect(link);
});
app.post("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("cannot shorten urls if you are not logged in");
  }
  urlDatabase[generateRandomString()] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  };
  res.redirect("/urls");
});
app.post("/urls/:id/delete", (req, res) => {
  const urlDelete = req.params.id;
  delete urlDatabase[urlDelete];
  res.redirect("/urls");
  if (!urlDatabase[req.params.id]) {
    res.status(404);
    res.send("the url link does not exist");
    return;
  }
  if (!req.cookies.user_id) {
    res.status(401);
    res.send("you must be logged in to continue");
    return;
  }
  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    res.status(401);
    res.send("you do not own the link");
    return;
  }
});
app.post("/urls/:id/update", (req, res) => {
  const updatedURLID = req.params.id;
  urlDatabase[updatedURLID].longURL = req.body.URL;
  res.redirect(`/urls/${updatedURLID}`);
});
app.get("/login", (req,res) => {
  if (req.cookies.user_id) {
    return res.redirect('/urls');
  }
  const templateVars = {user : users[req.cookies.user_id]};
  res.render('urls_login', templateVars);
});
app.post("/login", (req, res) => {
  console.log(users);
  if (!checkEmail(users, req.body.email)) {
    res.status(403);
    res.send("user with email cannot be found");
    return;
  }
  const userLogin = checkPassword(users, req.body.email, req.body.pass);
  if (userLogin === false) {
    res.status(403);
    res.send("password does not match");
    return;
  }
  res.cookie("user_id", userLogin);
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});
app.get("/register", (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect('/urls');
  }
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
  if (checkEmail(users, req.body.email)) {
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
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
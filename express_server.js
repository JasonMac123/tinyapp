const express = require("express");
const { generateRandomString, checkEmail ,checkPassword, urlsForUser } = require('./helperFunctions');
const { urlDatabase, users} = require('./dataset');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    allowedUrls: urlsForUser(req.cookies.user_id),
    user : users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {//checks if the user is logged in
    return res.redirect("/login");
  }
  const templateVars = {user : users[req.cookies.user_id]};
  res.render("urls_new", templateVars);
});
app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) { //checks if the id exists in the dataset
    res.status(404).send("the url link does not exist");
    return;
  }
  if (!req.cookies.user_id) { //checks if the user is logged in
    res.status(401).send("you must be logged in to continue");
    return;
  }
  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) { //checks if the loggged user has permissions to alter the link
    res.status(401).send("you do not own the link");
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
  if (!req.cookies.user_id) {//checks if the user is logged in
    return res.status(403).send("cannot shorten urls if you are not logged in");
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
  if (!urlDatabase[req.params.id]) {//checks if the id exists in the database
    res.status(404).send("the url link does not exist");
    return;
  }
  if (!req.cookies.user_id) {//checks if the user is logged in
    res.status(401).send("you must be logged in to continue");
    return;
  }
  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {//checks if the user has permissions
    res.status(401).send("you do not own the link");
    return;
  }
});
app.post("/urls/:id/update", (req, res) => {
  const updatedURLID = req.params.id;
  urlDatabase[updatedURLID].longURL = req.body.URL;//updates the id of the shortened link to the new link
  res.redirect(`/urls/${updatedURLID}`);
});
app.get("/login", (req,res) => {
  if (req.cookies.user_id) { //redirects the user if they are logged in already
    return res.redirect('/urls');
  }
  const templateVars = {user : users[req.cookies.user_id]};
  res.render('urls_login', templateVars);
});
app.post("/login", (req, res) => {
  if (!checkEmail(req.body.email)) {//checks if the email is in the database
    res.status(403).send("user with email cannot be found");
    return;
  }
  const userLogin = checkPassword(req.body.email, req.body.pass);//returns the user if the password matches the email else it will return false
  if (userLogin === false) {
    res.status(403).send("password does not match");
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
  if (req.cookies.user_id) { //redirects the user if they are logged in already
    return res.redirect('/urls');
  }
  const templateVars = {user : users[req.cookies.user_id]};
  res.render("urls_register", templateVars);
});
app.post("/register", (req, res) => {
  const newRandomID = generateRandomString(); //generates new ID for the user
  if (req.body.pass === "" || req.body.email === "") {//user must enter in non-empty values for pass and email
    res.status(400).send("Email or password cannot be empty");
    return res.redirect("/register");
  }
  if (checkEmail(req.body.email)) {//cannot be duplicate email in the users dataset already
    res.status(400).send("Email is already signed up");
    return res.redirect("/register");
  }
  users[newRandomID] = {//adds the user to the users database with their credientials
    id : newRandomID,
    email: req.body.email,
    password: req.body.pass
  };
  res.cookie("user_id", newRandomID);//assigns a cookie using their id
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
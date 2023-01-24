const express = require("express");
const { generateRandomString } = require('./helperFunctions');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
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
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
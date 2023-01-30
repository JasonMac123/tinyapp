const express = require("express");
const {getUserByEmail ,checkPassword, urlsForUser, addUser, addURL, generateRandomString, checkUniqueVisitor, addTimeStamp, checkValidUrl } = require('./helpers/helperFunctions');
const { urlDatabase, users} = require('./data/dataset');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ["Hello-wasdforld", "hello-world"],
  maxAge: 365 * 24 * 60 * 60 * 1000
}));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get("/", (req, res)=> {
  if (req.session.user) {
    return res.redirect("/urls");
  }
  res.redirect("/login");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    //templateVars is importing urls to display in the url homepage for the user
    urls: urlDatabase,
    allowedUrls: urlsForUser(req.session.user),
    user : users[req.session.user]
  };
  
  //templateVars is importing urls to display in the url homepage for the user
  res.render("urls_index", templateVars);
});

app.get("/u/:id", (req, res) => {
  
  if (!checkValidUrl(req.params.id)) {
    res.send("Non-valid url id");
    return;
  }

  if (!req.session.visitorID) {
    req.session.visitorID = generateRandomString();
  }
  /* checks if the user have visited this site to keep track of the unique visitors
   * increases the total counter of times this shortened link was visited
   * then adds a time stamp for the shortened url which is stored in the urlDatabase
   */
  checkUniqueVisitor(req.params.id, req.session.visitorID);
  urlDatabase[req.params.id].timesVisited++;
  addTimeStamp(req.params.id, req.session.visitorID);
  
  const link = urlDatabase[req.params.id].longURL;
  res.redirect(link);
});

/* redirection for security
 * automatically redirects the user to login whenever they are not logged in
 * unless the websites are /login, /register/ or /urls
 */
app.use((req, res, next) => {

  const user = req.session.user;
  const whiteList = ["/login", "/register","/urls?", "/register?", "/login?"];

  if (user || whiteList.includes(req.url)) {
    //allows user to continue if they are whitelisted or signed in
    return next();
  }

  return res.redirect("/login");
});

app.get("/urls/new", (req, res) => {

  const templateVars = {user : users[req.session.user]};//importing cookie information to the header
  res.render("urls_new", templateVars);

});

app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("link does not exist");
    return;
  }
  if (!req.session.user) {
    res.status(401).send("you are not logged in");
    return;
  }
  if (urlDatabase[req.params.id].userID !== req.session.user) { //checks if the loggged user has permissions to alter the link
    res.status(401).send("you do not own the link");
    return;
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    visited: urlDatabase[req.params.id].timesVisited,
    uniqueVisitors: urlDatabase[req.params.id].uniqueVisitors,
    timesVisited: urlDatabase[req.params.id].visitorTime,
    user : users[req.session.user]
  };

  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const newID = addURL(req.session.user, req.body.longURL);

  res.redirect(`/urls/${newID}`);
});

app.delete("/urls/:id/delete", (req, res) => {
  const urlDelete = req.params.id;

  if (!req.session.user) {
    res.status(401).send("you are not logged in");
    return;
  }

  if (urlDatabase[req.params.id].userID !== req.session.user) {//checks if the user has permissions
    res.status(401).send("you do not own the link");
    return;
  }

  delete urlDatabase[urlDelete];
  return res.redirect('/urls');
});

app.put("/urls/:id/update", (req, res) => {

  const updatedURLID = req.params.id;
  urlDatabase[updatedURLID].longURL = req.body.URL;//updates the id of the shortened link to the new link
  res.redirect("/urls");

});

app.get("/login", (req,res) => {

  if (req.session.user) { //redirects the user if they are logged in already
    return res.redirect('/urls');
  }

  const templateVars = {user : users[req.session.user]};//sends user_id cookie information to the header to display user email information
  res.render('urls_login', templateVars);

});

app.post("/login", (req, res) => {
  
  if (!getUserByEmail(req.body.email)) {//checks if the email is in the database
    res.status(403).send("user with email cannot be found");
    return;
  }

  const userLogin = checkPassword(req.body.email, req.body.pass);//returns the user if the password matches the email else it will return false
  if (userLogin === false) {
    res.status(403).send("password does not match");
    return;
  }

  req.session.user = users[userLogin].id;
  res.redirect("/urls");

});

app.post("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/login");

});

app.get("/register", (req, res) => {

  if (req.session.user) {
    return res.redirect('/urls');
  }
  //redirects the user if they are logged in already

  const templateVars = {user : users[req.session.user]};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {

  if (req.body.pass === "" || req.body.email === "") {
    res.status(400).send("Email or password cannot be empty");
    return;
  }
  //user must enter in non-empty values for pass and email

  if (getUserByEmail(req.body.email)) {//cannot be duplicate email in the users dataset already
    res.status(400).send("Email is already signed up");
    return;
  }
  //cannot be duplicate email in the users dataset already

  const newUser = addUser(req.body.email, req.body.pass);
  req.session.user = newUser;//assigns a cookie using their id
  res.redirect("/urls");
  
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
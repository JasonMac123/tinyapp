const { urlDatabase, users} = require('../data/dataset');
const bcrypt = require("bcryptjs");

//generates a 6 digit random alphanumeric string
const generateRandomString = () => {
  let randomString = "";
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    let randomIndexGenerator = Math.floor(Math.random() * characterList.length);
    // generates an integer from 0-1 and multiples it by how many characters there are and floors the result
    randomString += characterList[randomIndexGenerator];
  }
  return randomString;
};
//checks if the email string value is within the user database for registered users
const getUserByEmail = (newEmail) => {
  for (const user in users) {
    if (users[user].email === newEmail)
      return user;
      // returns the user id if there is an email within the database
  }
  return undefined;
};

//checks if the password matches the email given in the database
const checkPassword = (newEmail, pass) => {
  const accountDetails = getUserByEmail(newEmail);
  if (!accountDetails) return false; // password cannot match if there is no email in database
  if (bcrypt.compareSync(pass, users[accountDetails].password)) {
    //checks if the password matches
    return accountDetails;
  }
  return false;
};
//generates an array of allowed link ids that match the user_id in the object database
const urlsForUser = function(id) {
  const urlArray = [];

  for (const urlID in urlDatabase) {
    if ((urlDatabase[urlID].userID) === id) {
      //checking the userID, if it matches the cookie id
      urlArray.push(urlID);
    }
  }
  return urlArray;
};

const addUser = (userEmail, userPassword) => {
  const newRandomID = generateRandomString(); //generates a new user ID
  users[newRandomID] = {
    id: newRandomID,
    email: userEmail,
    password: bcrypt.hashSync(userPassword, 10)
  };
  //adds new user
  return newRandomID;
};

const addURL = (user, url) => {
  const newRandomID = generateRandomString(); //generates a new user ID
  urlDatabase[newRandomID] = {
    longURL: url,
    userID: user,
    timesVisited: 0,
    uniqueVisitors: [],
    visitorTime: []
  };
  //adds new link
};

const checkUniqueVisitor = (urlID,visitor) => {
  if (!(urlDatabase[urlID].uniqueVisitors).includes(visitor)) {
    (urlDatabase[urlID].uniqueVisitors).push(visitor);
    /** checks if the visitor had clicked on this link before and adds them to *   the list if they haven't
    */
    return;
  }
  return;
};
/**  takes the current date and pushes the date and visitor ID to the url
 *   and adds its to the database;
 */
const addTimeStamp = (urlID, visitor) => {
  let currentDate = new Date().toJSON().slice(0, 10);
  const timeStamp = {
    time: currentDate,
    visitorID: visitor
  };
  urlDatabase[urlID].visitorTime.push(timeStamp);
  return;
};
// checks if the id as a valid shortened link in the database and returns the object
const checkValidUrl = (id) => {
  for (const url in urlDatabase) {
    if (url === id) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  checkPassword,
  urlsForUser,
  addUser,
  addURL,
  checkUniqueVisitor,
  addTimeStamp,
  checkValidUrl
};
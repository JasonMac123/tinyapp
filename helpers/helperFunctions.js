const { urlDatabase, users} = require('../data/dataset');

//generates a 6 digit random alphanumeric string
const generateRandomString = () => {
  let randomString = "";
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    let randomIndexGenerator = Math.floor(Math.random() * characterList.length); // generates an integer from 0-1 and multiples it by how many characters there are and floors the result
    randomString += characterList[randomIndexGenerator];
  }
  return randomString;
};
//checks if the email string value is within the user database for registered users
const checkEmail = (newEmail) => {
  for (const user in users) {
    if (users[user].email === newEmail)
      return true; //boolean result if there an email within the database
  }
  return false;
};

//checks if the password matches the email given in the database
const checkPassword = (newEmail, pass) => {
  for (const user in users) {
    if (users[user].email === newEmail) { //locates if the email matches
      if (users[user].password === pass) { //checks if the password matches
        return user; //returns the user id to be used
      }
      break; //breaks out of the loop as there are no duplicate emails within the database
    }
  }
  return false;
};
//generates an array of allowed link ids that match the user_id in the object database
const urlsForUser = function(id) {
  const urlArray = [];

  for (const urlID in urlDatabase) {
    if ((urlDatabase[urlID].userID) === id) { //checking the userID, if it matches the cookie id
      urlArray.push(urlID);
    }
  }
  return urlArray;
};

module.exports = {
  generateRandomString,
  checkEmail,
  checkPassword,
  urlsForUser
};
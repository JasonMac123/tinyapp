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
const checkEmail = (database, newEmail) => {
  for (const user in database) {
    if (database[user].email === newEmail)
      return true; //boolean result if there an email within the database
  }
  return false;
};

//checks if the password matches the email given in the database
const checkPassword = (database, newEmail, pass) => {
  for (const user in database) {
    if (database[user].email === newEmail) { //locates if the email matches
      if (database[user].password === pass) { //checks if the password matches
        return user; //returns the user id to be used
      }
      break; //breaks out of the loop as there are no duplicate emails within the database
    }
  }
  return false;
};

const urlsForUser = function(id,database) {
  const urlArray = [];
  for (const urlID in database) {
    if ((database[urlID].userID) === id) {
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
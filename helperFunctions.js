const generateRandomString = () => {
  let randomString = "";
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    let randomIndexGenerator = Math.floor(Math.random() * characterList.length);
    randomString += characterList[randomIndexGenerator];
  }
  return randomString;
};

const checkDuplicateEmail = (database, newEmail) => {
  for (const user in database) {
    if (database[user].email === newEmail)
      return true;
  }
  return false;
};

module.exports = {
  generateRandomString,
  checkDuplicateEmail
};
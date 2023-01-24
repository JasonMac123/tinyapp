const generateRandomString = () => {
  let randomString = "";
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    let randomIndexGenerator = Math.floor(Math.random() * characterList.length);
    randomString += characterList[randomIndexGenerator];
  }
  return randomString;
};

module.exports = {
  generateRandomString: generateRandomString
};
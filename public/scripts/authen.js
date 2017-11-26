const passphrase = "trumPet_sOng$-4_listenin'to";
const salt = "thIS_is-NOT";

function hash (password) {
 	var newPassword = password + salt;
  var token = "";
  for (var j=0; j<newPassword.length; j++) {
    var c1 = newPassword.charCodeAt(j);
    var c2 = passphrase.charCodeAt(j);
    var newChar = (c1 * c2 % 97) + 33;
    token += String.fromCharCode(newChar);
    // console.log(c1,c2, newChar, token);
  }
  return token;
}

console.log("password");
console.log(hash("password"));

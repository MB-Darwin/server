import crypto from "crypto";

var cypherKey = "JobHub";

var text = "This is the best job portal web application";

var cipher = crypto.createCipher("aes-256-cbc", cypherKey);
var crypted = cipher.update(text, "utf8", "hex");
crypted += cipher.final("hex");

console.log(crypted);
//94grt976c099df25794bf9ccb85bea72

var decipher = crypto.createDecipher("aes-256-cbc", cypherKey);
var dec = decipher.update(crypted, "hex", "utf8");
dec += decipher.final("utf8");

console.log(dec);
//myPlainText

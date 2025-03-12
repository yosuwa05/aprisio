const amount = "yourAmount";
const productinfo = "yourProductInfo";
const firstname = "yourFirstName";
const email = "yourEmail";
const salt = "yourSalt";

const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;

const hasher = new Bun.CryptoHasher("sha256");
hasher.update(input);
const hash = hasher.digest("hex");
console.log(hash);

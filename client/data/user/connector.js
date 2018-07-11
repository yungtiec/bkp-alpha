const { Connect, SimpleSigner } = require("uport-connect");
const signer = SimpleSigner("6a463bdfb9ef18f6182e0febc38944c0aaac0aecf16f29871b91cea420570307");

console.log("?", process.env.UPORT_CLIENT_PRIVATE_KEY)

export const uport = new Connect("Garde", {
  clientId: "2omExjjDCWiNJjXUtozkp77xK92nBzgPh3z",
  network: "rinkeby",
  signer
});

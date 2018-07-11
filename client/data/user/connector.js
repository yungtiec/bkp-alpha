const { Connect, SimpleSigner } = require("uport-connect");
const signer = SimpleSigner(process.env.UPORT_CLIENT_PRIVATE_KEY);

console.log(process.env)

export const uport = new Connect("Garde", {
  clientId: process.env.UPORT_CLIENT_ADDRESS,
  network: "rinkeby",
  signer
});

import uport from "uport";

if (
  !process.env.UPORT_CLIENT_PRIVATE_KEY ||
  !process.env.UPORT_CLIENT_ADDRESS
) {
  console.log("Uport client ID / secret not found. Skipping Uport OAuth.");
} else {
  const signer = uport.SimpleSigner(process.env.UPORT_CLIENT_PRIVATE_KEY);
  const endpoint =
    process.env.NODE_ENV === "production"
      ? "https://tbp-annotator.herokuapp.com/auth/uport"
      : "http://101d19a5.ngrok.io/auth/uport";
  const credentials = new uport.Credentials({
    appName: "Garde Network",
    address: process.env.UPORT_CLIENT_ADDRESS,
    signer
  });

  router.get("/", (req, res, next) => {
    credentials
      .createRequest({
        requested: ["name", "email", "phone", "address"],
        callbackUrl: `endpoint/${callback}`,
        exp: Math.floor(new Date().getTime() / 1000) + 300
      })
      .then(requestToken => {
        console.log(requestToken);
        const uri =
          "me.uport:me?requestToken=" + requestToken + "%26callback_type=post";
        const qrurl =
          "http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=" + uri;
        const mobileUrl =
          "https://id.uport.me/me?requestToken=" +
          requestToken +
          "&callback_type=post";
        console.log(uri);
        res.send({ uri, qrurl, mobileUrl });
      });
  });

  router.post("/callback", (req, res, next) => {
    const jwt = req.body.access_token;
    credentials.receive(jwt).then(creds => {
      if (creds.address == creds.verified[0].sub) {
        console.log("\n\nCredential verified.");
      } else {
        console.log("\n\nVerification failed.");
      }
    });
  });
}

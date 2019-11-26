const express = require("express");
const app = express();

require("dotenv").config();
const passport = require("passport");

const logger = require("./utils/logger");

// const { Issuer, generators } = require("openid-client");

const port = process.env.PORT;
const mainApp = process.env.APPLICATION_PATH;

app.use(express.static(mainApp));

// app.get("/login", function(req, res) {
app.get("/login", passport.authenticate("saml"), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/users/" + req.user.username);
    // (async () => {
    // const issuer = await Issuer.discover("https://connect.openathens.net");

    // const openAthensIssuer = new Issuer({
    //     issuer: process.env.AuthProviderURI,
    //     authorization_endpoint: process.env.AuthLoginEndPoint,
    //     token_endpoint: process.env.AuthTokenEndPoint,
    //     userinfo_endpoint: process.env.AuthUserInfoEndPoint,
    //     jwks_uri: process.env.AuthJWKSURI
    // });

    // console.log(openAthensIssuer);

    // return openAthensIssuer;
    // Issuer.discover(process.env.AuthProviderURI)
    //     .then(function(athensIssuer) {
    //         console.log("Login Result Path 123 ", athensIssuer.issuer);
    //         const client = new athensIssuer.Client({
    //             client_id: process.env.AuthClientID,
    //             client_secret: process.env.AuthClientsecret,
    //             redirect_uris: [process.env.AuthRedirectURL]
    //             // response_types: [process.env.AuthIdentityKey]
    //             // id_token_signed_response_alg (default "RS256")
    //             // token_endpoint_auth_method (default "client_secret_basic")
    //         });
    //         const code_verifier = generators.codeVerifier();

    //         const code_challenge = generators.codeChallenge(code_verifier);

    //         client.authorizationUrl({
    //             scope: "openid email profile",
    //             resource: process.env.AuthLoginEndPoint,
    //             code_challenge,
    //             code_challenge_method: "S256"
    //         });
    //         // const params = client.callbackParams(req);
    //         // client
    //         //     .callback("http://localhost:5003/callback", params, { code_verifier }) // => Promise
    //         //     .then(function(tokenSet) {
    //         //         console.log("received and validated tokens %j", tokenSet);
    //         //         console.log("validated ID Token claims %j", tokenSet.claims());
    //         //     });
    //         // console.log("CLIENT ", client, " .... ");
    //     })
    //     .catch(function(err) {
    //         console.log("FAIL ", err);
    //     });
    // const Client = issuer.Client;
    // console.log("Login Result Path 123");
    // })();
    console.log("Login Result Path");
    return res;
});

app.listen(port, () =>
    logger.log({
        level: "info",
        message: `Server running on Port ${port}`
    })
);

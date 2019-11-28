const express = require("express");
const app = express();

require("dotenv").config();
const passport = require("passport");

const logger = require("./utils/logger");

const port = process.env.PORT;
const mainApp = process.env.APPLICATION_PATH;

app.use(express.static(mainApp));

const session = require("express-session");

const OidcStrategy = require("passport-openidconnect").Strategy;
const baseAuthUrl = process.env.AUTH_PROVIDER_URI;

app.use(
    session({
        secret: "MyVoiceIsMyPassportVerifyMe",
        resave: false,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    "oidc",
    new OidcStrategy(
        {
            issuer: baseAuthUrl,
            authorizationURL: baseAuthUrl + "/oidc/auth",
            tokenURL: baseAuthUrl + "/oidc/token",
            userInfoURL: baseAuthUrl + "/oidc/userinfo",
            clientID: process.env.AUTH_CLIENT_ID,
            clientSecret: process.env.AUTH_CLIENT_SECRET,
            callbackURL: "http://localhost:5003/redirect"
        },
        (issuer, sub, profile, accessToken, refreshToken, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, next) => {
    next(null, user);
});

passport.deserializeUser((user, next) => {
    console.log(user._json.eduPersonTargetedID);
    next(null, user);
});

app.use("/login", passport.authenticate("oidc"));

app.use("/redirect", passport.authenticate("oidc", { failureRedirect: "/error" }), (req, res) => {
    res.redirect("/");
});

app.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

app.listen(port, () =>
    logger.log({
        level: "info",
        message: `Server running on Port ${port}`
    })
);

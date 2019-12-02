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

let loginRedirect = "/";

app.use(
    session({
        secret: process.env.SESSION_SECRET,
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
            callbackURL: process.env.CALLBACK_URL
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
    next(null, user);
});

app.use("/login", (req, res, next) => {
    const referer = req.headers.referer;
    let refererRoute = "/";
    if (referer) {
        let splitURL = referer.split("/");
        splitURL = splitURL.slice(3);
        refererRoute = splitURL.join("/");
        if (refererRoute) {
            loginRedirect = refererRoute;
        } else {
            loginRedirect = "/search";
        }
    } else {
        loginRedirect = "/search";
    }
    passport.authenticate("oidc")(req, res, next);
});

app.use("/redirect", passport.authenticate("oidc", { failureRedirect: "/error" }), (req, res) => {
    // res.redirect("/" + req.user._json.eduPersonTargetedID);
    res.redirect(loginRedirect);
});

app.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

app.get("/*", (req, res) => {
    res.sendFile("index.html", { root: process.env.APPLICATION_PATH }),
        err => {
            if (err) {
                res.status(500).send(err);
            }
        };
});

app.listen(port, () =>
    logger.log({
        level: "info",
        message: `Server running on Port ${port}`
    })
);

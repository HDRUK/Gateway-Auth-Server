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

const nodemailer = require("nodemailer");

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
            return done(null, { profile, accessToken });
        }
    )
);
const redirection = referer => {
    let refererRoute = "/";
    let splitURL = referer.split("/");
    splitURL = splitURL.slice(3);
    refererRoute = splitURL.join("/");
    if (refererRoute === "") {
        loginRedirect = "/search";
    } else {
        loginRedirect = refererRoute;
    }
};

passport.serializeUser((user, next) => {
    next(null, {
        id: user.profile._json.eduPersonTargetedID,
        email: user.profile._json.eduPersonScopedAffiliation,
        accessToken: user.accessToken
    });
});

passport.deserializeUser((user, next) => {
    next(null, user);
});

app.use("/login", (req, res, next) => {
    const referer = req.headers.referer || "/";
    redirection(referer);
    passport.authenticate("oidc")(req, res, next);
});

app.use("/redirect", passport.authenticate("oidc", { failureRedirect: "/error" }), (req, res) => {
    let id = "";
    let email = "";
    let token = "";
    if (req.session.passport && req.session.passport.user) {
        id = req.session.passport.user.id;
        email = req.session.passport.user.email;
        token = req.session.passport.user.accessToken;
    }
    res.redirect(`/logincallback?id=${id}&email=${email}&token=${token}&route=${loginRedirect}`);
});

app.get("/logout", (req, res) => {
    const referer = req.headers.referer || "/";
    redirection(referer);
    req.logout();
    req.session.destroy();
    res.redirect(`/logincallback?id=&email=&token=&route=${loginRedirect}`);
});

const transport = {
    host: "smtp.gmail.com",
    auth: {
        user: "katyellington40@gmail.com",
        pass: ""
    }
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("All works fine, congratz!");
    }
});
app.use(express.json());
app.post("/send", (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.messageHtml;

    const mail = {
        from: name,
        to: email,
        subject: "Contact form request",

        html: message
    };

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                msg: "fail"
            });
        } else {
            res.json({
                msg: "success"
            });
        }
    });
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

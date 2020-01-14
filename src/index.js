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
        loginRedirect = "/innovation";
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
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.NODE_ENV === "production" ? true : false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

var transporter = nodemailer.createTransport(transport);

transporter.verify(error => {
    if (error) {
        logger.log({
            level: "info",
            message: `Email server connection failed! - ${error}`
        });
        console.log(`Email server connection failed! - ${error}`);
    } else {
        logger.log({
            level: "info",
            message: `Email server connected!`
        });
        console.log("Email server connected!");
    }
});
app.use(express.json());

app.post("/send", (req, res) => {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const title = req.body.title;
    const message = req.body.messageHtml;
    const email = process.env.EMAIL;
    const receiptMessage = `<p>Thank you for enquiring about access to the ${title} dataset through the Health Data Research UK Innovation Gateway. The Data Custodian for this dataset has been notified and they will contact you directly in due course. </p><p>In order to facilitate the next stage of the request process, please make yourself aware of the technical data terminology used by the NHS Data Dictionary on the following link:</p><a href="https://www.datadictionary.nhs.uk/">https://www.datadictionary.nhs.uk/</a><p>Please reply to this email, if you would like to provide feedback to the Data Enquiry process facilitated by the Health Data Research Innovation Gateway - <a href="mailto:${email}">${email}</a></p>`;

    const mail = {
        from: sender,
        to: process.env.NODE_ENV === "production" ? recipient : process.env.RECIPIENT_EMAIL,
        subject: `Dataset Access Enquiry: ${title} dataset`,

        html: message
    };

    const receipt = {
        from: `${email}`,
        to: process.env.NODE_ENV === "production" ? sender : process.env.RECIPIENT_EMAIL,
        subject: `Health Data Research Innovation Gateway - Data Enquiry Sent: ${title} dataset`,

        html: receiptMessage
    };
    // req.session.passport && req.session.passport.user && (receipt.name = req.session.passport.user.email);

    transporter.sendMail(mail, err => {
        if (err) {
            res.json({
                msg: `fail: + ${err}`
            });
        } else {
            transporter.sendMail(receipt, err => {
                if (err) {
                    res.json({
                        msg: `fail: + ${err}`
                    });
                } else {
                    res.json({
                        msg: "success"
                    });
                }
            });
        }
    });
});

app.get("/*", (req, res) => {
    res.cookie("sessionID", req.sessionID);
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

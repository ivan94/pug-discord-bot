import express from "express";
import passport from "passport";
import https from "https";
import fs from "fs";
import { Strategy } from "passport-bnet";
import { MongoClient, Db } from "mongodb";

const app = express();
const port = 3000;

var client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});
var db:Db = null;
client.connect().then(() => {
    console.log("Connected successfully to mongodb server");

    db = client.db("pug-bot")
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new Strategy({
    clientID: "6925477f30d7439cbd2deb27e198a0ed",
    clientSecret: "QPC1BlHUTvym5ifZ35olCaXOvybwmlsE",
    callbackURL: "https://localhost:3000/auth/bnet/callback",
    region: "us"
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}

app.get('/', (req, res) => {
    console.log(req.session);
    if(req.session.passport) {
        res.send(`Hello ${req.session.passport.user.battletag}!`)
    } else {
        res.send('Hello World!');
    }
})
app.get('/auth/bnet', passport.authenticate('bnet'));
app.get('/auth/bnet/callback', passport.authenticate('bnet', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/battletag/save');
});

app.get('/battletag/save', (req, res) => {
    if (req.session.passport) {
        const collection = db.collection("documents");
        collection.insertOne({user: "ivan", battletag: req.session.passport.user.battletag});
        res.send("Battletag saved");
    } else {
        res.send('Not authenticated');
    }
});

app.get('/battletag/get', (req, res) => {
        const collection = db.collection("documents");
        collection.findOne({user: "ivan"}).then(doc => res.send(`Your battletag is ${doc.battletag}`));
});


const server = https.createServer(httpsOptions, app).listen(port, () => {
    console.log('Server running at ' + port)
})
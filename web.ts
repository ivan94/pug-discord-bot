import express from "express";
import passport from "passport";
import https from "https";
import fs from "fs";
import { Strategy } from "passport-bnet";
import { MongoClient, Db } from "mongodb";
import { config } from "dotenv";

config();

const app = express();
const port = 3000;

var client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true});
var db:Db = null;
client.connect().then(() => {
    console.log("Connected successfully to mongodb server");

    db = client.db(process.env.MONGO_DB)
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
    clientID: process.env.BNET_CLIENT_ID,
    clientSecret: process.env.BNET_CLIENT_SECRET,
    callbackURL: process.env.SERVER_URL+"/auth/bnet/callback",
    region: process.env.BNET_REGION
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
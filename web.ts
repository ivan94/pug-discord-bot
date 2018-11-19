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
app.get('/auth', (req, res) => {
    var { discord_id, token, platform} = req.query;

    if (!discord_id || !token || !platform) {
        res.status(404);
        return;
    }

    let users = db.collection('users');
    users.findOne({ discord_id: discord_id}).then(doc => {
        if(!doc || doc.token != token) {
            res.status(404);
            return;
        }

        req.session.discord_id = discord_id;

        switch (platform) {
            case "bnet":
                res.redirect('/auth/bnet');
                break;
        
            default:
                res.status(404);
                break;
        }
    });

});
app.get('/auth/bnet', passport.authenticate('bnet'));
app.get('/auth/bnet/callback', passport.authenticate('bnet', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/bnet/save');
});

app.get('/bnet/save', (req, res) => {
    if (req.session.passport) {
        const users = db.collection("users");
        users.updateOne({ discord_id: req.session.discord_id }, { $set: { battletag: req.session.passport.user.battletag, platform: 'bnet', registered: true }});
        res.send("Battletag registered");
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
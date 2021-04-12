const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const opinionRouter = require('./routes/OpinionRouter');
const mapRouter = require('./routes/mapRouter');
const promiseRouter = require('./routes/promiseRouter');
const authRouter = require('./routes/authRouter');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { user } = require('./models')

app.use(session({ secret: 'SECRET_CODE', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:5000/auth/google/redirect"
  },
  (accessToken, refreshToken, profile, cb) => {
    user.findOne({
      where: {
        googleId: profile.id
      }
    })
    .then(currentUser => {
      if (currentUser) {
        return cb(null, accessToken);
      } else {
        user.create({
          googleId: profile.id
        })
        .then(createdUser => {
          if (createdUser) return cb(null, accessToken);
        })
        .catch(err => {
          if (err) console.log(err)
        })
      }
    })
    .catch(err => {
      if (err) console.log(err)
    })
  }
));

passport.serializeUser((accessToken, done) => {
  done(null, accessToken);
});
passport.deserializeUser((accessToken, done) => {
  // console.log('deserializedUser', user)
  done(null, accessToken);
});

app.use(cors());
app.use('/', opinionRouter);
app.use('/map', mapRouter);
app.use('/promises', promiseRouter);
app.use('/auth', authRouter)

app.listen(port, () => {
    console.log(`server is starting on ${port}`)
})
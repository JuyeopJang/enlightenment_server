const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const opinionRouter = require('./routes/opinionRouter');
const mapRouter = require('./routes/mapRouter');
const promiseRouter = require('./routes/promiseRouter');
const authRouter = require('./routes/authRouter');
const magazineRouter = require('./routes/magazineRouter');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { user } = require('./models');
// const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
dotenv.config();

// app.use(methodOverride('X-HTTP-Method-Override', {
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
// }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({ 
  secret: 'SECRET_CODE', 
  resave: false, 
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:5000/auth/google/login"
  },
  (accessToken, refreshToken, profile, cb) => {
    user.findOne({
      where: {
        googleId: profile.id
      }
    })
    .then(currentUser => {
      if (currentUser) {
        return cb(null, {
          accessToken,
          userId: currentUser.dataValues.id
        });
      } else {
        user.create({
          googleId: profile.id
        })
        .then(createdUser => {
          if (createdUser) return cb(null, {
            accessToken,
            userId: createdUser.dataValues.id
          });
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

passport.serializeUser((userInfo, done) => {
  console.log('serial ', userInfo)
  done(null, userInfo);
});
passport.deserializeUser((userInfo, done) => {
  console.log('deserial ', userInfo)
  done(null, userInfo);
});

app.use(bodyParser.json())
app.use('/', opinionRouter);
app.use('/map', mapRouter);
app.use('/promises', promiseRouter);
app.use('/auth', authRouter);
app.use('/magazines', magazineRouter);

app.listen(port, () => {
  console.log(`server is starting on ${port}`)
})
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const opinionRouter = require('./routes/opinionRouter');
const authRouter = require('./routes/authRouter');
const magazineRouter = require('./routes/magazineRouter');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { user } = require('./models');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const ec2Url = 'http://ec2-3-34-52-239.ap-northeast-2.compute.amazonaws.com:5000'
dotenv.config();
app.use(cors({
  origin: ['http://localhost:3000', 'http://www.kelection.ml'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));
app.use(cookieParser());
app.use(session({ 
  secret: 'SECRET_CODE', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    sameSite: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://www.kelection.ml/auth/google/login"
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
          userId: currentUser.dataValues.id,
          photo: currentUser.dataValues.photo,
          email: currentUser.dataValues.email
        });
      } else {
        user.create({
          googleId: profile.id,
          photo: profile.photos[0].value,
          email: profile.emails[0].value
        })
        .then(createdUser => {
          if (createdUser) return cb(null, {
            accessToken,
            userId: createdUser.dataValues.id,
            photo: createdUser.dataValues.photo,
            email: createdUser.dataValues.email
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
  // console.log('serial ', userInfo)
  done(null, userInfo);
});
passport.deserializeUser((userInfo, done) => {
  // console.log('deserial ', userInfo)
  done(null, userInfo);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use('/', opinionRouter);
app.use('/magazines', magazineRouter);

app.listen(port, () => {
  console.log(`server is starting on ${port}`)
})
// const FacebookStrategy = require("passport-facebook").Strategy;
import { Strategy as FacebookStrategy } from "passport-facebook";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { Strategy as LinkedInStrategy } from "passport-linkedin";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model";

const passportJWT = require("passport-jwt");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
// const User = require("../models/user.model");

const authConfig = require("../config/authConfig");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          User.findOne({ "local.email": email }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, false);

            const newUser = new User();

            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            newUser.save(error => {
              if (error) throw error;
              return done(null, user);
            });
          });
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        User.findOne({ "local.email": email }, (err, user) => {
          if (err) return done(err);
          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "No user found")
            );
          }

          if (!user.validatePassword(password)) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Invalid Password")
            );
          }
          return done(null, user);
        });
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: authConfig.facebookAuth.appId,
        clientSecret: authConfig.facebookAuth.appSecret,
        callbackURL: authConfig.facebookAuth.callbackUrl,
        enableProof: true,
        profileFields: ["id", "name", "email"]
      },
      (token, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({ "facebook.id": profile.id }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);

            const newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = `${profile.name.givenName} ${
              profile.name.familyName
            }`;

            newUser.facebook.email = profile.emails
              ? profile.emails[0].value
              : "";

            newUser.name = `${profile.name.givenName} ${
              profile.name.familyName
            }`;
            newUser.primaryEmail = profile.emails
              ? profile.emails[0].value
              : "";

            User.create(newUser, (error, data) => {
              if (error) throw err;
              return done(null, data);
            });
          });
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: authConfig.googleAuth.clientId,
        clientSecret: authConfig.googleAuth.clientSecret,
        callbackURL: authConfig.googleAuth.callbackUrl
      },
      (token, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({ "google.id": profile.id }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);

            const newUser = new User();

            // set all of the relevant information
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email
            newUser.name = profile.displayName;
            newUser.primaryEmail = profile.emails[0].value;

            // save the user
            newUser.save(error => {
              if (error) throw error;
              return done(null, newUser);
            });
          });
        });
      }
    )
  );

  passport.use(
    new LinkedInStrategy(
      {
        consumerKey: authConfig.linkedinAuth.clientId,
        consumerSecret: authConfig.linkedinAuth.clientSecret,
        callbackURL: authConfig.linkedinAuth.callbackUrl,
        profileFields: [
          "id",
          "first-name",
          "last-name",
          "email-address",
          "headline"
        ]
      },
      (token, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({ "linkedin.id": profile.id }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);

            const newUser = new User();

            newUser.linkedin.id = profile.id;
            newUser.linkedin.token = token;
            newUser.linkedin.name = profile.displayName;
            newUser.linkedin.email = profile.emails[0].value;
            newUser.name = profile.displayName;
            newUser.primaryEmail = profile.emails[0].value;

            newUser.save(error => {
              if (error) throw error;
              return done(null, newUser);
            });
          });
        });
      }
    )
  );

  // https://github.com/themikenicholson/passport-jwt
  const JWTOptions = {};
  JWTOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
  JWTOptions.secretOrKey = "prezuranew456#123";
  passport.use(
    new JWTStrategy(JWTOptions, (JWTPayload, done) => {
      User.findById(JWTPayload.id, (error, user) => {
        if (error) return done(null, false);
        if (user) return done(null, user);
        return done(null, false);
      });
    })
  );
};

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";


const app = express();

const DB_URL = 'mongodb+srv://backend:wp3pY3V896VQxtfp@ecommerce.zhcscvh.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce';

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sesión MongoD (DB)
app.use(session({
  store: new MongoStore({
    mongoUrl: DB_URL,
    ttl: 3600
  }),
  secret: "Secret",
  resave: false,
  saveUninitialized: false
}));

//Init Passport 
app.use(passport.initialize())
app.use(passport.session())

export default app;
import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";
import CartsManager from "../dao/services/cartManager.js";
import GitHubStrategy from "passport-github2";
import { Types } from 'mongoose';

const { ObjectId } = Types;

const LocalStrategy = local.Strategy;

const cartsManager = new CartsManager();

const admin = { username: 'adminCoder@coder.com', password: 'adminCod3r123' };

//Inicializar Passport
const initializePassport = () => {

  // Estrategia de registro de usuarios
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false); // Usuario ya existe
          }
          const cart = await cartsManager.createCart();
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user",
            cart,
          };

          const result = await userModel.create(newUser);
          return done(null, result); // Usuario registrado con éxito
        } catch (error) {
          return done(error); // Error al registrar usuario
        }
      }
    )
  );

  // Estrategia de inicio de sesión local
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userModel.findOne({ email: username });
          if ((username === admin.username && password === admin.password) && (!user)) {
            user = {
              _id: new ObjectId(),
              first_name: "Administrador",
              last_name: "",
              email: username,
              age: "",
              password,
              role: "admin"
            };
            return done(null, user); // Inicio de sesión como administrador
          } else if (!user) {
            return done(null, false); // Usuario no encontrado
          }

          const valid = isValidPassword(user, password);
          if (!valid) {
            return done(null, false); // Contraseña incorrecta
          }

          return done(null, user); // Inicio de sesión exitoso
        } catch (error) {
          return done(error); // Error al iniciar sesión
        }
      }
    )
  );

  // Estrategia de autenticación con GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.b801b07872d3fca4",
        clientSecret: "435c40e7a171df659e391ed106a3a6c588ab9e6c",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({email: profile._json.email});

          if (!user) {
            const cart = await cartsManager.createCart();
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 20,
              email: profile._json.email,
              password: "", 
              role: "user",
              cart,
            };
            await userModel.create(newUser);
            user = await userModel.findOne({email: profile._json.email});
            done(null, user);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialización y deserialización de usuario
  passport.serializeUser((user, done) => {
    done(null, user._id); // Serializar usuario
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
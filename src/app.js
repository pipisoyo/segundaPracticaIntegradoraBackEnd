//import localRouterProducts from "./routes/localProductsRoute.js";
//import localCartsRoute from "./routes/localCartsRoute.js";
import express from "express";
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";
import initilizePassport from "./config/passport.config.js";
import middlewares from './config/middlewares.js';
import { app } from './config/server.js';
import { productsRouter, cartsRoutes, sessionsRouter, viewesRoutes } from './routes/routes.js'
import initSocket from './socket.js';
import realTimeProducts from "./routes/realTimeProductsRoute.js";

//Middlewares
app.use(middlewares);

//Rutes
app.use("/api/realtimeproducts", realTimeProducts);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRoutes);
app.use("/api/sessions", sessionsRouter);
app.use(viewesRoutes);
//app.use("/api/products/", localRouterProducts);
//app.use("/api/carts/", localCartsRoute);

//Handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');

//Passport - autenticación
initilizePassport();

//soket (realtime)
initSocket();


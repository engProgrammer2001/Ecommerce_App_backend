import AdminJs from "adminjs";
import AdminJsExpress from "@adminjs/express";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Category from "../models/category.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import * as AdminJsMongoose from "@adminjs/mongoose";
import { dark, light, noSidebar } from "@adminjs/themes";

import dotenv from "dotenv";
dotenv.config();

AdminJs.registerAdapter(AdminJsMongoose);

const DEFAULT_ADMIN = {
  email: "ashok@gmail.com",
  password: "Ashok123",
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return false;
};

export const buildAdminJs = async (app) => {
  const admin = new AdminJs({
    resources: [
      { resource: Product },
      { resource: Category },
      { resource: User },
      { resource: Order },
      { resource: Transaction },
    ],
    branding: {
      companyName: "AshokShoppingMall",
      withMadeWithLove: false,
      favicon:
        "https://img.freepik.com/free-vector/gradient-mobile-store-logo-design_23-2149699842.jpg?semt=ais_hybrid&w=740",
      logo: "https://img.freepik.com/premium-vector/online-shop-logo-with-smartphone-shopping-bags_569491-712.jpg?semt=ais_hybrid&w=740",
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    rootPath: "/admin",
  });

  const MongoDBStore = ConnectMongoDBSession(session);
  const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_DB_URL,
    collection: "sessions",
  });

  const adminRouter = AdminJsExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: process.env.COOKIE_PASSWORD,
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: process.env.COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
      name: "adminjs",
    }
  );

  app.use(admin.options.rootPath, adminRouter);
};

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DbConnection from "./src/config/db.js";
import { fileURLToPath } from "url";
import path from "path";
import userRoutes from "./src/routes/user.route.js";
import categoryRoutes from "./src/routes/category.route.js";
import productRoutes from "./src/routes/product.route.js";
import orderRoutes from "./src/routes/order.route.js";
import cartRoutes from "./src/routes/cart.route.js";
import { buildAdminJs } from "./src/config/setup.js";
import { isAuthenticated } from "./src/middlerware/isAuthenticated.js";
const app = express();
dotenv.config();
DbConnection();
await buildAdminJs(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("", express.static(path.join(__dirname, "")));

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/view/index.html");
});

app.use("/api/users", userRoutes);
app.use("/api/category", isAuthenticated, categoryRoutes);
app.use("/api/product", isAuthenticated, productRoutes);
app.use("/api/order", isAuthenticated, orderRoutes);
app.use("/api/cart", isAuthenticated, cartRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}/admin`);
});

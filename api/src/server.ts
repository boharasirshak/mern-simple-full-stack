//built in imports
import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json } from "express";

// local imports
import "./db/connect.js";
import errorHandler from "./middleware/errorHandler.js";
import AuthRoute from "./router/auth.js";
import UserRoute from "./router/user.js";

const app = express();

app.use(json());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_BASE_URL as string],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the server",
  });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware Configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from './routes/user.routes.js';
import listingRouter from './routes/listing.routes.js'; 

// routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter); 
app.use("/api/v1/listings", listingRouter);

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);
export { app };
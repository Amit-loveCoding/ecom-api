import express from "express";
import swagger from "swagger-ui-express";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";

import apiDocs from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";

const server = express();

server.use(express.json());

// Serve Swagger API documentation
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

// Logging middleware for incoming requests
server.use(loggerMiddleware);

// Route handlers
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/cartItems", jwtAuth, cartRouter);
server.use("/api/users", userRouter);

// Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

// Middleware to handle 404 requests
server.use((req, res) => {
  res.status(404).send("API not found");
});

// Error handler middleware (should be placed last)
server.use((err, req, res, next) => {
  console.error(err); // Log the error
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }

  //server errors
  res.status(500).send("Something went wrong, Please try it later!!");
});

// Specify port
const PORT = 3200;
server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

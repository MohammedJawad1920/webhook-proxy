import { config } from "./config/env";
import express from "express";
import pinoHttp from "pino-http";
import crypto from "crypto";
import pino from "pino";

const app = express();

// Middleware
app.use(express.json());
app.use(
  pinoHttp({
    genReqId: (req) => crypto.randomUUID(),
  }),
);

// Routes
app.post("/api/webhooks/:webhookId", (req, res) => {
  req.log.info(
    {
      webhookId: req.params.webhookId,
    },
    "Webhook received",
  );
  const webhookId = req.params.webhookId;
  const requestId = req.id;
  const timestamp = new Date().toISOString();
  return res.status(202).json({
    status: "accepted",
    webhookId,
    requestId,
    timestamp,
  });
});

const logger = pino();
app.listen(config.PORT, () => {
  logger.info({ port: config.PORT }, "Server started");
});

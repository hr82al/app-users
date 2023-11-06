"use strict"
const express = require('express');
const { prisma } = require('./prisma-db');

const HISTORY_HOST = "http://localhost:3001"

const app = express();

app.use(express.json());

async function saveHistory(userId, action, newValue) {
  const result = await (await fetch(`${HISTORY_HOST}/api/v1/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      action,
      newValue,
    }),
  })).json();
  if (!("userId" in result && "action" in result && "newValue" in result)) {
    throw new Error("Filed to save history: " + JSON.stringify(result));
  }
}

// Create user
app.post("/api/v1/users", async (req, res) => {
  try {
    if ("name" in req.body) {
      await saveHistory(+req.body.id, "CREATE", req.body.name);
      const result = await prisma.user.create({ data: {
        id: req.body.id,
        name: req.body.name,
      }});
      res.json(result);
    } else {
      res.status(500).send(
        "Error wrong parameters: " + JSON.stringify(req.body)
      );
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


// Get users list
app.get("/api/v1/users", async (req, res) => {
  try {
      const result = await prisma.user.findMany();
      res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});


// Modify user
app.put("/api/v1/users", async (req, res) => {
  try {
    if ("id" in req.body && "name" in req.body) {
      await saveHistory(+req.body.id, "CREATE", req.body.name);
      const result = await prisma.user.update({
        where: {
          id: req.body.id,
        },
        data: {
          name: req.body.name,
        }
      });
      res.json(result);
    } else {
      res.status(500).send(
        "Error wrong parameters: " + JSON.stringify(req.body)
      );
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = app;

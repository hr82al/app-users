"use strict"
const express = require('express');
const { prisma } = require('./prisma-db');

const TMP_HISTORY_HOST = process.env.HISTORY_HOST ?? "localhost";

const HISTORY_HOST = `http://${TMP_HISTORY_HOST}:3001`
console.log(HISTORY_HOST);
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
      const result = await prisma.user.create({ data: {
        id: req.body.id,
        name: req.body.name,
      }});
      await saveHistory(+result.id, "CREATE", result.name);
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
      const result = await prisma.user.update({
        where: {
          id: req.body.id,
        },
        data: {
          name: req.body.name,
        }
      });
      await saveHistory(+result.id, "UPDATE", result.name);
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

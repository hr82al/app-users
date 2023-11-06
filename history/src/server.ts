import express from 'express';
import { prisma } from './prisma-db.js';
import { Action } from '@prisma/client';

const app = express();
const PORT = 3001;
const DEFAULT_PAGE_SIZE = 20;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("ok");
});


app.post('/api/v1/history', async (req, res) => {
  try {
    if ("action" in req.body && "userId" in req.body && "newValue" in req.body) {
    const result = await prisma.history.create({ data: {
      action: req.body.action as Action,
      userId: +req.body.userId,
      newValue: req.body.newValue,
    }});
    res.json(result);
  } else {
    res.status(400).send(`Wrong format ${JSON.stringify(req.body)}. Need {userId: number, action: "CREATE" | "UPDATE", newValue: "new value"}`)
  }
  } catch (err) {
    res.status(500).json(err);
  }
});


app.get('/api/v1/history', async (req, res) => {
  try {
    const result = await prisma.history.findMany();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


async function getPageByID(id: number, page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE) {
  const result = await prisma.history.findMany({
    where: {
      userId: id,
    },
    take: pageSize,
    skip: ((page - 1) * pageSize),
  });
  return result;
}


app.get('/api/v1/history/:id/:page/:pageSize',async (req, res) => {
  try {
    const result = await getPageByID(+req.params.id, +req.params.page, +req.params.pageSize);
    res.json(result);
  } catch(err) {
    res.status(500).json(err);
  }
});


app.get('/api/v1/history/:id/:page',async (req, res) => {
  try {
    const result = await getPageByID(+req.params.id, +req.params.page);
    res.json(result);
  } catch(err) {
    res.status(500).json(err);
  }
});


app.get('/api/v1/history/:id',async (req, res) => {
  try {
    const result = await getPageByID(+req.params.id);
    res.json(result);
  } catch(err) {
    res.status(500).json(err);
  }
});


app.listen(PORT, () => {
  console.log("History server started");
});
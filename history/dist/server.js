var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { prisma } from './prisma-db.js';
const app = express();
const PORT = 3001;
const DEFAULT_PAGE_SIZE = 20;
app.use(express.json());
app.get('/', (req, res) => {
    res.send("ok");
});
app.post('/api/v1/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ("action" in req.body && "userId" in req.body && "newValue" in req.body) {
            const result = yield prisma.history.create({ data: {
                    action: req.body.action,
                    userId: +req.body.userId,
                    newValue: req.body.newValue,
                } });
            res.json(result);
        }
        else {
            res.status(400).send(`Wrong format ${JSON.stringify(req.body)}. Need {userId: number, action: "CREATE" | "UPDATE", newValue: "new value"}`);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
app.get('/api/v1/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.history.findMany();
        res.json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
function getPageByID(id, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.history.findMany({
            where: {
                userId: id,
            },
            take: pageSize,
            skip: ((page - 1) * pageSize),
        });
        return result;
    });
}
app.get('/api/v1/history/:id/:page/:pageSize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield getPageByID(+req.params.id, +req.params.page, +req.params.pageSize);
        res.json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
app.get('/api/v1/history/:id/:page', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield getPageByID(+req.params.id, +req.params.page);
        res.json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
app.get('/api/v1/history/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield getPageByID(+req.params.id);
        res.json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
app.listen(PORT, () => {
    console.log("History server started");
});

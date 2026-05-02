import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import indexRouter from '../routes/index.routes.js';

//SETTINGS
const app = express();
app.set("port", 3000);

//MIDDLEWARES
app.use (morgan("dev"));
app.use (json());
app.use (
    cors({
        "origin": "*"
    })
);
app.use(helmet());


//ROUTES

app.get("/", (req, res) => {
    res.status(200).send({
        msg: "Server running :)"
    });
});

app.get("/module/:variable", (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.status(200).send({
        msg: "Server running :)"
    });
});
app.use("/api", indexRouter);


export default app;
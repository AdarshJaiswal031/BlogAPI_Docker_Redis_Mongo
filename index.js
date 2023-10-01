const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const redis = require("redis")
const connectRedis = require("connect-redis");
const cors = require("cors")
const RedisStore = connectRedis(session);
// const RedisStore = new connectRedis(session)

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    SESSION_SECRET,
    REDIS_URL,
    REDIS_PORT
} = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const port = process.env.PORT || 3000;
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/admin?authSource=admin`;
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

app.use(express.json());

const connectWithRetry = () => {
    mongoose
        .connect(MONGO_URL)
        .then(() => console.log("successfully connected to database"))
        .catch((e) => {
            console.log("error");
            setTimeout(connectWithRetry, 5000);
        });
};
connectWithRetry();

app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000
    }
}))
app.get("/api/v1", (req, res) => {
    res.send("<h1>Thank you god for 1M subscribers!! Thanks for 11pj - Thank You God Yay</h1>");
    console.log("thank you god")
});
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.listen(port, () => console.log(`listening on port ${port}`));

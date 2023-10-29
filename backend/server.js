const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserData = require("./model/infomodel");
const Message = require("./model/messages");
const redis = require("redis");
const PORT = process.env.POTRT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
let client;

(async () => {
  client = redis.createClient({
    socket: {
      port: 6379,
      host: "redis-service",
    },
  });
  client.on("error", (error) => console.error(`Error : ${error}`));
  client.on("connect", () => console.log("Redis connected"));
  await client.connect();
})();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// cheaking root api
app.get("/", (req, res) => {
  res.json({ message: "that is the root folder and now update " });
});

// for all the users information about
async function getAllUser(req, res) {
  console.log("request get for all users");
  try {
    const users = await UserData.find({});
    client.setEx(
      "all user data",
      3000,
      JSON.stringify("{'message':'this is from cahce'}\n\n\n" + users)
    );
    res.status(200).json(users);
  } catch (error) {
    console.log("Show  the error message for get method");
    res.send(500).json({ message: error.message });
  }
}

async function getAllMessages(req, res) {
  console.log("Request for all messages");
  const chatId = req.params.chatId;
  try {
    const messages = await Message.find(
      { [`chatId.${chatId}`]: { $exists: true } },
      { _id: 0, [`chatId.${chatId}`]: 1 }
    )
      .sort({ [`chatId.${chatId}.timestampMessage`]: -1 })
      .exec();

    // Update the cache with the retrieved messages
    client.setEx(
      chatId,
      3000,
      JSON.stringify({ message: "this is from cache", messages })
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error when retrieving messages");
    res.status(500).json({ message: error.message });
  }
}

// for cacheing database
async function cheakchache(req, res, next) {
  try {
    // const id = req.params.id;
    const id = "all user data";
    const data = await client.get(id);
    if (data !== null) {
      console.log("data from cache");
      res.status(200).json(data);
    } else {
      next();
    }
  } catch (error) {
    console.log(`Redis function ${error}`);
  }
}

async function checkCacheMessages(req, res, next) {
  try {
    const id = req.params.chatId;

    const data = await client.get(id);
    if (data !== null) {
      console.log("Data from cache");
      res.status(200).json(JSON.parse(data)); // Send cached data
    } else {
      next(); // If data is not in the cache, proceed to getAllMessages
    }
  } catch (error) {
    console.log(`Redis function ${error}`);
  }
}

// sent user infromation to database
app.post("/user", async (req, res) => {
  console.log("request sent");
  try {
    const user = await UserData.create(req.body);
    client.del("all user data");
    res.status(200).json(user);
  } catch (error) {
    console.log("Show  the error message posh method");
    res.send(500).json({ message: error.message });
  }
});

app.post("/message", async (req, res) => {
  console.log("message sent", req.body);
  try {
    const message = await Message.create({
      chatId: req.body,
    });

    client.del(Object.keys(req.body)[0]);
    res.status(200).json(message);
  } catch (error) {
    console.log("🚀 ~ file: server.js:134 ~ app.post ~ error:", error);
    console.log("Show  the error message posh method");
    res.send(500).json({ message: error.message });
    return;
  }
});

// cheak user infromation to database and cache
// if not in cache then store and return
// otherwise return data from cache
app.get("/user", cheakchache, getAllUser);

app.get("/message/:chatId", checkCacheMessages, getAllMessages);

mongoose
  .connect(
    "mongodb+srv://mridul:mridul1290@cluster0.nqmjboq.mongodb.net/node-api?retryWrites=true&w=majority"
  )
  .then((e) => {
    console.log("Connected  mongo database");
    console.log("---------------{$e}" + e);
    app.listen(PORT, () => {
      console.log("node js application running on part 3000");
    });
  })
  .catch((e) => {
    console.log("Error connecting");
    console.log(e);
  });

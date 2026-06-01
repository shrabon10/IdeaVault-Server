const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const { jwtVerify, createRemoteJWKSet } = require("jose-cjs");

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("IdeaVault Server Running");
});

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No Token Found",
      });
    }

    const { payload } = await jwtVerify(token, JWKS);

    req.user = payload;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

async function run() {
  try {
    // await client.connect();

    console.log("MongoDB Connected Successfully");

    const db = client.db("IdeaVault");

    const ideaColl = db.collection("Ideas");
    const commentsColl = db.collection("Comments");
    const categoriesColl = db.collection("Categories");

    app.get("/categories", async (req, res) => {
      const result = await categoriesColl.find().toArray();
      res.send(result);
    });

    app.get("/popularCategories", async (req, res) => {
      const result = await categoriesColl.find().limit(6).toArray();

      res.send(result);
    });

    app.get("/trendingIdeas", async (req, res) => {
      const result = await ideaColl.find().limit(6).toArray();

      res.send(result);
    });


    app.get("/ideas", async (req, res) => {
      const result = await ideaColl.find().toArray();

      res.send(result);
    });

    app.get("/idea/:id", verifyToken, async (req, res) => {
      const { id } = req.params;

      const result = await ideaColl.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    app.get("/searchedIdeas", async (req, res) => {
      const searchData = req.query.search;

      const result = await ideaColl
        .find({
          $or: [
            {
              name: {
                $regex: searchData,
                $options: "i",
              },
            },
            {
              category: {
                $regex: searchData,
                $options: "i",
              },
            },
          ],
        })
        .toArray();

      res.send(result);
    });

    app.get("/comments", async (req, res) => {
      const result = await commentsColl.find().toArray();

      res.send(result);
    });
    app.post("/idea", async (req, res) => {
      const ideaData = req.body;

      const result = await ideaColl.insertOne(ideaData);

      res.send(result);
    });

    app.post("/comment", async (req, res) => {
      const commentData = req.body;

      const result = await commentsColl.insertOne(commentData);

      res.send(result);
    });



    // PATCH APIs

    app.patch("/idea/:id", async (req, res) => {
      const { id } = req.params;

      const updatedData = req.body;

      const result = await ideaColl.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedData,
        },
      );

      res.send(result);
    });

    app.patch("/comment/:id", async (req, res) => {
      const { id } = req.params;

      const updatedData = req.body;

      const result = await commentsColl.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedData,
        },
      );

      res.send(result);
    });
        app.delete("/idea/:id", async (req, res) => {
      const { id } = req.params;

      const result = await ideaColl.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    app.delete("/comment/:id", async (req, res) => {
      const { id } = req.params;

      const result = await commentsColl.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

  } catch (error) {
    console.log(error);
  }
}

run();

app.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
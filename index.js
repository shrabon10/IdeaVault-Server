const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { jwtVerify, createRemoteJWKSet } = require("jose-cjs");
const uri = process.env.MONGODB_URI;

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());



const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);

app.get("/", (req, res) => {
  res.send("Welcome to IdeaVault server");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);

    next();
  } catch (err) {
    console.error("Token validation failed:", err);
  }
};

async function run() {
  try {
    const db = client.db("IdeaVault");
    const ideaColl = await db.collection("Ideas");
    const commentsColl = await db.collection("Comments");
    const categoriesColl = await db.collection("Categories");

    // All get here

    app.get("/categories", async (req, res) => {
      const allCategories = await categoriesColl.find().toArray();
      res.json(allCategories);
    });

    app.get("/trendingIdeas", async (req, res) => {
      const allFeaturedIdeas = await ideaColl.find().limit(6).toArray();
      res.json(allFeaturedIdeas);
    });
    app.get("/ideas", async (req, res) => {
      const allIdeas = await ideaColl.find().toArray();
      res.json(allIdeas);
    });
    app.get("/idea/:id", verifyToken, async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await ideaColl.findOne(query);
      res.json(result);
    });
    app.get("/searchedIdeas", async (req, res) => {
      const searchData = req.query.search;
      const searchedIdeas = await ideaColl
        .find({
          $or: [
            { name: { $regex: searchData, $options: "i" } },
            { category: { $regex: searchData, $options: "i" } },
          ],
        })
        .toArray();
      res.json(searchedIdeas);
    });
    app.get("/popularCategories", async (req, res) => {
      const allCategories = await categoriesColl.find().limit(6).toArray();
      res.json(allCategories);
    });
    app.get("/comments", async (req, res) => {
      const result = await commentsColl.find().toArray();
      res.json(result);
    });

    // All Post here
    app.post("/idea", async (req, res) => {
      const ideaInf = req.body;

      const result = await ideaColl.insertOne(ideaInf);

      res.json(result);
    });

    app.post("/comment", async (req, res) => {
      const commentInf = req.body;
      const result = await commentsColl.insertOne(commentInf);
      res.json(result);
    });

    // All Patch here
    app.patch("/comment/:id", async (req, res) => {
      console.log(req.params);
      const id = req.params.id;
      const commentInf = req.body;

      const result = await commentsColl.updateOne(
        { _id: new ObjectId(id) },
        { $set: commentInf },
      );
      res.json(result);
    });

    app.patch("/idea/:id", async (req, res) => {
      const { id } = req.params;
      const idea = req.body;

      const result = await ideaColl.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: idea,
        },
      );
      res.json(result);
    });

  

    app.delete("/comment/:id", async (req, res) => {
      const { id } = req.params;

      const result = await commentsColl.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    app.delete("/idea/:id", async (req, res) => {
      const { id } = req.params;

      const result = await ideaColl.deleteOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Port is running in http://localhost:${port}`);
});

import express from "express";
import cors from 'cors';
import agent from "./agent/ai/agent";

const app = express();

app.use(cors());
app.use(express.text());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("SIH backend is running 🚀");
});

app.post("/form", async (req, res) => {
  const data = req.body;
  console.log(data);
  if (!data) {
    return res.status(400).send("Can't get data");
  }
  try {
    const result = await agent(data);
    console.log(typeof(result));
    console.log(result);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


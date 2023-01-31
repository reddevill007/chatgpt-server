import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import env from "dotenv";

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
env.config();

const configuration = new Configuration({
  organization: "org-6nX5KD2HPYVtYmEed5gjTbcD",
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body;

  try {
    const response = await openai.createCompletion({
      model: `${currentModel}`,
      prompt: `${message}`,
      max_tokens: 3000,
      temperature: 0.5,
    });

    res.json({
      message: response.data.choices[0].text,
    });
  } catch (e) {
    console.log(e);
    res.send(e).status(400);
  }
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  res.json({
    models: response.data.data,
  });
});

app.listen(port, () => {
  console.log(`Example app listning at http://localhost:${port}`);
});

import express from "express";
import Solution from "./models/solutionmodel";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
console.log("started");

app.get("/solution/:id", async (req, res) => {
  console.log(req.params.id);

  const solution = await Solution.findOne({ _id: req.params.id });
  if (solution) {
    res.send(solution.html);
  } else res.redirect("/");
});

app.use((req, res) => {
  res.send("https://discord.gg/Wt2eC7wR4c");
});
app.listen(80, () => {
  console.log("Listening on 80");
});
const uri: string = `mongodb+srv://tim:${process.env.MONGO_PASSWORD}@cluster0.k1aaw.mongodb.net/cheggbot?retryWrites=true&w=majority`;

(async () => {
  mongoose.connect(uri).catch((err: unknown) => {
    console.error(err);
  });
})();

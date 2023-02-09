import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import { spawn } from "child_process";

const publicPath = path.join(".", "public");
const programPath = path.join(".", "program");
const PORT = 6006;
const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get("/test", (req, res, next) => {
  res.status(200).json({ status: "ok" });
});

app.get("/run-script", (req, res) => {
  const pythonProcess = spawn("python", [
    path.join(programPath, "hello_world.py"),
  ]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python script output: ${data}`);
    res.status(200).json({
      scriptOutput: data.toString(),
    });
  });
});

app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found!</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

const bodyParser = require("body-parser");
const chalk = require("chalk");
const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer-core");

const generator = require("./generator");

const app = express();
app.set("views", path.join(__dirname));
app.use(bodyParser.json());

/** @type {puppeteer.Browser} */
var browser;

const steps = 7;

fancyLog(1, "Starting server...");
const server = app.listen(3001, async () => {
  fancyLog(2, "Launching browser...");
  browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  fancyLog(3, "Creating tab...");
  var page = await browser.newPage();
  fancyLog(4, "Opening website...");
  await page.goto("http://localhost:3001");
});

app.post("*", async (req, res) => {
  fancyLog(5, "Generating jsdoc...");
  await generator(req.body);
  setTimeout(async () => {
    fancyLog(6, "Quitting...");
    await browser.close();
    server.close(() => {
      fancyLog(0);
      process.exit(0);
    });
  }, 1000);
});

app.get("*", (req, res) => {
  if (/[\s\S]*?.[html|css|js|ico|ttf|png|jpg]$/g.test(req.path)) return res.sendFile(path.join(__dirname, "../..", req.path));
  return res.render("page.ejs");
});

function fancyLog(step, text) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  if (step) {
    process.stdout.write(chalk.yellow("Step "));
    process.stdout.write(chalk.blue(step));
    process.stdout.write(chalk.yellow(" of "));
    process.stdout.write(chalk.blue(steps));
    process.stdout.write(chalk.green(": "));
    process.stdout.write(text);
  } else {
    process.stdout.write(chalk.green("Task finished: "));
    process.stdout.write("Generated jsdoc at ");
    process.stdout.write(chalk.blue("src/classes/blockly.js"));
  }
}

module.exports = fancyLog;
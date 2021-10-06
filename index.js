const express = require("express");
const request = require("request");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { Command } = require("commander");

const program = new Command();

program
  .option("-k, --key <type>", "https key path")
  .option("-c, --cert <type>", "https cert path")
  .option("-p, --port <type>", "https port")
  .option("-f, --from <type>", "http url we want to make secure");

program.parse(process.argv);

const options = program.opts();

const credentials = {
  key: fs.readFileSync(options.key),
  cert: fs.readFileSync(options.cert),
};
const app = express();
app.get("*", function (req, res) {
  var newurl = `${options.from}${req.url}`;
  request(newurl).pipe(res);
});

const server = https.createServer(credentials, app);

server.listen(options.port);
console.log(
  `Secure server listening at url "https://localhost:${options.port}". Forwarding traffic from "${options.from}"`
);

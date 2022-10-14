// import whtasapp-api js
const { Client, LegacySessionAuth, LocalAuth } = require("whatsapp-web.js");
// import terminal qr code
// const qrcode = require("qrcode-terminal");
const qrcode = require("qrcode");
// import untuk write file
const fs = require("fs");
// import express
const express = require("express");
// import io
const socketIO = require("socket.io");
// http
const http = require("http");

const app = express();
const server = http.createServer(app);

// connect ke socket sever
const io = socketIO(server);

const client = new Client({
  puppeteer: {
    headless: true,
  },
  authStrategy: new LocalAuth({
    clientId: "client-one",
  }),
});

client.initialize();

// apabila masih loading screen
client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

// apabila sudah terautentikasi
client.on("authenticated", (session) => {
  console.log("AUTHENTICATED");
  sessionCfg = session;
});

client.on("auth_failure", (msg) => {
  // Fired if session r estore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

// apabila org ngirim pesan kekita, maka akan kita balas...
client.on("message", (msg) => {
  if (msg.body) {
    msg.reply("jangan balas wa ini, saya adalah BOT");
  }
});

// apabila logout
client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

// routing app
app.get("/", (req, res) => {
  // res.status(200).json({
  //     status: true,
  //     message: "Hello World",
  //     root: __dirname
  // })
  res.sendFile("index.html", {
    root: __dirname,
  });
});

// socket io
io.on("connection", function (socket) {
  socket.emit("message", "Connecting....");

  // apabila sudah ready
  client.on("ready", () => {
    socket.emit("message", "Whatsapp is ready!");
  });

  // apabila qr code telah diterima
  client.on("qr", (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qrurl", url);
      socket.emit("message", "Scan QR for use whatsapp!");
    });
  });
});

// jalankan aplikasi
server.listen(3001, function () {
  console.log("App running on port 3001...");
});

#!/usr/bin/env node

/**
 * Module dependencies.
 */

var debug = require("debug")("mern-login-heroku:server");
var http = require("http");
const express = require("express");

/**
 * Get port from environment and store in Express.
 */
const app = express();
var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

// ====================================================================== //

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt-inzi");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const postmark = require("postmark");

const SECRET = process.env.SECRET || "12345";

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  })
);

// Postmark Send an email:
const postMarkToken =
  process.env.POSTMARK_KEY || "35493d97-374a-44c3-a3d3-b6e9cd4f6169";
let client = new postmark.ServerClient(postMarkToken);

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.x26vs.mongodb.net/dev"
);

const User = mongoose.model("User", {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  age: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

const Otp = mongoose.model("Otp", {
  email: String,
  otp: String,
  used: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", {
  title: String,
  description: String,
  firstName: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

const LiveScore = mongoose.model("LiveScore", {
  teamOne: String,
  teamOneStatus: String,
  teamOneScore: String,
  teamOneWicket: String,
  teamOneOver: String,
  teamTwo: String,
  teamTwoStatus: String,
  teamTwoScore: String,
  teamTwoWicket: String,
  teamTwoOver: String,
  comentry: String,
});

mongoose.connection.on("connected", () => console.log("mongoose connected"));
mongoose.connection.on("error", (error) =>
  console.log(`mongoose error ${error.message}`)
);

// handing over server access to socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected with id: ", socket.id);

  // to emit data to a certain client
  socket.emit("topic 1", "some data");

  // collecting connected users in a array
  // connectedUsers.push(socket)

  socket.on("disconnect", (message) => {
    console.log("Client disconnected with id: ", message);
  });
});

app.use("/", express.static(path.join(__dirname, "/view/build")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./view/build/index.html"));
});

// get the cookie incoming request
app.get("/api/v1/getcookie", (req, res) => {
  //show the saved cookies
  // console.log(req.cookies);
  res.send(req.cookies);
});
app.post("/api/v1/user", (req, res) => {
  // Bcrypt

  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName

  ) {
    console.log("required field missing");
    res.status(403).send("required field missing");
    return;
  } else {
    User.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (user) {
          res.send("user already exist");
        } else {
          // console.log(req.body);
          bcrypt.stringToHash(req.body.password).then((passwordHash) => {
            // console.log("hash: ", passwordHash);

            let newUser = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: passwordHash,
              age: req.body.age,
            });
            newUser.save(() => {
              // console.log("data saved");
              res.send("profile created");
            });
          });
        }
      }
    );
  }
});

app.post("/api/v1/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(403).send("required field missing");
    return;
  }
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) {
        res.status(500).send("error in getting database");
      } else {
        if (user) {
          bcrypt
            .varifyHash(req.body.password, user.password)
            .then((result) => {
              if (result) {
                var access_token = jwt.sign(
                  {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    _id: user._id,
                  },
                  SECRET
                );
                // console.log("token created: ", access_token);
                res.cookie("access_token", access_token, {
                  httpOnly: true,
                  // expires: (new Date().getTime + 300000), //5 minutes
                  maxAge: 300000,
                });
                res.send({
                  access_token: access_token,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  _id: user._id,
                });
              } else {
                res.json("Authentication fail");
              }
            })
            .catch((e) => {
              console.log("error: ", e);
            });
        } else {
          res.send("user not found");
        }
      }
    }
  );
});




app.post("/api/v1/otp", (req, res, next) => {
  if (!req.body.email) {
    console.log("required field missing");
    res.status(403).send("required field missing");
    return;
  }
  console.log("req.body: ", req.body);

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(500).send("error in getting database");
    } else {
      if (user) {
        function getRandomArbitrary(min, max) {
          return Math.random() * (max - min) + min;
        }
        const otp = getRandomArbitrary(11111, 99999).toFixed(0);

        bcrypt.stringToHash(otp).then((hash) => {
          let newOtp = new Otp({
            email: req.body.email,
            otp: hash,
          });
          newOtp.save((err, saved) => {
            if (!err) {
              client
                .sendEmail({
                  From: "talha.akhter@thedigitz.com",
                  To: req.body.email,
                  Subject: "forget password OTP",
                  TextBody: `Hi ${user.firstName}${user.lastName}, your 5 digit OTP is: ${otp}`,
                })
                .then((success, error) => {
                  if (!success) {
                    console.log("postmark error: ", error);
                  }
                });

              res.send({ otpSent: true, message: "otp genrated" });
            } else {
              console.log("error: ", err);
              res.status(500).send("error saving otp on server");
            }
          });
        });
      } else {
        res.send("user not found");
      }
    }
  });
});
app.post("/api/v1/forgot_password", (req, res, next) => {
  if (!req.body.email || !req.body.otp || !req.body.newPassword) {
    console.log("required field missing");
    res.status(403).send("required field missing");
    return;
  }
  console.log("req.body: ", req.body);

  Otp.findOne({ email: req.body.email })
    .sort({ _id: -1 })
    .exec((err, otp) => {
      if (err) {
        res.status(500).send("error in getting database");
      } else {
        if (otp) {
          const created = new Date(otp.created).getTime;
          const now = new Date().getTime;
          const diff = now - created;

          if (diff > 300000 || otp.used) {
            res.status(401).send("otp not valid");
          } else {
            bcrypt.varifyHash(req.body.otp, otp.otp).then((isMatch) => {
              if (isMatch) {
                bcrypt.stringToHash(req.body.newPassword).then((hashPassword) => {
                  User.findOneAndUpdate(
                    { email: req.body.email },
                    { password: hashPassword },
                    {},
                    (err, updated) => {
                      if (!err) {
                        res.json("password updated");
                      } else {
                        res.status(500).send("error updating user");
                      }
                    }
                  );
                });
                otp.update({ used: true }).exec((err, updated) => {
                  if (!err) {
                    console.log("otp updated");
                  } else {
                    console.log("otp update fail: ", err);
                  }
                });
              } else {
                res.status(401).send("otp not valid");
              }
            });
          }
        } else {
          res.status(400).send("invalid otp");
        }
      }
    });
});

app.use((req, res, next) => {
  const access_token = req.cookies.access_token;
  // console.log("Cookie: ", access_token);
  if (!access_token) {
    return res.sendStatus(403);
  }
  jwt.verify(access_token, SECRET, function (err, decoded) {
    // console.log("decoded: ", decoded); // bar
    req.body._decoded = decoded;

    if (!err) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
});

app.post("/api/v1/logout", (req, res, next) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    maxAge: 300000,
  });
  res.send();
});

app.get("/api/v1/user", (req, res) => {
  User.find({}, (err, data) => {
    res.send(data);
  });
});

app.get("/api/v1/profile", (req, res) => {
  User.findOne({ email: req.query.email }, (err, user) => {
    if (err) {
      res.status(500).send("error in getting database");
    } else {
      if (user) {
        res.send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      } else {
        res.send("user not found");
      }
    }
  });
});

app.delete("/api/v1/profile", (req, res) => {
  res.send("profile deleted");
});

app.post("/api/v1/post", (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    firstName: req.body.firstName,
  });
  newPost.save().then(() => {
    console.log("Post created");
    res.send("Post created");
  });
});

app.delete("/api/v1/post", (req, res) => {
  Post.deleteOne({ _id: req.body.id }, (err, data) => {
    res.send("Post deleted");
  });
});

app.get("/api/v1/post", (req, res) => {
  Post.find({})
    .sort({ created: "desc" })
    .exec(function (err, data) {
      res.send(data);
    });
});

app.post("/api/v1/score", (req, res) => {
  const score = {
    teamOne: req.body.teamOne,
    teamOneStatus: req.body.teamOneStatus,
    teamOneScore: req.body.teamOneScore,
    teamOneWicket: req.body.teamOneWicket,
    teamOneOver: req.body.teamOneOver,
    teamTwo: req.body.teamTwo,
    teamTwoStatus: req.body.teamTwoStatus,
    teamTwoScore: req.body.teamTwoScore,
    teamTwoWicket: req.body.teamTwoWicket,
    teamTwoOver: req.body.teamTwoOver,
    comentry: req.body.comentry,
  };

  const newScore = new LiveScore(score);

  newScore.save().then(() => {
    console.log("Score created");

    io.emit("SCORE", score);

    res.send("Score created");
  });
});

app.get("/api/v1/score", (req, res) => {
  LiveScore.findOne({})
    .sort({ _id: "desc" })
    .exec(function (err, data) {
      res.send(data);
    });
});

app.get("/**", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./view/build/index.html"));
  // res.redirect("/")
});

module.exports = app;

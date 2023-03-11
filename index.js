const express = require("express");
const fileUpload = require("express-fileupload");
var session = require("express-session");
const cookieParser = require("cookie-parser");
const { readdir } = require("fs").promises;
const fs = require("fs");

const app = express();
const port = 3000;
const oneDay = 1000 * 60 * 60 * 24;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(express.static("public"));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

getFileList("output").then((files) => {
  files.forEach((file) => {
    var date = createdDate(file).birthtime.getTime();
    var fiveMin = 1000 * 60 * 1;
    var isPast = new Date().getTime() - date < fiveMin ? false : true;

    console.log(file, isPast);
    if (isPast) {
      fs.unlinkSync(file);
    } else {
      setTimeout(() => {
        fs.unlinkSync(file);
      }, 60000);
    }
  });
});

require("./route/login")(app);
app.use(checkLogin);
require("./route/sign")(app);
require("./route/download")(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
function checkLogin(req, res, next) {
  if (!req.session.userid) {
    return res.status(401).send({
      message: "user not found",
    });
  }
  next();
}

function createdDate(file) {
  const value = fs.statSync(file);

  return value;
}

async function getFileList(dirName) {
  let files = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
}

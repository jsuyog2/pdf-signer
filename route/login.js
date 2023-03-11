const { v4: uuidv4 } = require("uuid");
var chilkat = require("@chilkat/ck-node18-win64");
module.exports = function (app) {
  app.post("/login", (req, res) => {
    const myusername = uuidv4();
    session = req.session;
    session.userid = myusername;
    var cert = new chilkat.Cert();
    var pin = "";
    if (req.body.pin) {
      pin = req.body.pin;
      cert.SmartCardPin = pin;
    }
    var success = cert.LoadFromSmartcard("");
    if (success == false) {
      return res.status(401).send({
        message: "Smart Card not found",
      });
    }
    session.pin = pin;
    console.log("Cert loaded from smartcard: " + cert.SubjectCN);
    res.send({
      message: "Signin Successfully",
    });
  });
};

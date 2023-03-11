var chilkat = require("@chilkat/ck-node18-win64");
var fs = require("fs");
module.exports = function (app) {
  app.post("/sign", (req, res) => {
    var userid = req.session.userid;
    if (!req.files) {
      return res.status(404).send({ message: "file not found" });
    }
    if (!req.files.file) {
      return res.status(404).send({ message: "file is required" });
    }

    var fileName = req.files.file.name.replaceAll(".pdf", "");
    var filePath = req.files.file.tempFilePath;
    var pdf = new chilkat.Pdf();

    var success = pdf.LoadFile(filePath);
    if (success == false) {
      return res.status(500).send({ message: pdf.LastErrorText });
    }

    var json = new chilkat.JsonObject();
    json.UpdateInt("signingCertificateV2", 1);
    json.UpdateInt("signingTime", 1);
    json.UpdateInt("page", 1);
    json.UpdateString("appearance.y", "bottom");
    json.UpdateString("appearance.x", "right");
    json.UpdateString("appearance.margin_x", "25");
    json.UpdateString("appearance.fontScale", "10.0");
    json.UpdateString("appearance.text[0]", "Digitally signed by: cert_cn");
    json.UpdateString("appearance.text[1]", "current_dt");
    json.UpdateString("appearance.text[2]", "HSBC Sign");

    // var cert = new chilkat.Cert();
    // success = cert.LoadPfxFile("./key/name.pfx", "12345");
    // if (success == false) {
    //   return res.status(500).send({ message: pdf.LastErrorText });
    // }
    if (req.session.pin) {
      cert.SmartCardPin = req.session.pin;
    }

    var success = cert.LoadFromSmartcard("");
    if (success == false) {
      return res.status(401).send({
        message: "Smart Card not found",
      });
    }

    success = pdf.SetSigningCert(cert);
    if (success == false) {
      return res.status(500).send({ message: pdf.LastErrorText });
    }
    var path = `output/${userid}`;
    var path_exist = fs.existsSync(path);
    if (!path_exist) {
      fs.mkdirSync(path, { recursive: true });
    }
    success = pdf.SignPdf(json, path + "/" + fileName + "_signed.pdf");
    if (success == false) {
      return res.status(500).send({ message: pdf.LastErrorText });
    }
    setTimeout(() => {
      fs.unlinkSync(path + "/" + fileName + "_signed.pdf");
    }, 60000);

    res.send({
      message: "The PDF has been successfully cryptographically signed.",
    });
  });
};

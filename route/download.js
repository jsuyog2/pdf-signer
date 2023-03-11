var fs = require("fs");
var archiver = require("archiver");
module.exports = function (app) {
  app.get("/download", (req, res) => {
    var userid = req.session.userid;
    var path = `output/${userid}`;
    var path_exist = fs.existsSync(path);
    if (path_exist) {
      var output = fs.createWriteStream("output/" + userid + ".zip");
      var archive = archiver("zip");

      archive.pipe(output);
      archive.directory(path, false);
      archive.directory("subdir/", "new-subdir");

      archive.finalize();
      output.on("close", function () {
        setTimeout(() => {
          fs.unlinkSync("output/" + userid + ".zip");
        }, 60000);
        res.download("output/" + userid + ".zip");
      });

      archive.on("error", function (err) {
        throw err;
      });
    } else {
      res.status(404).send({
        message: "Files not found",
      });
    }
  });
};

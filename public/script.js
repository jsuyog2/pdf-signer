$(document).ready(function () {
  var baseUrl = window.location.origin;
  var upload = 0;
  var error = "Please upload File";
  if (sessionStorage.getItem("pin")) {
    $.ajax({
      url: baseUrl + "/login",
      type: "POST",
      data: {
        pin: sessionStorage.getItem("pin"),
      },
      success: (data) => {
        $(".overlay").fadeOut();
        console.log(data);
      },
      error: (err) => {
        $(".overlay").fadeOut();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          allowOutsideClick: false,
          text: "Please Insert Smart Card",
          confirmButtonText: "Retry",
          html: `  <div class="input-field">
          <input id="pin" type="text" class="validate">
          <label for="pin">Please Enter Smart Card Pin</label>
        </div>`,
          preConfirm: (value) => {
            let pin = $("#pin").val();
            sessionStorage.setItem("pin", pin);
          },
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      },
    });
  } else {
    $(".overlay").fadeOut();
    Swal.fire({
      icon: "error",
      title: "Oops...",
      allowOutsideClick: false,
      html: `  <div class="input-field">
      <input id="pin" type="text" class="validate">
      <label for="pin">Please Enter Smart Card Pin</label>
    </div>`,
      confirmButtonText: "Retry",
      customClass: {
        input: " input-outlined",
      },
      preConfirm: (value) => {
        let pin = $("#pin").val();
        sessionStorage.setItem("pin", pin);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    });
  }

  $("#files").change(() => {
    var files = $("#files").prop("files");
    var names = $.map(files, function (val) {
      var ext = val.name.split(".").pop().toLowerCase();
      if ($.inArray(ext, ["pdf"]) == -1) {
        return val.name;
      }
    });
    if (names.length !== 0) {
      error = "Only PDF is Accepted.";
    } else {
      $(".listOfFiles").html(`
       <div class="row">
      <div class="col s8">Name</div>
      <div class="col s4">Process</div>
  </div>`);
      var names = $.map(files, function (val) {
        return val.name;
      });
      names.forEach((element, index) => {
        $(".listOfFiles").append(`
        <div class="row">
                 <div class="col s8">${element}</div>
              <div class="col s4" id="icon-${index}">Ready to Sign</div>
         </div>
        `);
      });
      upload++;
    }
  });
  $("#submit").click(function () {
    if (upload === 1) {
      var files = $("#files")[0].files;
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        var formData = new FormData();
        formData.append("file", file);
        $("#icon-" + index).html(`  <div class="preloader-wrapper small active">
        <div class="spinner-layer spinner-green-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>`);
        $.ajax({
          url: baseUrl + "/sign",
          type: "POST",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: (data) => {
            upload = 2;
            $("#icon-" + index).html(
              `   <i style="color:green" class="material-icons">check_circle</i>`
            );
          },
        });
      }

      upload = 0;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  });
  $("#download").click(function () {
    if (upload === 2) {
      window.location = baseUrl + "/download";
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please sign file first",
      });
    }
  });
  $("#new_files").click(function () {
    location.reload();
  });
});

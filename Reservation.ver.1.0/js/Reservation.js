//-----1.預覽圖片的功能-----
$(function () {
  $(".main").on('change', '.upload', function () {
    var _this = this;
    $.filePreview.create(this, {
      isReader: false,
      progress: function (key, percent) {
        console.log(percent)
      },
      success: function (key, obj) {
        var $img = $(_this).parents(".main").find(".img").eq(key);
        $img.css({
          'background-image': 'url(' + obj.preview + ')'
        });
      }
    });
  });
})
//-----2.確認資料都有填、上傳檔案是圖片、檔案小於25MB、同意條款和上傳檔案的功能-----
function submitForm() {
  var files = $('#files')[0].files;
  var errLog = "";

  if ($("#myCheckbox").prop("checked")) {
    if ($('input#name').val() === "") {
      errLog += "Please enter your Name. </br>";
    }
    if ($('input#email').val() === "") {
      errLog += "Please enter your Email. </br>";
    }
    if (files.length === 0) {
      errLog += "Please select a file to upload. </br>";
    } else if (files.length > 3) {
      errLog += "Please select less than 3 files. </br>";
    } else {
      for (var i = 0, file; file = files[i]; i++) {
        if (file.size > 1024 * 1024 * 25) {
          errLog += "The file size should be < 25 MB. </br>";
        }
      }
    }
  } else {
    errLog += "請勾選同意條款";
  }
  //以上是submitform確認資料的程式碼
  if (errLog === "") {
    $("#update").hide();
    showMessage("檔案上傳中，請耐心等候.........");
    numUploads.total = files.length;
    //建立資料夾
    google.script.run
      .withSuccessHandler(showSuccess)
      .createGoogleDriveFolder($('input#name').val(), $('input#email').val());

    for (var i = 0, file; file = files[i]; i++) {
      var fileName = 'input[name="FileName' + i + '"]';
      sendFileToDrive(file, $(fileName).val());
      /**這邊還在上傳檔案**/
      console.log(i);
    }
  } else {
    showError(errLog);
    return;
  }
}
//-----3.第二個功能中所需要的補充功能-----
//$.(選擇器).removeClass(Class_name)__________對$.(選擇器)元素移除CSS的class屬性
/**ref: https://api.jquery.com/removeclass/  or http://www.flag.com.tw/DB/preview/FS466_1.pdf **/
function showMessage(e) {
  $('#progress').removeClass('red-text').html(e);
}

function showSuccess(e) {
  if (e === "OK") {
    return;
  } else {
    showError(e);
  }
}

function sendFileToDrive(file, fileChangeName) {
  var reader = new FileReader();
  reader.onloadend = function (e) {
    if (e.target.error != null) {
      showError("File " + file.name + " could not be read.");
      return;
    } else {
      //上傳檔案
      google.script.run
        .withSuccessHandler(updateProgressbar)
        .uploadFileToGoogleDrive(e.target.result, file.name, $('input#name').val(), $('input#email').val(), fileChangeName);
    }
  };
  reader.readAsDataURL(file);
}

function showError(e) {
  $('#progress').addClass('red-text').html(e);
}
//updateProgressbar是用來控制畫面的，如果上傳成功會把原來的網頁(id="forminner")隱藏，讓字串(id="success")顯示
function updateProgressbar(idUpdate) {
  numUploads.done++;
  if (numUploads.done == numUploads.total) {
    //uploads finished
    numUploads.done = 0;
    SendScore();
  };
}
//-----4.把客戶網頁填寫的資料寫入線上Excel裡面的功能-----
//1.按下送出後會執行SendScore()  2.SendScore()中會對你的google script作get  3.你的google script收到get指令時會執行doGet
function SendScore() {
  $.get("https://script.google.com/macros/s/AKfycby6EeUuvq8eYQWeilGGJRaxfYI_M54FInYL3jiK9MFZo7QoS4sp/exec", {
      "name1": document.getElementById("name").value,
      "email1": document.getElementById("email").value,
      "FBname": document.getElementById("FBnameInput").value,
      "animal": document.getElementById("animalInput").value,
      "others": document.getElementById("othersInput").value,
      "datepicker1": document.getElementById("datepicker").value

    },
    function checkReturn(data) {
      if (data === "上傳成功") {
        /**server回傳data回來，如果是上傳成功，document就被我清掉顯示以下資訊了，所以後面做什麼事都抓不到資料 **/
        //document.write("--------------------------");
        //document.write(""+data);
        //document.write("--------------------------");
        /**這邊直接改顯示success的內容 **/
        $('#forminner').hide();
        console.log("上傳成功");
        $('#success').show();
      } else {
        console.log("上傳excel失敗");
      }
    });
}
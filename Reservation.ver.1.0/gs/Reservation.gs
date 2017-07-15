/*

    RECEIVE FILES IN GOOGLE DRIVE
    - - - - - - - - - - - - - - -

    Tutorial: www.labnol.org/awesome

    Twitter: @labnol

    Email: amit@labnol.org

*/

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('forms.html').setTitle("Pai Animal communication");
}

function createGoogleDriveFolder(name, email) {

  try {

    var dropbox = "Pai Animal communication1";
    var folder, folders = DriveApp.getFoldersByName(dropbox);
    var fileName;

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    var newFolderName = [name, email].join(" "); //建立子資料夾，格式：name+" "+email
    var newFolder, newFolders = folder.getFoldersByName(newFolderName);
    if (newFolders.hasNext()) {
      newFolder = newFolders.next();
    } else {
      newFolder = folder.createFolder(newFolderName);
    }

    return "OK";

  } catch (f) {
    return f.toString();
  }

}

function uploadFileToGoogleDrive(data, file, name, email, fileChangeName) {

  try {

    var dropbox = [name, email].join(" ");
    var folder = DriveApp.getFoldersByName(dropbox).next();
    var fileName;

    if (fileChangeName === "") {
      fileName = file;
    } else {
      fileName = fileChangeName;
    }

    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, fileName),
        file = folder.createFile(blob);

    return fileName;

  } catch (f) {
    return f.toString();
  }

}

const express = require("express");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

// configure fileupload middleware
app.use(fileUpload());

// create a connection to the MySQL database
const connection = mysql.createConnection({
  user: process.env.MYSQL_USER,
  host: process.env.MYSQL_HOST,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// open the connection
connection.connect();

// create the file_table if it does not exist
connection.query(
  "CREATE TABLE IF NOT EXISTS file_table (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), data MEDIUMBLOB)",
  (error, results, fields) => {
    if (error) {
      console.error(error);
    }
  }
);

// define file upload route
app.post("/upload", (req, res) => {
  // make sure a file was selected for upload
  if (!req.files || !req.files.fileToUpload) {
    return res.status(400).send("No files were uploaded.");
  }

  // store the uploaded file object
  const uploadedFile = req.files.fileToUpload;

  // insert the uploaded file into the database
  connection.query(
    "INSERT INTO file_table SET ?",
    {
      name: uploadedFile.name,
      data: uploadedFile.data,
    },
    (error, results, fields) => {
      if (error) {
        return res.send(error);
      }

      // return a success message to the client
      res.send("File uploaded successfully!");
    }
  );
});

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

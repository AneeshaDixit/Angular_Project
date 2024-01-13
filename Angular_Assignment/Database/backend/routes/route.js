const express = require('express')
const route = express.Router()


const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'resultmanagement'
});



route.post('/studentlogin', async (req, res) => {


    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        let selectQuery = 'SELECT * FROM student WHERE name=? AND rollno=?';
        let query = mysql.format(selectQuery, [req.body.name, req.body.rollno]);
        // query = SELECT * FROM `todo` where `user` = 'shahid'
        pool.query(query, (err, data) => {
            if (err) {
                connection.release();
                console.error(err);
                return;

            }
            if (data.length > 0) {
                connection.release();

                return res.status(200).json({ message: "valid" });
            }
            else {
                connection.release();
                return res.status(200).json({ message: "invalid" });

            }
        });
    });

})



route.post('/teacherlogin', async (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        let selectQuery = 'SELECT * FROM teacher WHERE uname=? AND pass=?';
        let query = mysql.format(selectQuery, [req.body.name, req.body.pass]);
        // query = SELECT * FROM `todo` where `user` = 'shahid'
        pool.query(query, (err, data) => {
            if (err) {
                connection.release();
                console.error(err);
                return;
            }
            if (data.length > 0) {
                connection.release();

                return res.status(200).json({ message: "valid" });
            }
            else {
                return res.status(200).json({ message: "invalid" });
                connection.release();
            }


        });
    });

})


route.post('/addstudent', async (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as id ' + connection.threadId);
      let selectQuery = 'SELECT * FROM student WHERE rollno=?';
      let query = mysql.format(selectQuery, [req.body.rollno]);
      pool.query(query, (err, data) => {
        if (err) {
          connection.release();
          console.error(err);
          return;
        }
        if (data.length > 0) {
          connection.release();
          return res.status(200).json({ message: "Already exist" });
        } else {
          let insertQuery = 'INSERT INTO student (rollno, name, dob, score) VALUES (?, ?, STR_TO_DATE(?, "%d-%m-%Y"), ?)';
        //   let dob = formatDate(req.body.dob); // Format the date as "dd-mm-yyyy"
          let insertValues = [req.body.rollno, req.body.name, req.body.dob, req.body.score];
          let Query = mysql.format(insertQuery, insertValues);
          pool.query(Query, (err, data) => {
            if (err) {
              connection.release();
              console.error(err);
              return;
            }
            connection.release();
            return res.status(200).json({ message: "Added Successfully" });
          });
        }
      });
    });
  });
  
  // Helper function to format the date as "dd-mm-yyyy"
//   const formatDate = (dateString, format) => {
//     const date = new Date(dateString);
//     let day = date.getDate();
//     let month = date.getMonth() + 1;
//     const year = date.getFullYear();
  
//     if (day < 10) {
//       day = '0' + day;
//     }
  
//     if (month < 10) {
//       month = '0' + month;
//     }
  
//     if (format === 'dd-mm-yyyy') {
//       return `${day}-${month}-${year}`;
//     } else if (format === 'yyyy-mm-dd') {
//       return `${year}-${month}-${day}`;
//     }
  
//     return dateString;
//   };
  

// const formatDate = (dateString) => {
//     const [day, month, year] = dateString.split('-');
//     return `${day}-${month}-${year}`;
//   };

  route.post('/edit', async (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as id ' + connection.threadId);
      let updateQuery = "UPDATE student SET name = ?, dob = ?, score = ? WHERE rollno = ?";
    //   let dob = formatDate(req.body.dob); // Format the date as "yyyy-mm-dd"
      let query = mysql.format(updateQuery, [req.body.name, req.body.dob, req.body.score, req.body.rollno]);
      // query = UPDATE
      pool.query(query, (err, response) => {
        if (err) {
          connection.release();
          console.error(err);
          return;
        }
        // rows updated
        console.log(response.affectedRows);
        connection.release();
        return res.status(200).json({ message: "valid" });
      });
    });
  });
  
  




route.get('/viewall', async (req, res) => {



    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        let selectQuery = 'SELECT rollno, name, DATE_FORMAT(dob, "%d-%m-%Y") as dob, score FROM student';
        pool.query(selectQuery, (err, data) => {
            if (err) {
                connection.release();
                console.error(err);
                return;
            }
            // rows fetch
            console.log(data);
            connection.release();
            return res.status(200).json({ message: "valid", data: data });

        });
    });

})

route.get('/viewresult/:rollno', async (req, res) => {


    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        let selectQuery = 'SELECT * FROM student Where rollno=?';
        let query = mysql.format(selectQuery, [req.params.rollno]);
        // query = SELECT * FROM `todo` where `user` = 'shahid'
        pool.query(query, (err, data) => {
            if (err) {
                connection.release();
                console.error(err);
                return;

            }
                connection.release();
                return res.status(200).json({data: data });
            
           


        });
    });

})



route.get('/delete/:rollno', async (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        let selectQuery = 'DELETE FROM student WHERE rollno=?';
        let query = mysql.format(selectQuery, [req.params.rollno]);
        // query = SELECT * FROM `todo` where `user` = 'shahid'
        pool.query(query, (err, data) => {
            if (err) {
                connection.release();
                console.error(err);
                return;
            }
            // rows fetch
            console.log(data);
            connection.release();
            return res.status(200).json({ message: "valid" });


        });
    });

})


module.exports = route
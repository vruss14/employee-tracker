const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,
  
    user: 'root',
  
    password: 'Vmr13:)!',
    database: 'employeesDB',
  });
  
  connection.connect((err, res) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
  
    connection.query("SELECT * FROM department", (err, res) => {
      if(err) throw err;
      console.table(res);
      connection.end();
    })

    // connection.query("SELECT * FROM role", (err, res) => {
    //     if(err) throw err;
    //     console.table(res);
    //     connection.end();
    //   })

    //   connection.query("SELECT * FROM employee", (err, res) => {
    //     if(err) throw err;
    //     console.table(res);
    //     connection.end();
    //   })
    
  });
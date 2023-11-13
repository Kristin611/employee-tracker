const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');

require('console.table')

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Pantheon4ever!",
      database: "employees_db",
    },
    console.log(`Connected to employees_db database.`)
  );

  function init() {
    const logoText = logo({name: 'Employee Tracker'}).render()
    console.log(logoText);

    
  }

  init(); 
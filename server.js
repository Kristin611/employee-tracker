const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
const dotenv = require('dotenv');
dotenv.config()

require('console.table')

//to connect to mysql databases 
const db = mysql.createConnection(
    {
      host: "127.0.0.1",
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PW,
      database: process.env.MYSQL_DB,
    },
    console.log(`Connected to employees_db database.`)
  );

  //function to render logo
  function init() {
    const logoText = logo({name: 'Employee Tracker'}).render()
    console.log(logoText);

    
  }

  init(); 

  function initTracker() {
    inquirer
    .prompt([
      {
            type: 'list',
            message: 'What would you like to do?',
            name: 'inquire',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'

            ]
      }
    ])
    .then((response) => {
      const inquire = response.inquire;

      let inquireChoice;
      switch(response.inquire) {
        case 'View All Employees':
          inquireChoice = 

      }
    })
  }

  initTracker();
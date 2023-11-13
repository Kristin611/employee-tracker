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
                {name: 'View All Employees',
                  value: "ViewAllEmployees"
                },
                {name: 'Add Employee',
                value: 'AddEmployee'
              },
                {name: 'Update Employee Role',
                value: 'UpdateEmployeesRole'
              },
                {name: 'View All Roles',
                value: 'ViewAllRoles'
              },
                {name: 'Add Role',
                value: 'AddRole'
              },
                {name: 'View All Departments',
                value: 'ViewAllDepartments'
              },
                {name: 'Add Department',
                value: 'AddDepartment'
              },
                {name: 'Quit',
                  value: 'Quit'
              }

            ]
      }
    ])
    .then((response) => {
      const inquire = response.inquire;
      console.log(response.inquire)
      switch(inquire) {
        case 'ViewAllEmployees':
          viewEmployees();
          break;
        case 'ViewAllDepartments':
          viewDepartments();
          break;
        case 'ViewAllRoles':
          viewRoles();
          break; 
        case 'AddDepartment':
          addDepartment();
          break;
        case 'AddRole':
          addRole();
          break; 
        case ''       


      }
    })
  }
  function viewEmployees() {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        console.table(results), initTracker();
    })
}

function viewDepartments() {
  db.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      console.table(results), initTracker();
  })
}

function viewRoles() {
  db.query('SELECT * FROM roles', (err, results) => {
      if (err) throw err;
      console.table(results), initTracker();
  })
}

function addDepartment() {
  inquirer
  .prompt([
    { 
      type: 'input',
      name: 'addADepartment',
      message: "Which department would you like to add?"

    }
  ]).then((response) => {
    let departmentName = response.addADepartment

    db.query('INSERT INTO department (name) VALUES (?)', [departmentName], function (err, results) {
      err ? console.log(err): viewDepartments(), initTracker()
    })
  })
 
}

function addRole() {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      console.log(err)
      initTracker()
    }

    const departmentChoices = results.map((department) => ({
      value: department.id, 
      name: department.name
    })) 
    //console.log(departmentChoices)
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'addRole',
        message: "What role would you like to add?"
      },

      {
        type: 'input',
        name: 'salary',
        message: "Please enter this role's salary."
      },

      {
        type: 'list',
        name: 'departmentID',
        message: "What department does this role belong to?",
        choices: departmentChoices
      }
    ]).then((response) => {
      let departmentId = response.departmentID
      let roleName = response.addRole;
      let salary = response.salary

      db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [roleName, salary, departmentId], 
      function (err, result) {
        if (err) {
          console.log(err)
        } else {
          viewRoles(), initTracker()
        }
      })
    })
  })
}

function addEmployee()

  initTracker();

  module.exports = {
    db
  }
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

  //function to initialize employee tracker that includes the prompts and switch cases for whatever the user wishes to view
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
        case 'AddEmployee':
          addEmployee();
          break;
        case 'UpdateEmployeesRole':
          updateEmployee();
          break;     


      }
    })
  }

  //function to retreive all employee data, including title, department and salary data, from the employees_db
  function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`, (err, results) => {
        if (err) throw err;
        console.table(results), initTracker();
    })
}

//function to retreive department data from department table in the employees_db
function viewDepartments() {
  db.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      console.table(results), initTracker();
  })
}

//function to retreive roles data from roles table in the employees_db
function viewRoles() {
  db.query('SELECT * FROM roles', (err, results) => {
      if (err) throw err;
      console.table(results), initTracker();
  })
}

//function to add a department to the department table in the employees_db
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
      err ? console.log(err): viewDepartments(); //initTracker()
    })
  })
 
}

//function to add a role to the roles table in the employees_db
function addRole() {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      console.log(err)
      //initTracker()
    }

    //used map() method to loop through department table to add role to the appropriate department
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
      //querying the table to add a new role to the roles table
      db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [roleName, salary, departmentId], 
      function (err, result) {
        if (err) {
          console.log(err)
        } else {
          viewRoles();
          //initTracker();
        }
      })
    })
  })
}
//function to add an employee to the employee table in the employees_db
function addEmployee() {

  //querying the roles table and mapping through it to assign a role to the new employee
  db.query('SELECT * FROM roles', function (err, results) {
    if (err) throw new Error;
    const roleName = results.map((role) => ({
      value: role.id,
      name: role.title
    }))
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name."
      },

      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name."
      },

      {
        type: 'list',
        name: 'roleID',
        message: "What role will this employee belong to?",
        choices: roleName
      }
    ]).then((response) => {
      const empFirstName = response.firstName
      const empLastName = response.lastName
      const roleId = response.roleID;

        //querying the employee table to add a new employee with assigned role
      db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [empFirstName, empLastName, roleId], 
      function (err, result) {
        if (err) throw err;
        viewEmployees();
        //initTracker();
      })
    })
  } )
}
//function to update an employee's info in the employee table in the employees_db
function updateEmployee() {

  //querying the employees table to map through employee list by last name in order to choose which employee the user wants to update
  db.query('SELECT * FROM employee', function (err, results) {
    if (err) throw err;
    const updateEmp = results.map((employee) => ({
      value: employee.id,
      name: employee.last_name
    }))
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'lastName',
        message: 'Which employee would you like to update?',
        choices: updateEmp
      }
    ]).then((response) => {
      const empLastName = response.lastName;

    //querying the roles table to map through roles list in order to update the employee's new role/title  
      db.query('SELECT * FROM roles', function (err, results) {
        if (err) throw err;
        const updateRole = results.map((role) => ({
          value: role.id,
          name: role.title
        }))
        inquirer
        .prompt([
    
          {
            type: 'list',
            name: 'newRole',
            message: "Please enter the employee's new title.",
            choices: updateRole
          }
        ]).then((response) => {
          
          const empNewRole = response.newRole;
    
            //querying the employee table to update it with new employee role information
          db.query('UPDATE employee SET role_id = ? WHERE id = ?', [empNewRole, empLastName], function (err, result) {
            if (err) throw err;
            viewEmployees();
          })
        })
      })
    })
  })
  
  
}

  initTracker();

 
const mysql = require('mysql2');
const { db } = require('/Users/kristinrichie/Desktop/Challenges/Challenge-12/employee-tracker/server.js')

async function viewEmployees() {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        return results;
    })
}

module.exports = {
    viewEmployees
}
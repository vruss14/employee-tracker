const inquirer = require('inquirer');
const mysql = require('mysql');
const dotenv = require('dotenv');
const consoleTable = require('console.table');
require('dotenv').config()

// Creates the connection once to the mySQL database
// The connection ends only when the user selects "Quit"

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err, res) => {
    if (err) throw err;
});

// Answer lists are organized into arrays for easy access later on in the script

const actionOptions = ["Add a department", "Add a role", "Add an employee", "View all departments", 
"View all roles", "View all employees", "Update an employee's role", "Quit"];
const yesOrNo = ["Yes", "No"];
const roles = [];
const depts = [];
const possibleManagers = ["No Manager"];

// This is the main menu that is returned to each time until the user quits the application

function askForAction () {
    inquirer.prompt([

        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: actionOptions
        },

    ])

    .then (function(response) {
        if (response.action === "Add a department") {
            askAddDepartmentQuestions();
        } else if (response.action === "Add a role") {
            askAddRoleQuestions();
        } else if (response.action === "Add an employee") {
            askAddEmployeeQuestions();
        } else if (response.action === "View all departments") {
            askViewDepartmentQuestions();
        } else if (response.action === "View all roles") {
            askViewRoleQuestions();
        } else if (response.action === "View all employees") {
            askViewEmployeeQuestions();
        } else if (response.action === "Update an employee's role") {
            askUpdateEmployeeQuestions();
        } else if (response.action === "Quit"){
            console.log("Bye for now!");
            connection.end();
            return;
        }
    })
}

// This function (i.e. the main menu) is called when the application is initially run
askForAction();

// These questions and verifications are used if the user wants to add a department

function askAddDepartmentQuestions() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'department',
        },
    ])

    .then (function(response) {

        // Storing this particular part of the response in a variable allows it to be used in the following promise
        let userDept = response.department;
        
        if (response.department === "") {
            console.log("Your response cannot be blank.");
            askAddDepartmentQuestions();
            return;
        } else {
            connection.query(`INSERT INTO department (deptname) VALUES ("${response.department}");`, (err, res) => {
                if (err) throw err;
            });
        }

        inquirer.prompt([
            {
                type: 'list',
                message: `You want to create a department named ${response.department}. Is this correct?`,
                name: 'departmentverify',
                choices: yesOrNo
            },
        ])

        // The user's response has already been inserted into the database at this point
        // This verification checks if the department should be deleted or kept in the database

        .then (function(response) {
            if(response.departmentverify === "Yes") {
                connection.query("SELECT * FROM department", (err, res) => {
                    if (err) throw err;
                    console.log('\n','The department has been added.');
                    console.table('\n', res);
                    askForAction();
                });
            } else {
                connection.query(`DELETE FROM department WHERE deptname = "${userDept}"`, (err, res) => {
                    if (err) throw err;
                    connection.query("SELECT * FROM department", (err, res) => {
                        if (err) throw err;
                        console.log('\n', "The department has been deleted.");
                        console.table('\n', res);
                        askAddDepartmentQuestions();
                    });
                });
            }
        })
    })
}

// The chooseDept(), chooseRole(), and chooseManager() functions are used to create a list of choices for inquirer

function chooseDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            depts.push(res[i].deptname);
        }
    })

    return depts;
}

function chooseRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
    })

    return roles;
}

function chooseManager() {
    connection.query("SELECT DISTINCT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            possibleManagers.push(`${res[i].first_name} ${res[i].last_name}`);
        }
    })

    return possibleManagers;
}

// These questions clarify the role the user wants to add, and ensures that no errors have been made

function askAddRoleQuestions() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the title of the role?',
            name: 'role',
        },

        {
            type: 'input',
            message: 'What is the salary of the role? Please enter the value as a number only, with no special characters.',
            name: 'rolesalary',
        },

        {
            type: 'list',
            message: 'What department does this role belong to?',
            name: 'roledept',
            choices: chooseDept()
        },
    ])

    .then (function(response) {
        // Ensures that all three questions have been answered properly before proceeding.
        let userRoleTitle = response.role;
        let deptId = chooseDept().indexOf(response.roledept) + 1;

        if (response.role === "") {
            console.log("The title of the role cannot be blank.");
            askAddRoleQuestions();
            return;
        } else if (response.rolesalary === "") {
            console.log("The salary cannot be blank.");
            askAddRoleQuestions();
            return;
        } else if (isNaN(response.rolesalary)) {
            console.log("Please enter a valid salary.");
            askAddRoleQuestions();
            return;
        } else if (response.roledept === "") {
            console.log("The department cannot be blank.");
            askAddRoleQuestions();
            return;
        } else {
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.role}", ${response.rolesalary}, ${deptId});`, (err, res) => {
                if (err) throw err;
            })
        }
        
        inquirer.prompt([
            {
                type: 'list',
                message: `You want to create a role named ${response.role}, which pays $${response.rolesalary} annually and belongs to the ${response.roledept} department. Is this correct?`,
                name: 'roleverify',
                choices: yesOrNo
            },
        ])

        .then (function(response) {
            if(response.roleverify === "Yes") {
                connection.query("SELECT id, title, salary FROM role", (err, res) => {
                    if (err) throw err;
                    console.log('\n', "The role has been added.");
                    console.table('\n', res);
                    askForAction();
                });
            } else {
                connection.query(`DELETE FROM role WHERE title = "${userRoleTitle}"`, (err, res) => {
                    if (err) throw err;
                    connection.query("SELECT id, title, salary FROM role", (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        console.log("The role has been deleted.");
                        askAddRoleQuestions();
                    });
                });
            }
        })
    })
}

// This function asks for relevant information about the employee being added to the database, and accounts for error handling

function askAddEmployeeQuestions() {
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'employeefirstname',
        },

        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'employeelastname',
        },

        {
            type: 'list',
            message: "What is the employee's role?",
            name: 'employeerole',
            choices: chooseRole()
        },

        {
            type: 'list',
            message: "Who is the employee's manager? If the employee has no manager, select the blank option.",
            name: 'employeemanager',
            choices: chooseManager()
        },
    ])

    // An employee is added if there are no errors; if the user changes their mind, the data is removed from the database

    .then (function(response) {
        let firstName = response.employeefirstname;
        let lastName = response.employeelastname;
        let roleId = chooseRole().indexOf(response.employeerole) + 1;
        
        // Since there is already one value in the manager array ("No Manager"), the indexes match up exactly with the IDs
        let managerId = chooseManager().indexOf(response.employeemanager);

        // Some employees do not have a manager, and this is accounted for in the data with this if statement
        if (response.employeemanager === "No Manager") {
            managerId = null;
        }

        if (response.employeefirstname === "") {
            console.log("The employee's first name cannot be blank.");
            askAddEmployeeQuestions();
            return;
        } else if (response.employeelastname === "") {
            console.log("The employee's last name cannot be blank.");
            askAddEmployeeQuestions();
            return;
        } else if (isNaN(response.employeerole === "")) {
            console.log("The employee's role cannot be blank.");
            askAddEmployeeQuestions();
            return;
        } else {
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.employeefirstname}", "${response.employeelastname}", ${roleId}, ${managerId});`, (err, res) => {
                if (err) throw err;
            })
        }

        inquirer.prompt([
            {
                type: 'list',
                message: `You want to add an employee named ${response.employeefirstname} ${response.employeelastname}, who works as a/an ${response.employeerole}. Is this correct?`,
                name: 'employeeverify',
                choices: yesOrNo
            },
        ])

        .then (function(response) {
            if(response.employeeverify === "Yes") {
                connection.query("SELECT first_name, last_name FROM employee", (err, res) => {
                    if (err) throw err;
                    console.log('\n', "The employee has been added.");
                    console.table('\n', res);
                    askForAction();
                });
            } else {
                connection.query(`DELETE FROM role WHERE first_name = "${firstName}" AND last_name = "${lastName}"`, (err, res) => {
                    if (err) throw err;
                    connection.query("SELECT id, title, salary FROM role", (err, res) => {
                        if (err) throw err;
                        console.log('\n', "The role has been deleted.");
                        console.table('\n', res);
                        askAddDepartmentQuestions();
                    });
                });
            }
        })
    })
}

// Advanced queries select exactly the data that should be displayed, in the correct order and with proper titles for each column

function askViewDepartmentQuestions() {
    connection.query("SELECT department.deptname AS 'Department', employee.first_name AS 'First Name', employee.last_name AS 'Last Name' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.deptname;", (err, res) => {
        if (err) throw err;
        console.log('\n','You are now viewing all departments.');
        console.table('\n', res);
        askForAction();
    });
}

function askViewRoleQuestions() {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS Title FROM employee JOIN role ON employee.role_id = role.id ORDER BY employee.last_name;", (err, res) => {
        if (err) throw err;
        console.log('\n','You are now viewing all roles.');
        console.table('\n', res);
        askForAction();
    });
}

function askViewEmployeeQuestions() {
    connection.query("SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', role.salary AS 'Salary (USD)', department.deptname AS 'Department', CONCAT(boss.first_name, ' ', boss.last_name) AS 'Manager' FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee boss ON employee.manager_id = boss.id ORDER BY employee.id;", (err, res) => {
        if (err) throw err;
        console.log('\n','You are now viewing all employees.');
        console.table('\n', res);
        askForAction();
    });
}

// This function updates a particular employee's role

function askUpdateEmployeeQuestions() {
    let allEmployees = [];

    connection.query("SELECT employee.id AS 'ID', employee.first_name, employee.last_name, role.title AS 'Title' FROM employee INNER JOIN role on role.id = employee.role_id ORDER BY employee.id;", (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee would you like to update?",
                name: 'employeeOfInterest',
                choices: function() {
                 
                    for (let i = 0; i < res.length; i++) {
                        allEmployees.push(`${res[i].first_name} ${res[i].last_name}`);
                    }

                    return allEmployees;
                }
            },
    
            {
                type: 'list',
                message: "What is the employee's new role?",
                name: 'newrole',
                choices: chooseRole()
            },
    
        ])

        .then (function(response) {
            let employeeId = allEmployees.indexOf(response.employeeOfInterest) + 1;
            let roleId = chooseRole().indexOf(response.newrole) + 1;
    
            connection.query(`UPDATE employee SET role_id = ${roleId} WHERE employee.id = ${employeeId};`, (err, res) => {
                if (err) throw err;
    
                connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS Title FROM employee JOIN role ON employee.role_id = role.id ORDER BY employee.last_name;", (err, res) => {
                    if (err) throw err;
                    console.log('\n', "The employee's role has been updated.");
                    console.table('\n', res);
                    askForAction();
                });
            })   
        })
    });
}

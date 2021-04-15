const inquirer = require('inquirer');
const mysql = require('mysql');
const dotenv = require('dotenv');
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

const actionOptions = ["Add a department", "Add a role", "Add an employee", "View a department", 
"View a role", "View an employee", "Update an employee's role", "Quit"];

const yesOrNo = ["Yes", "No"];

// This is the main menu

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
        } else if (response.action === "View a department") {
            askViewDepartmentQuestions();
        } else if (response.action === "View a role") {
            askViewRoleQuestions();
        } else if (response.action === "View an employee") {
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
                    console.log("The department has been added.");
                    console.table(res);
                    askForAction();
                });
            } else {
                connection.query(`DELETE FROM department WHERE deptname = "${userDept}"`, (err, res) => {
                    if (err) throw err;
                    console.log("The department has been deleted.");
                    connection.query("SELECT * FROM department", (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        askAddDepartmentQuestions();
                    });
                });
            }
        })
    })
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
            choices: departments
        },
    ])

    .then (function(response) {
        // Ensures that all three questions have been answered properly before proceeding.

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
            roles.push(response.role);
        }

        // The role is pushed to the roles array, and if it is incorrect, the pop() method removes it
        
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
                console.log ("Great! We will continue.");
                console.log(roles);
                askForAction();
            } else {
                roles.pop();
                askAddRoleQuestions();
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
            type: 'input',
            message: "What is the employee's role?",
            name: 'employeerole',
        },

        {
            type: 'input',
            message: "Who is the employee's manager? If the employee has no manager, leave this blank and hit enter.",
            name: 'employeemanager',
        },
    ])

    // An employee is added if there are no errors; if the user changes their mind, the pop() method removes it from the array

    .then (function(response) {
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
            employees.push(response.employeefirstname + " " + response.employeelastname);
            console.log(employees);
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
                console.log ("Great! We will continue.");
                askForAction();
            } else {
                employees.pop();
                askAddEmployeeQuestions();
            }
        })
    })
}

function askViewDepartmentQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which department would you like to view?',
            name: 'viewdepts',
            choices: departments
        },

    ])

    .then(function (response) {
        console.log(`Thanks for your feedback!`)
        askForAction();
    })
}

function askViewRoleQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which role would you like to view?',
            name: 'viewroles',
            choices: roles
        },
    ])

    .then(function (response) {
        console.log(`Thanks for your feedback!`)
        askForAction();
    })
}

function askViewEmployeeQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to view?',
            name: 'viewemployees',
            choices: employees
        },
    ])

    .then(function (response) {
        console.log(`Thanks for your feedback!`)
        askForAction();
    })
}

function askUpdateEmployeeQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'updateemployees',
            choices: employees
        },
    ])

    .then(function (response) {
        console.log(`Thanks for your feedback!`)
    })
}

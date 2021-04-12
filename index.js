const fs = require('fs');
const inquirer = require('inquirer');

const actionOptions = ["Add a department", "Add a role", "Add an employee", "View a department", "View a role", "View an employee", "Update an employee's role", "Quit"];

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
            return;
        }
    })
}

askForAction();

function askAddDepartmentQuestions() {
    console.log("You want to add a department.");

}

function askAddRoleQuestions() {
    console.log("You want to add a role.");
}

function askAddEmployeeQuestions() {
    console.log("You want to add an employee.");
}

function askViewDepartmentQuestions() {
    console.log("You want to view a department.");
}

function askViewRoleQuestions() {
    console.log("You want to view a role.");
}

function askViewEmployeeQuestions() {
    console.log("You want to view an employee.");
}

function askUpdateEmployeeQuestions() {
    console.log("You want to update an employee's role.");
}
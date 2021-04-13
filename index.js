const fs = require('fs');
const inquirer = require('inquirer');

// Answer lists are organized into arrays for easy access

const actionOptions = ["Add a department", "Add a role", "Add an employee", "View a department", 
"View a role", "View an employee", "Update an employee's role", "Quit"];

const yesOrNo = ["Yes", "No"];

// These arrays should be modified based on user responses and currently have placeholder data for testing purposes

const departments = ["Engineering", "Sales", "Marketing"];
const roles = ["Engineer", "Intern", "Manager"];
const employees = ["John Doe", "Jane Doe"];


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
            return;
        }
    })
}

// This is the function that will be called when the application is initially run (i.e. the main menu)
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

        if (response.department === "") {
            console.log("Your response cannot be blank.");
            askAddDepartmentQuestions();
            return;
        } else {
            departments.push(response.department);
        }

        inquirer.prompt([

            {
                type: 'list',
                message: `You want to create a department named ${response.department}. Is this correct?`,
                name: 'departmentverify',
                choices: yesOrNo
            },
        ])

        // The response is pushed to the array every time, but if it is incorrect, the pop() method will remove it

        .then (function(response) {
            if(response.departmentverify === "Yes") {
                console.log ("Great! We will continue.");
                askForAction();
            } else {
                departments.pop();
                askAddDepartmentQuestions();
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

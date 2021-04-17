DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;
USE employeesDB;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  deptname VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (deptname)
VALUES ("Engineering"), ("Sales"), ("Marketing"), ("Human Resources"), ("R&D");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 75000, 1), ("Sales Representative", 50000, 2), ("Marketing Manager", 45000, 3), ("Assistant", 48000, 4), ("Data Scientist", 85000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null), ("Jane", "Jones", 2, 1), ("Robert", "Pettingill", 3, 1), ("Sarah", "Hyssop", 4, 1), ("Kate", "Worthen", 5, 1);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

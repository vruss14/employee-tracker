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
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

INSERT INTO department (deptname)
VALUES ("Engineering"), ("Sales"), ("Marketing"), ("Human Resources"), ("R&D");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 75000, 100), ("Sales Representative", 50000, 200), ("Marketing Manager", 45000, 300), ("Assistant", 48000, 400), ("Data Scientist", 85000, 500);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 5, 2), ("Jane", "Jones", 10, 4), ("Robert", "Pettingill", 15, 6), ("Sarah", "Hyssop", 20, 8), ("Kate", "Worthen", 25, 10);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

USE employees_db;

INSERT INTO department (name)
VALUES ("sociology"),
        ("psychology");

INSERT INTO roles (title, salary, department_id)
VALUES ('professor', 650000, 1),
        ('adjunct', 25000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)   
VALUES ('John', 'Bogart', 1, NULL),
        ('Kristin', 'Richie', 2, NULL);     

      
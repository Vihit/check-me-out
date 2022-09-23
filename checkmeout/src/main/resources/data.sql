
INSERT INTO role (role,description,created_by,create_dt)
SELECT * FROM (SELECT 'ROLE_ADMIN','Administrator role for the Application','admin',current_timestamp) AS tmp
WHERE NOT EXISTS (
    SELECT role FROM role WHERE role = 'ROLE_ADMIN'
) LIMIT 1 ^;

INSERT INTO role (role,description,created_by,create_dt)
SELECT * FROM (SELECT 'ROLE_OPERATOR','Operator role for the Application','admin',current_timestamp) AS tmp
WHERE NOT EXISTS (
    SELECT role FROM role WHERE role = 'ROLE_OPERATOR'
) LIMIT 1 ^;

INSERT INTO role (role,description,created_by,create_dt)
SELECT * FROM (SELECT 'ROLE_SUPERVISOR','Supervisor role for the Application','admin',current_timestamp) AS tmp
WHERE NOT EXISTS (
    SELECT role FROM role WHERE role = 'ROLE_SUPERVISOR'
) LIMIT 1 ^;

INSERT INTO role (role,description,created_by,create_dt)
SELECT * FROM (SELECT 'ROLE_FACILITY_ADMIN','Facility Administrator role for the Application','admin',current_timestamp) AS tmp
WHERE NOT EXISTS (
    SELECT role FROM role WHERE role = 'ROLE_FACILITY_ADMIN'
) LIMIT 1 ^;

INSERT INTO role (role,description,created_by,create_dt)
SELECT * FROM (SELECT 'ROLE_SYSTEM_ADMIN','System Administrator role for the Application','admin',current_timestamp) AS tmp
WHERE NOT EXISTS (
    SELECT role FROM role WHERE role = 'ROLE_SYSTEM_ADMIN'
) LIMIT 1 ^;


INSERT INTO department (name,code,parent_id)
SELECT * FROM (SELECT 'AMNEAL','001',0) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM department WHERE name = 'AMNEAL'
) LIMIT 1 ^;


INSERT INTO user (username,password,first_name,date_of_birth,department_id,is_active,created_by,create_dt)
SELECT * FROM (SELECT 'admin' as username,'$2a$10$neAtxbkTe3P1lUkvghFG0e9tO7Lfx47i4wuvl/UJqPSqF5lvpgRBa','ADMIN' as fname,'1970-01-01',1,true,'admin',current_timestamp) AS tmp
WHERE NOT EXISTS (
    SELECT username FROM user WHERE username = 'admin'
) LIMIT 1 ^;


INSERT INTO user_role (user_id,role_id)
SELECT * FROM (SELECT 1 as user_id,1 as role_id) AS tmp
WHERE NOT EXISTS (
    SELECT role_id FROM user_role WHERE role_id = 1
) LIMIT 1 ^;

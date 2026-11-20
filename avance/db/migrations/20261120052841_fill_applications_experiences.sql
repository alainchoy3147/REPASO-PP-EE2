-- migrate:up

-- Modalidades (para el select de applications)
INSERT INTO modalities (id, name) VALUES
(1, 'Presencial'),
(2, 'Remoto'),
(3, 'Híbrido');

-- Jornadas (para el select de applications)
INSERT INTO workdays (id, name) VALUES
(1, 'Tiempo completo'),
(2, 'Medio tiempo'),
(3, 'Prácticas pre profesionales');

-- Empresas (usuarios con perfil Empresa: 11 a 15)
INSERT INTO enterprises (id, name, ruc, email, phone, website_url, description, address, picture_url, district_id, user_id, created, updated) VALUES
(1, 'Tech Solutions', '20123456781', 'contacto@techsolutions.com', '014567890', 'https://techsolutions.com', 'Desarrollo de software a medida.', 'Av. Primavera 123', NULL, 1, 11, NOW(), NOW()),
(2, 'Innovatech', '20123456782', 'hr@innovatech.io', '014567891', 'https://innovatech.io', 'Consultoría en innovación tecnológica.', 'Av. Larco 456', NULL, 2, 12, NOW(), NOW()),
(3, 'Global Dev', '20123456783', 'reclutamiento@globaldev.com', '014567892', 'https://globaldev.com', 'Fábrica de software internacional.', 'Calle Las Begonias 789', NULL, 3, 13, NOW(), NOW()),
(4, 'Data Systems', '20123456784', 'empleos@datasystems.pe', '014567893', 'https://datasystems.pe', 'Soluciones de datos y analítica.', 'Av. La Molina 321', NULL, 4, 14, NOW(), NOW()),
(5, 'SoftWorks', '20123456785', 'talento@softworks.com', '014567894', 'https://softworks.com', 'Desarrollo de aplicaciones móviles.', 'Av. Javier Prado 654', NULL, 5, 15, NOW(), NOW());

-- Convocatorias (applications)
INSERT INTO applications (id, title, description, benefits, functions, vacancies, created, published, email_notification, closed, salarry, is_draft, modality_id, sementer_id, district_id, workday_id, enterprise_id) VALUES
(1, 'Practicante de Desarrollo Web', 'Buscamos practicante con conocimientos de React.', 'Horario flexible, capacitaciones.', 'Desarrollar componentes en React.', 2, NOW(), '2026-11-01', TRUE, '2026-12-15', 1200.00, FALSE, 3, 3, 1, 3, 1),
(2, 'Analista de Datos Junior', 'Análisis de datos con SQL y Python.', 'Seguro EPS, bonos.', 'Crear reportes y dashboards.', 1, NOW(), '2026-11-03', FALSE, '2026-12-20', 2500.00, FALSE, 1, 4, 4, 1, 4),
(3, 'Desarrollador Backend Node.js', 'Desarrollo de APIs con Express y PostgreSQL.', 'Trabajo remoto.', 'Crear y mantener APIs REST.', 3, NOW(), '2026-11-05', TRUE, '2026-12-31', 3500.00, FALSE, 2, 4, 2, 1, 2),
(4, 'Practicante de QA', 'Pruebas manuales y automatizadas.', 'Capacitación en Cypress.', 'Ejecutar casos de prueba.', 2, NOW(), '2026-11-07', FALSE, '2026-12-10', 1025.00, FALSE, 1, 2, 3, 3, 3),
(5, 'Diseñador UI/UX', 'Diseño de interfaces en Figma.', 'Ambiente creativo.', 'Diseñar prototipos y flujos.', 1, NOW(), NULL, FALSE, NULL, 2800.00, TRUE, 3, 3, 5, 2, 5),
(6, 'Desarrollador Móvil Flutter', 'Desarrollo de apps móviles multiplataforma.', 'Laptop de la empresa.', 'Programar apps en Flutter.', 2, NOW(), '2026-11-10', TRUE, '2027-01-15', 3200.00, FALSE, 2, 4, 5, 1, 5),
(7, 'Soporte Técnico', 'Atención de incidencias de usuarios.', 'Horario de medio tiempo.', 'Resolver tickets de soporte.', 4, NOW(), '2026-11-12', FALSE, '2026-12-05', 1300.00, FALSE, 1, 1, 1, 2, 1),
(8, 'Practicante de Ciberseguridad', 'Apoyo en auditorías de seguridad.', 'Certificaciones pagadas.', 'Revisar vulnerabilidades.', 1, NOW(), NULL, FALSE, NULL, 1100.00, TRUE, 3, 2, 2, 3, 2);

-- Experiencias de los estudiantes
INSERT INTO experiences (id, name, enterprise, description, start_date, end_date, student_id) VALUES
(1, 'Practicante de Desarrollo', 'Tech Solutions', 'Desarrollo de páginas web con React.', '2025-01-15', '2025-07-15', 1),
(2, 'Asistente de Datos', 'Data Systems', 'Limpieza de datos y reportes en Excel.', '2025-03-01', '2025-09-01', 2),
(3, 'Diseñadora Freelance', 'Independiente', 'Diseño de interfaces para clientes.', '2024-06-01', NULL, 3),
(4, 'Practicante de Soporte', 'Innovatech', 'Soporte técnico a usuarios internos.', '2025-02-01', '2025-08-01', 4),
(5, 'Asistente de Proyectos', 'Global Dev', 'Seguimiento de tareas con Jira.', '2025-04-01', '2025-10-01', 5),
(6, 'Desarrollador Junior', 'SoftWorks', 'Mantenimiento de una app móvil.', '2025-05-15', NULL, 6),
(7, 'Practicante de QA', 'Global Dev', 'Pruebas manuales de software.', '2025-01-10', '2025-06-10', 11),
(8, 'Desarrolladora Frontend', 'Tech Solutions', 'Maquetación con HTML, CSS y React.', '2024-09-01', '2025-09-01', 9),
(9, 'Asistente de Marketing Digital', 'Innovatech', 'Gestión de redes sociales.', '2025-06-01', NULL, 15),
(10, 'Practicante de Backend', 'Data Systems', 'APIs con Node.js y PostgreSQL.', '2025-07-01', NULL, 18);

-- Ajustar los contadores de ids
SELECT setval(pg_get_serial_sequence('modalities', 'id'), (SELECT MAX(id) FROM modalities));
SELECT setval(pg_get_serial_sequence('workdays', 'id'), (SELECT MAX(id) FROM workdays));
SELECT setval(pg_get_serial_sequence('enterprises', 'id'), (SELECT MAX(id) FROM enterprises));
SELECT setval(pg_get_serial_sequence('applications', 'id'), (SELECT MAX(id) FROM applications));
SELECT setval(pg_get_serial_sequence('experiences', 'id'), (SELECT MAX(id) FROM experiences));

-- migrate:down

DELETE FROM experiences;
DELETE FROM applications;
DELETE FROM enterprises;
DELETE FROM workdays;
DELETE FROM modalities;

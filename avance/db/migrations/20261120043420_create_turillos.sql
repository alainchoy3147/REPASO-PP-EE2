-- migrate:up

-- Copia exacta de la tabla students (misma estructura)
CREATE TABLE turillos (
    id SERIAL PRIMARY KEY,
    names VARCHAR(45) NOT NULL,
    last_names VARCHAR(100) NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    phone VARCHAR(15),
    district_id INT REFERENCES districts(id) ON DELETE SET NULL,
    picture_url VARCHAR(100),
    summary TEXT,
    carrere_id INT REFERENCES carrers(id) ON DELETE SET NULL,
    sementer_id INT REFERENCES semesters(id) ON DELETE SET NULL,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Copia exacta de los datos de students
INSERT INTO turillos
SELECT * FROM students;

-- Ajustar el contador de ids al ultimo id copiado
SELECT setval(
    pg_get_serial_sequence('turillos', 'id'),
    (SELECT MAX(id) FROM turillos)
);

-- migrate:down

DROP TABLE IF EXISTS turillos;

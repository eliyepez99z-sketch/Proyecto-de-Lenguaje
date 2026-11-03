CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE estado_inscripcion AS ENUM ('activa', 'retirada', 'cancelada');
CREATE TYPE estado_sesion      AS ENUM ('programada', 'dictada', 'cancelada');
CREATE TYPE estado_asistencia  AS ENUM ('presente', 'ausente', 'justificado', 'tardanza');

CREATE TABLE asignatura (
    id                      SERIAL PRIMARY KEY,
    codigo                  VARCHAR(20)  NOT NULL UNIQUE,
    nombre                  VARCHAR(150) NOT NULL,
    creditos                SMALLINT     NOT NULL CHECK (creditos > 0),
    limite_inasistencia_pct NUMERIC(5,2) NOT NULL DEFAULT 25
                            CHECK (limite_inasistencia_pct BETWEEN 0 AND 100),
    tardanzas_por_ausencia  SMALLINT     NOT NULL DEFAULT 3
                            CHECK (tardanzas_por_ausencia >= 0),
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE aula (
    id         SERIAL PRIMARY KEY,
    codigo     VARCHAR(20)  NOT NULL UNIQUE,
    nombre     VARCHAR(100) NOT NULL,
    capacidad  SMALLINT     NOT NULL CHECK (capacidad > 0),
    activa     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE periodo (
    id           SERIAL PRIMARY KEY,
    nombre       VARCHAR(50) NOT NULL UNIQUE,
    fecha_inicio DATE        NOT NULL,
    fecha_fin    DATE        NOT NULL,
    activo       BOOLEAN     NOT NULL DEFAULT FALSE,
    CHECK (fecha_fin > fecha_inicio)
);

CREATE UNIQUE INDEX uq_periodo_activo ON periodo (activo) WHERE activo;

CREATE TABLE seccion (
    id                   SERIAL PRIMARY KEY,
    asignatura_id        INT          NOT NULL REFERENCES asignatura(id),
    periodo_id           INT          NOT NULL REFERENCES periodo(id),
    codigo               VARCHAR(20)  NOT NULL,
    profesor_externo_id  VARCHAR(64),
    cupo                 SMALLINT     NOT NULL CHECK (cupo > 0),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (asignatura_id, periodo_id, codigo)
);

CREATE INDEX idx_seccion_profesor ON seccion (profesor_externo_id);

CREATE TABLE horario (
    id                   SERIAL PRIMARY KEY,
    seccion_id           INT      NOT NULL REFERENCES seccion(id) ON DELETE CASCADE,
    aula_id              INT      NOT NULL REFERENCES aula(id),
    profesor_externo_id  VARCHAR(64),
    dia_semana           SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio          TIME     NOT NULL,
    hora_fin             TIME     NOT NULL,
    CHECK (hora_fin > hora_inicio),
    rango_horas int4range GENERATED ALWAYS AS (
        int4range(
            (EXTRACT(HOUR FROM hora_inicio)::int * 60 + EXTRACT(MINUTE FROM hora_inicio)::int),
            (EXTRACT(HOUR FROM hora_fin)::int    * 60 + EXTRACT(MINUTE FROM hora_fin)::int)
        )
    ) STORED,
    CONSTRAINT no_cruce_aula EXCLUDE USING gist (
        aula_id WITH =, dia_semana WITH =, rango_horas WITH &&
    ),
    CONSTRAINT no_cruce_seccion EXCLUDE USING gist (
        seccion_id WITH =, dia_semana WITH =, rango_horas WITH &&
    ),
    CONSTRAINT no_cruce_profesor EXCLUDE USING gist (
        profesor_externo_id WITH =, dia_semana WITH =, rango_horas WITH &&
    )
);

CREATE INDEX idx_horario_seccion ON horario (seccion_id);
CREATE INDEX idx_horario_aula    ON horario (aula_id);

CREATE OR REPLACE FUNCTION fn_horario_set_profesor() RETURNS trigger AS $$
BEGIN
    SELECT profesor_externo_id INTO NEW.profesor_externo_id
    FROM seccion WHERE id = NEW.seccion_id;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_horario_set_profesor
BEFORE INSERT OR UPDATE OF seccion_id ON horario
FOR EACH ROW EXECUTE FUNCTION fn_horario_set_profesor();

CREATE OR REPLACE FUNCTION fn_seccion_sync_profesor() RETURNS trigger AS $$
BEGIN
    IF NEW.profesor_externo_id IS DISTINCT FROM OLD.profesor_externo_id THEN
        UPDATE horario SET profesor_externo_id = NEW.profesor_externo_id
        WHERE seccion_id = NEW.id;
    END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_seccion_sync_profesor
AFTER UPDATE OF profesor_externo_id ON seccion
FOR EACH ROW EXECUTE FUNCTION fn_seccion_sync_profesor();

CREATE TABLE inscripcion (
    id                    SERIAL PRIMARY KEY,
    seccion_id            INT         NOT NULL REFERENCES seccion(id),
    estudiante_externo_id VARCHAR(64) NOT NULL,
    estado                estado_inscripcion NOT NULL DEFAULT 'activa',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (seccion_id, estudiante_externo_id)
);

CREATE INDEX idx_inscripcion_estudiante ON inscripcion (estudiante_externo_id);

CREATE TABLE sesion (
    id          SERIAL PRIMARY KEY,
    seccion_id  INT         NOT NULL REFERENCES seccion(id) ON DELETE CASCADE,
    horario_id  INT         REFERENCES horario(id) ON DELETE SET NULL,
    fecha       DATE        NOT NULL,
    hora_inicio TIME        NOT NULL,
    hora_fin    TIME        NOT NULL,
    estado      estado_sesion NOT NULL DEFAULT 'programada',
    CHECK (hora_fin > hora_inicio),
    UNIQUE (seccion_id, fecha, hora_inicio)
);

CREATE INDEX idx_sesion_seccion_fecha ON sesion (seccion_id, fecha);

CREATE TABLE asistencia (
    id                    SERIAL PRIMARY KEY,
    sesion_id             INT         NOT NULL REFERENCES sesion(id) ON DELETE CASCADE,
    estudiante_externo_id VARCHAR(64) NOT NULL,
    estado                estado_asistencia NOT NULL,
    observacion           VARCHAR(255),
    registrada_por        VARCHAR(64) NOT NULL,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_asistencia_sesion_estudiante UNIQUE (sesion_id, estudiante_externo_id)
);

CREATE INDEX idx_asistencia_estudiante ON asistencia (estudiante_externo_id);

CREATE TABLE alerta (
    id              SERIAL PRIMARY KEY,
    inscripcion_id  INT          NOT NULL REFERENCES inscripcion(id) ON DELETE CASCADE,
    porcentaje      NUMERIC(5,2) NOT NULL,
    fecha           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    leida           BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_alerta_inscripcion UNIQUE (inscripcion_id)
);

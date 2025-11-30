-- Tabela: espaco
CREATE TABLE IF NOT EXISTS espaco (
  id INT NOT NULL AUTO_INCREMENT,
  dimensao VARCHAR(50) NOT NULL,
  data_aquisicao DATE DEFAULT NULL,
  id_utente INT DEFAULT NULL,
  id_reserva INT DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE (id_utente, id_reserva),
  FOREIGN KEY (id_utente) REFERENCES utente(id),
  FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);

INSERT INTO espaco (id, dimensao, data_aquisicao, id_utente, id_reserva) VALUES
(29,'30x30','2025-11-27',1,1),
(30,'30x30','2025-11-27',4,1),
(32,'25x30','2025-11-27',3,2),
(33,'25x30','2025-11-27',5,2),
(34,'20x20','2025-11-27',6,6);


-- Tabela: reserva
CREATE TABLE IF NOT EXISTS reserva (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO reserva (id, nome) VALUES
(1,'Catapa'),
(2,'Kilumosso'),
(6,'Kindenuco');


-- Tabela: utente
CREATE TABLE IF NOT EXISTS utente (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  telemovel VARCHAR(50) NOT NULL,
  bi VARCHAR(50) NOT NULL,
  endereco VARCHAR(50) NOT NULL,
  data_nascimento DATE DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE (bi)
);

INSERT INTO utente (id, nome, telemovel, bi, endereco, data_nascimento) VALUES
(1,'Ana Maria','925323382','006202586LA049','Uige, Papelão','2000-03-01'),
(3,'João Paulo','934542233','00234556LA023','Uige, Papelão','1994-11-02'),
(4,'Isabel Malungo','923448776','004267378UE023','Uige, Catapa','1999-06-09'),
(5,'Rosa Lopes','928688733','004375477LA043','Uige, Candombe','2004-06-02'),
(6,'Massamba Morais','949214357','006132487UE046','Uige, Kakiuia','1997-06-01'),
(7,'Fani Katombi','987654442','003245647LA045','Uige, Popular','2001-02-14');


-- Tabela: utilizador
CREATE TABLE IF NOT EXISTS utilizador (
  id INT NOT NULL AUTO_INCREMENT,
  utilizador VARCHAR(100) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  nivel ENUM('admin','usuario') DEFAULT 'usuario',
  PRIMARY KEY (id),
  UNIQUE (utilizador)
);

INSERT INTO utilizador (id, utilizador, senha, nivel) VALUES
(1,'Jose','$2a$10$KKgy64sTkWE1Y8nA3veThOGO5dzcAvq42IiVi1YFzfL1PW9D3WtCq','admin'),
(2,'Massamba','$2a$10$xJO/wVgak7cHDIskzTITC.5/VEfvNIuj0iet4MNiaRLFtV51Z1daq','usuario');


-- View: ver_espacos
CREATE OR REPLACE VIEW ver_espacos AS
SELECT
  e.id,
  e.dimensao,
  e.data_aquisicao,
  e.id_utente,
  e.id_reserva,
  u.nome AS utente,
  u.bi,
  u.telemovel,
  u.endereco,
  r.nome AS reserva
FROM espaco e
JOIN utente u ON e.id_utente = u.id
JOIN reserva r ON e.id_reserva = r.id
ORDER BY e.data_aquisicao, u.nome;


-- View: ver_reservas
CREATE OR REPLACE VIEW ver_reservas AS
SELECT
  r.id,
  r.nome,
  COUNT(e.id) AS utentes
FROM reserva r
LEFT JOIN espaco e ON r.id = e.id_reserva
GROUP BY r.id, r.nome;


-- View: ver_utentes_sem_espaco
CREATE OR REPLACE VIEW ver_utentes_sem_espaco AS
SELECT
  u.id,
  u.nome,
  u.telemovel,
  u.bi,
  u.endereco
FROM utente u
LEFT JOIN espaco e ON u.id = e.id_utente
WHERE e.id IS NULL
ORDER BY u.nome;

INSERT INTO carte (nom_carte)
VALUES ('Moins de 26ans');
INSERT INTO carte (nom_carte)
VALUES ('Carte Etudiant');
INSERT INTO carte (nom_carte)
VALUES ('Navigo Imagine R');

CREATE TABLE IF NOT EXISTS activte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    categorie_id INT NOT NULL,
    lieu VARCHAR(100),
    tarif_plein DECIMAL(5, 2),
    tarif_reduit DECIMAL(5, 2),
    carte_requise_id INT NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categorie(id),
    FOREIGN KEY (carte_requise_id) REFERENCES carte(id))

ALTER TABLE activite
MODIFY code_postal VARCHAR(5);
ALTER TABLE activite
    RENAME COLUMN lieu TO code_postal;
INSERT INTO activite (
        nom,
        categorie_id,
        code_postal,
        tarif_plein,
        tarif_reduit,
        carte_requise_id
    )
VALUES ('Musée du Louvre', 1, 75001, 22.00, 0, 1)
ALTER TABLE activite
MODIFY code_postal VARCHAR(5) NOT NULL;
ALTER TABLE activite
MODIFY tarif_plein DECIMAL(5, 2) NOT NULL;
ALTER TABLE activite
MODIFY tarif_reduit DECIMAL(5, 2) NOT NULL;

INSERT INTO activite (
        nom,
        categorie_id,
        code_postal,
        tarif_plein,
        tarif_reduit,
        carte_requise_id
    )
VALUES ('Musée Rodin', 1, 75007, 22.00, 0, 1)

SELECT * FROM activite;

UPDATE activite
SET tarif_plein = 15 
WHERE nom = "Musée Rodin"

INSERT INTO carte (nom) VALUES ("18-25 ans (ressortissantss de l'UE)");

UPDATE carte 
SET nom = "18-25 ans (ressortissant de l'UE)"
WHERE id = 4;

SELECT * FROM carte;
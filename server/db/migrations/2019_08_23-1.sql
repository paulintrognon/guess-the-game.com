/* Création de la nouvelle colonne approvalStatus */
ALTER TABLE `Screenshots`
  ADD `approvalStatusNew`
  ENUM('waiting','approved','refused') NOT NULL DEFAULT 'waiting'
  AFTER `approvalStatus`;

/* Remplissage de la colonne approvalStatus */
UPDATE `Screenshots`
  SET `Screenshots`.`approvalStatusNew` = (
    CASE
      WHEN `Screenshots`.`approvalStatus` = 1 THEN 'approved'
      WHEN `Screenshots`.`approvalStatus` = -1 THEN 'refused'
      ELSE 'waiting'
    END
  );

/* Suppression de l'ancienne colonne */
ALTER TABLE `Screenshots` DROP `approvalStatus`;

/* On renomme approvalStatusNew => approvalStatus */
ALTER TABLE `Screenshots`
  CHANGE `approvalStatusNew` `approvalStatus`
  ENUM('waiting','approved','refused') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'waiting';

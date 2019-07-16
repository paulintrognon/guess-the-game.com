/* Création de la table ScreenshotImages */
CREATE TABLE
  `ScreenshotImages`
  (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `ScreenshotId` INT NULL DEFAULT NULL,
    `cloudId` VARCHAR(80) NOT NULL ,
    `version` VARCHAR(20) NOT NULL ,
    `path` VARCHAR(100) NOT NULL ,
    PRIMARY KEY (`id`)
  )
  ENGINE = InnoDB;

/* Remplissage de la table ScreenshotImages */
INSERT INTO `ScreenshotImages` (`ScreenshotId`, `cloudId`, `version`, `path`)
  SELECT
    `Screenshots`.`id` as `ScreenshotId`,
    SUBSTR(`Screenshots`.`imagePath`,13,40) as `cloudId`,
    SUBSTR(`Screenshots`.`imagePath`,2,10) as `version`,
    `Screenshots`.`imagePath` as `path`
  FROM
    `Screenshots`
  WHERE
    `Screenshots`.`imagePath` LIKE "%/prod/%";

/* Ajout du lien entre Screenshots et ScreenshotImages */
ALTER TABLE `ScreenshotImages`
  ADD FOREIGN KEY (`ScreenshotId`) REFERENCES `Screenshots`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Screenshots`
  ADD `ScreenshotImageId` INT NULL DEFAULT NULL AFTER `gameCanonicalName`;
ALTER TABLE `Screenshots`
  ADD FOREIGN KEY (`ScreenshotImageId`) REFERENCES `ScreenshotImages`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

/* Remplissage des ScreenshotImageId la table Screenshots */
UPDATE `Screenshots`
  JOIN `ScreenshotImages` ON `Screenshots`.`imagePath` = `ScreenshotImages`.`path`
  SET `Screenshots`.`ScreenshotImageId` = `ScreenshotImages`.`id`;

/* On change Screenshots_ibfk_1 pour que si un user est supprimé, ses screenshots restent */
ALTER TABLE `Screenshots` DROP FOREIGN KEY `Screenshots_ibfk_1`;
ALTER TABLE `Screenshots` ADD CONSTRAINT `Screenshots_ibfk_1`
  FOREIGN KEY (`UserId`) REFERENCES `Users`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

/* On change Screenshots_ibfk_2 pour que si un modérator est supprimé, ses screenshots restent */
ALTER TABLE `Screenshots` DROP FOREIGN KEY `Screenshots_ibfk_2`;
ALTER TABLE `Screenshots` ADD CONSTRAINT `Screenshots_ibfk_2`
  FOREIGN KEY (`moderatedBy`) REFERENCES `Users`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

/* On supprime l'imagePath, maintenant inutile */
ALTER TABLE `Screenshots` DROP `imagePath`;

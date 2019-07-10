ALTER TABLE `Screenshots`
  ADD `moderatedAt` DATETIME NULL DEFAULT NULL AFTER `moderatedBy`;

UPDATE `Screenshots`
  SET `Screenshots`.`moderatedAt` = `Screenshots`.`createdAt`;

UPDATE `Screenshots`
  SET `Screenshots`.`moderatedBy` = 1
  WHERE `Screenshots`.`moderatedBy` = 0;

ALTER TABLE `Screenshots`
  ADD CONSTRAINT `Screenshots_ibfk_2`
  FOREIGN KEY (`moderatedBy`) REFERENCES `Users`(`id`)
  ON DELETE CASCADE
  ON UPDATE SET NULL;

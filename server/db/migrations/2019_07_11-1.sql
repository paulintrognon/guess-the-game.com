/* Add Screenshots.moderatedAt */
ALTER TABLE `Screenshots`
  ADD `moderatedAt` DATETIME NULL DEFAULT NULL AFTER `moderatedBy`;

UPDATE `Screenshots`
  SET `Screenshots`.`moderatedAt` = `Screenshots`.`createdAt`;

/* Better Screenshots.moderatedBy */
UPDATE `Screenshots`
  SET `Screenshots`.`moderatedBy` = 1
  WHERE `Screenshots`.`moderatedBy` = 0;

ALTER TABLE `Screenshots`
  ADD CONSTRAINT `Screenshots_ibfk_2`
  FOREIGN KEY (`moderatedBy`) REFERENCES `Users`(`id`)
  ON DELETE CASCADE
  ON UPDATE SET NULL;


/* Replace Users.emailUpdateLastScreenshotId by Users.emailUpdateLastScreenshotDate */
ALTER TABLE `Users`
  ADD `emailUpdateLastScreenshotDate` DATETIME NULL DEFAULT NULL AFTER `emailUpdateLastScreenshotId`;

UPDATE `Users`
  INNER JOIN `Screenshots`
  ON `Users`.`emailUpdateLastScreenshotId` = `Screenshots`.`id`
  SET `Users`.`emailUpdateLastScreenshotDate` = `Screenshots`.`createdAt`;

ALTER TABLE `Users` DROP `emailUpdateLastScreenshotId`;

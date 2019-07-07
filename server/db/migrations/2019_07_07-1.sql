ALTER TABLE `Users`
  ADD `emailUpdates`
    ENUM('asap','daily','weekly','never') NULL DEFAULT NULL AFTER `canModerateScreenshots`,
  ADD `emailUpdateLastScreenshotId`
    INT UNSIGNED NULL DEFAULT NULL AFTER `emailUpdates`;

UPDATE `Users`
  SET `Users`.`emailUpdateLastScreenshotId` = (
    SELECT MAX(id) FROM `Screenshots` WHERE `Screenshots`.`approvalStatus` = 1
  );

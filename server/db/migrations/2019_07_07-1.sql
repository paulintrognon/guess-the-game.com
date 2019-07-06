ALTER TABLE `Users`
  ADD `emailUpdates`
    ENUM('asap','daily','weekly') NULL DEFAULT NULL AFTER `canModerateScreenshots`,
  ADD `emailUpdateLastScreenshotId`
    INT UNSIGNED NULL DEFAULT NULL AFTER `emailUpdates`;

RENAME TABLE `ScreenshotFounds` TO `SolvedScreenshots`;
ALTER TABLE `Users` CHANGE `screenshotsFound` `solvedScreenshots` INT(11) NOT NULL DEFAULT '0';
ALTER TABLE `Users` CHANGE `screenshotsAdded` `addedScreenshots` INT(11) NOT NULL DEFAULT '0';

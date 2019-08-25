ALTER TABLE `SolvedScreenshots` CHANGE `UserId` `UserId` INT(11) NULL DEFAULT NULL AFTER `id`;
ALTER TABLE `SolvedScreenshots` CHANGE `ScreenshotId` `ScreenshotId` INT(11) NULL DEFAULT NULL AFTER `UserId`;

CREATE TABLE `ViewedScreenshots` (
  `id` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `ScreenshotId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

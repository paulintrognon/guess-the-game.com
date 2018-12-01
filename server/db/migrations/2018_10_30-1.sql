ALTER TABLE `Screenshots` ADD `rating` FLOAT DEFAULT NULL AFTER `approvalStatus`;

CREATE TABLE `ScreenshotRatings` (
  `id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `ScreenshotId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `ScreenshotRatings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ScreenshotId` (`ScreenshotId`),
  ADD KEY `UserId` (`UserId`);

ALTER TABLE `ScreenshotRatings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ScreenshotRatings`
  ADD CONSTRAINT `ScreenshotRatings_ibfk_1` FOREIGN KEY (`ScreenshotId`) REFERENCES `Screenshots` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ScreenshotRatings_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

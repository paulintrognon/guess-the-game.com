ALTER TABLE `SolvedScreenshots` CHANGE `UserId` `UserId` INT(11) NULL DEFAULT NULL AFTER `id`;
ALTER TABLE `SolvedScreenshots` CHANGE `ScreenshotId` `ScreenshotId` INT(11) NULL DEFAULT NULL AFTER `UserId`;

/* Création de la table */
CREATE TABLE `ViewedScreenshots` (
  `id` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `ScreenshotId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `ViewedScreenshots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ScreenshotId` (`ScreenshotId`),
  ADD KEY `UserId` (`UserId`);


ALTER TABLE `ViewedScreenshots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3211;

ALTER TABLE `ViewedScreenshots`
  ADD CONSTRAINT `ViewedScreenshots_ibfk_1`
    FOREIGN KEY (`ScreenshotId`) REFERENCES `Screenshots` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  ADD CONSTRAINT `ViewedScreenshots_ibfk_2`
    FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

/* On la remplie avec les screenshots déjà trouvées */
INSERT INTO `ViewedScreenshots` (`ScreenshotId`, `UserId`, `createdAt`, `updatedAt`)
  SELECT
    `SolvedScreenshots`.`ScreenshotId` as `ScreenshotId`,
    `SolvedScreenshots`.`UserId` as `UserId`,
    `SolvedScreenshots`.`createdAt` as `createdAt`,
    `SolvedScreenshots`.`createdAt` as `updatedAt`
  FROM
    `SolvedScreenshots`;

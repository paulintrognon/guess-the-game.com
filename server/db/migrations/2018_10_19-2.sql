ALTER TABLE `Screenshots` ADD `isApproved` TINYINT NOT NULL DEFAULT '0' AFTER `UserId`, ADD `moderatedBy` INT NOT NULL AFTER `isApproved`;
ALTER TABLE `Screenshots` ADD KEY `moderatedBy` (`moderatedBy`);
ALTER TABLE `Users` ADD `canModerateScreenshots` TINYINT NOT NULL DEFAULT '0' AFTER `addedScreenshots`;

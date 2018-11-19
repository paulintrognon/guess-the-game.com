ALTER TABLE `Screenshots` ADD `isApproved` TINYINT NOT NULL DEFAULT '0' AFTER `UserId`, ADD `approvedByUserId` INT NOT NULL AFTER `isApproved`;
ALTER TABLE `Screenshots` ADD KEY `approvedByUserId` (`approvedByUserId`);
ALTER TABLE `Users` ADD `canModerateScreenshots` TINYINT NOT NULL DEFAULT '0' AFTER `addedScreenshots`;

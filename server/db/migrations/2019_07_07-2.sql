UPDATE `Users`
  SET `Users`.`emailUpdates` = 'weekly';

ALTER TABLE `Users`
  CHANGE `emailUpdates` `emailUpdates` ENUM('asap','daily','weekly','never') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'weekly';

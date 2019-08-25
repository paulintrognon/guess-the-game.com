-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Mar 07 Août 2018 à 23:53
-- Version du serveur :  10.1.26-MariaDB-0+deb9u1
-- Version de PHP :  7.0.30-0+deb9u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `guessthegame`
--

-- --------------------------------------------------------

--
-- Structure de la table `ScreenshotFounds`
--

CREATE TABLE `ScreenshotFounds` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ScreenshotId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `ScreenshotNames`
--

CREATE TABLE `ScreenshotNames` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `dm1` varchar(255) NOT NULL,
  `dm2` varchar(255) NOT NULL,
  `ScreenshotId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Screenshots`
--

CREATE TABLE `Screenshots` (
  `id` int(11) NOT NULL,
  `gameCanonicalName` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `screenshotsFound` int(11) NOT NULL DEFAULT '0',
  `screenshotsAdded` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `ScreenshotFounds`
--
ALTER TABLE `ScreenshotFounds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ScreenshotId` (`ScreenshotId`),
  ADD KEY `UserId` (`UserId`);

--
-- Index pour la table `ScreenshotNames`
--
ALTER TABLE `ScreenshotNames`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ScreenshotId` (`ScreenshotId`);

--
-- Index pour la table `Screenshots`
--
ALTER TABLE `Screenshots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `ScreenshotFounds`
--
ALTER TABLE `ScreenshotFounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ScreenshotNames`
--
ALTER TABLE `ScreenshotNames`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Screenshots`
--
ALTER TABLE `Screenshots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `ScreenshotFounds`
--
ALTER TABLE `ScreenshotFounds`
  ADD CONSTRAINT `ScreenshotFounds_ibfk_1` FOREIGN KEY (`ScreenshotId`) REFERENCES `Screenshots` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ScreenshotFounds_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ScreenshotNames`
--
ALTER TABLE `ScreenshotNames`
  ADD CONSTRAINT `ScreenshotNames_ibfk_1` FOREIGN KEY (`ScreenshotId`) REFERENCES `Screenshots` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `Screenshots`
--
ALTER TABLE `Screenshots`
  ADD CONSTRAINT `Screenshots_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

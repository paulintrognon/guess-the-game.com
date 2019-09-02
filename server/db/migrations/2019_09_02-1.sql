ALTER TABLE `Screenshots`
  CHANGE `refusalReason` `refusalReason`
  ENUM(
    'alreadySubmitted',
    'badQuality',
    'existsInGoogleImage',
    'gameNotFamousEnough',
    'notAGame',
    'tooMuchOfThisGame',
    'scoreTooLow',
    'spam',
    'other')
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
  NULL DEFAULT NULL;

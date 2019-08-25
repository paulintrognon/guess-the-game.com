ALTER TABLE `Screenshots`
  ADD `refusalReason`
  ENUM(
    'alreadySubmitted',
    'badQuality',
    'existsInGoogleImage',
    'gameNotFamousEnough',
    'notAGame',
    'tooMuchOfThisGame',
    'spam',
    'other'
    ) NULL DEFAULT NULL AFTER `approvalStatus`;

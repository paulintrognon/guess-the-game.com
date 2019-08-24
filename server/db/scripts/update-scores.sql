UPDATE
    Users
    LEFT JOIN (
        SELECT
        	Screenshots.UserId,
            COUNT(Screenshots.id) AS `nbAdded`
        FROM
            Screenshots
        WHERE
            Screenshots.approvalStatus = 'approved'
        GROUP BY
            Screenshots.UserId
    ) AS s ON
        Users.id = s.UserId
SET
    Users.addedScreenshots = s.`nbAdded`
    WHERE s.`nbAdded` IS NOT NULL;

UPDATE
    Users
    LEFT JOIN (
        SELECT
        	SolvedScreenshots.UserId,
          COUNT(SolvedScreenshots.id) AS `nbSolved`
        FROM
            SolvedScreenshots
        GROUP BY
            SolvedScreenshots.UserId
    ) AS s ON
        Users.id = s.UserId
SET
    Users.solvedScreenshots = s.`nbSolved`
    WHERE s.`nbSolved` IS NOT NULL;

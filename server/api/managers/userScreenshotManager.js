const db = require('../../db/db');

module.exports = {
  getScores,
  getAddedScreenshots,
};

async function getScores({ totalNbScreenshots }) {
  return db.sequelize.query(
    `
    SELECT
      username,
      solvedScreenshots AS nbSolvedScreenshots,
      addedScreenshots AS nbAddedScreenshots,
      (solvedScreenshots + addedScreenshots) AS score,
      (solvedScreenshots + addedScreenshots) / :totalNbScreenshots AS completeness,
      COUNT (
        IF(
          Screenshots.deletedAt IS NULL
          AND Screenshots.approvalStatus = 'approved'
          AND Screenshots.rating IS NOT NULL
          ,1,NULL
        )
      ) as nbRatedScreenshots,
      AVG(
        CASE
          WHEN Screenshots.deletedAt IS NULL AND Screenshots.approvalStatus = 'approved'
          THEN Screenshots.rating ELSE NULL END
        ) AS averageUploadScore,
      (
        SELECT MAX(SolvedScreenshots.id)
        FROM SolvedScreenshots
        WHERE SolvedScreenshots.UserId = Screenshots.UserId
      ) AS lastScreenshotFound
    FROM
      Users
    LEFT JOIN
      Screenshots ON Screenshots.UserId = Users.id
    WHERE
      username IS NOT NULL
      AND Users.deletedAt IS NULL
    GROUP BY username
    ORDER BY
      score DESC,
      lastScreenshotFound ASC
    LIMIT 100`,
    {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { totalNbScreenshots },
    }
  );
}

async function getAddedScreenshots(userId, params) {
  const { limit, offset, searchText, approvalStatus } = params || {};

  const { count, rows } = await db.Screenshot.findAndCountAll({
    attributes: [
      'id',
      'gameCanonicalName',
      'approvalStatus',
      'refusalReason',
      'year',
      'createdAt',
      'ScreenshotImageId',
    ],
    where: {
      UserId: userId,
      ...(approvalStatus && { approvalStatus }),
      ...(searchText && {
        [db.Sequelize.Op.or]: [
          {
            id: { [db.Sequelize.Op.like]: `${searchText}%` },
          },
          {
            gameCanonicalName: {
              [db.Sequelize.Op.like]: `%${searchText}%`,
            },
          },
        ],
      }),
    },
    offset: offset || 0,
    limit: limit || 100,
    order: [['createdAt', 'DESC']],
    include: [
      { model: db.ScreenshotName, attributes: ['name'] },
      { model: db.ScreenshotImage, attributes: ['path'] },
    ],
    distinct: true,
  });
  return {
    total: count,
    screenshots: rows.map(screenshot => ({
      id: screenshot.id,
      gameCanonicalName: screenshot.gameCanonicalName,
      alternativeNames: screenshot.ScreenshotNames.map(
        name => name.name
      ).filter(name => name !== screenshot.gameCanonicalName),
      year: screenshot.year,
      imageUrl: screenshot.ScreenshotImage.thumbUrl,
      createdAt: screenshot.createdAt,
      approvalStatus: screenshot.approvalStatus,
      refusalReason: screenshot.refusalReason,
    })),
  };
}

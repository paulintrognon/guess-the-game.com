module.exports = (sequelize, DataTypes) => {
  const Screenshot = sequelize.define(
    'Screenshot',
    {
      gameCanonicalName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approvalStatus: {
        type: DataTypes.ENUM('waiting', 'approved', 'refused'),
        defaultValue: 'waiting',
        allowNull: false,
      },
      refusalReason: {
        type: DataTypes.ENUM(
          'alreadySubmitted',
          'badQuality',
          'existsInGoogleImage',
          'gameNotFamousEnough',
          'notAGame',
          'tooMuchOfThisGame',
          'scoreTooLow',
          'spam',
          'other'
        ),
        allowNull: true,
        defaultValue: null,
      },

      rating: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      moderatedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Screenshot.associate = models => {
    models.Screenshot.hasMany(models.ScreenshotName);
    models.Screenshot.hasMany(models.SolvedScreenshot);
    models.Screenshot.hasMany(models.ViewedScreenshot);
    models.Screenshot.hasMany(models.ScreenshotRating);
    models.Screenshot.belongsTo(models.ScreenshotImage);
    models.Screenshot.belongsTo(models.User, { onDelete: 'SET NULL' });
    models.Screenshot.belongsTo(models.User, {
      as: 'ModeratorUser',
      foreignKey: 'moderatedBy',
    });
  };

  return Screenshot;
};

module.exports = (sequelize, DataTypes) => {
  const ScreenshotName = sequelize.define(
    'ScreenshotRating',
    {
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      paranoid: false,
    }
  );

  ScreenshotName.associate = models => {
    models.ScreenshotName.belongsTo(models.Screenshot, { onDelete: 'CASCADE' });
    models.SolvedScreenshot.belongsTo(models.Screenshot, {
      onDelete: 'CASCADE',
    });
  };

  return ScreenshotName;
};

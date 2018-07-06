module.exports = sequelize => {
  const ScreenshotFound = sequelize.define(
    'ScreenshotFound',
    {},
    {
      timestamps: true,
      paranoid: false,
    }
  );

  ScreenshotFound.associate = models => {
    models.ScreenshotFound.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return ScreenshotFound;
};

module.exports = (sequelize, DataTypes) => {
  const ScreenshotName = sequelize.define(
    'ScreenshotName',
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,
    }
  );

  ScreenshotName.associate = models => {
    models.ScreenshotName.belongsTo(models.Screenshot, { onDelete: 'CASCADE' });
  };

  return ScreenshotName;
};

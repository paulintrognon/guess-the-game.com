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
      imageUrl: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Screenshot.associate = models => {
    models.Screenshot.hasMany(models.ScreenshotName);
    models.Screenshot.hasMany(models.ScreenshotFound);
    models.Screenshot.belongsTo(models.User, { onDelete: 'CASCADE' });
  };

  return Screenshot;
};

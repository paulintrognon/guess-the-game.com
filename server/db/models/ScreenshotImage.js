const cloudinaryService = require('../../api/services/cloudinaryService');

module.exports = (sequelize, DataTypes) => {
  const ScreenshotImage = sequelize.define(
    'ScreenshotImage',
    {
      cloudId: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
        allowNull: false,
      },
    },
    {
      timestamps: false,
      paranoid: false,

      getterMethods: {
        url() {
          return cloudinaryService.pathToUrl(this.path);
        },
      },
    }
  );

  ScreenshotImage.associate = models => {
    models.ScreenshotImage.hasOne(models.Screenshot, {
      onDelete: 'SET NULL',
    });
  };

  return ScreenshotImage;
};

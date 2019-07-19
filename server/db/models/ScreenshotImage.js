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
        thumbUrl() {
          return cloudinaryService.pathToUrl(this.path, { thumb: true });
        },
      },
    }
  );

  ScreenshotImage.associate = models => {
    models.ScreenshotImage.belongsTo(models.Screenshot);
  };

  return ScreenshotImage;
};

module.exports = (sequelize, DataTypes) => {
  const ScreenshotName = sequelize.define(
    'ScreenshotName',
    {
      name: {
        type: DataTypes.STRING,
        validate: { notEmpty: true },
        allowNull: false,
      },
      dm1: {
        type: DataTypes.STRING,
        validate: { notEmpty: true },
        allowNull: false,
      },
      dm2: {
        type: DataTypes.STRING,
        validate: { notEmpty: true },
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

module.exports = sequelize => {
  const ViewedScreenshot = sequelize.define(
    'ViewedScreenshot',
    {},
    {
      timestamps: true,
      paranoid: false,
    }
  );

  ViewedScreenshot.associate = models => {
    models.ViewedScreenshot.belongsTo(models.User, { onDelete: 'CASCADE' });
    models.ViewedScreenshot.belongsTo(models.Screenshot, {
      onDelete: 'CASCADE',
    });
  };

  return ViewedScreenshot;
};

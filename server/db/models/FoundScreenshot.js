module.exports = sequelize => {
  const SolvedScreenshot = sequelize.define(
    'SolvedScreenshot',
    {},
    {
      timestamps: true,
      paranoid: false,
    }
  );

  SolvedScreenshot.associate = models => {
    models.SolvedScreenshot.belongsTo(models.User, { onDelete: 'CASCADE' });
    models.SolvedScreenshot.belongsTo(models.Screenshot, {
      onDelete: 'CASCADE',
    });
  };

  return SolvedScreenshot;
};

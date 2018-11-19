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
      imagePath: {
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
      isApproved: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Screenshot.associate = models => {
    models.Screenshot.hasMany(models.ScreenshotName);
    models.Screenshot.hasMany(models.SolvedScreenshot);
    models.Screenshot.belongsTo(models.User, { onDelete: 'CASCADE' });
    models.Screenshot.belongsTo(models.User, {
      as: 'ModeratorUser',
      foreignKey: 'moderatedBy',
    });
  };

  return Screenshot;
};

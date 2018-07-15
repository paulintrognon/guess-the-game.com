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
      difficulty: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 3,
        },
        allowNull: false,
        defaultValue: 0,
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
    models.Screenshot.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Screenshot;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      nickname: {
        type: DataTypes.STRING,
        validate: {
          len: [2, 20],
          notNull: true,
          notEmpty: true,
        },
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = models => {
    models.User.hasMany(models.Screenshot);
    models.User.hasMany(models.ScreenshotFound);
  };

  return User;
};

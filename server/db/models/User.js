module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      nickname: {
        type: DataTypes.STRING,
        validate: {
          len: [2, 20],
          notEmpty: true,
        },
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          is: /^.+@.+$/i,
          len: [3, 100],
          notEmpty: true,
        },
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: [2, 20],
          notNull: true,
          notEmpty: true,
        },
        allowNull: true,
      },
      screenshotsFound: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

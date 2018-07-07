module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING(20),
        unique: true,
        validate: {
          len: [2, 20],
          notEmpty: true,
        },
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
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
          notEmpty: true,
        },
        allowNull: true,
      },
      screenshotsFound: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

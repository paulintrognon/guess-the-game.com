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
        allowNull: true,
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
      solvedScreenshots: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      addedScreenshots: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      canModerateScreenshots: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      emailUpdates: {
        type: DataTypes.ENUM('asap', 'daily', 'weekly', 'never'),
        defaultValue: null,
        allowNull: true,
      },
      emailUpdateLastScreenshotDate: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = models => {
    models.User.hasMany(models.Screenshot);
    models.User.hasMany(models.ScreenshotRating);
    models.User.hasMany(models.SolvedScreenshot);
    models.User.hasMany(models.ViewedScreenshot);
    models.User.hasMany(models.Screenshot, {
      as: 'ModeratedScreenshot',
      foreignKey: 'moderatedBy',
    });
  };

  return User;
};

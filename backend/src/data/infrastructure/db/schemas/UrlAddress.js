const { DataTypes } = require('sequelize');
const {
  SHORTCODE_IN_USE_ERROR_MSG,
  URL_ADDRESS_IN_USE_ERROR_MSG,
  URL_ADDRESS_VALIDATION_ERROR_MSG,
} = require('../../../../common/constants');

module.exports.init = (sequelize) => {
  const UrlAddress = sequelize.define('url_addresses', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: URL_ADDRESS_IN_USE_ERROR_MSG,
      },
      validate: {
        isUrl: {
          msg: URL_ADDRESS_VALIDATION_ERROR_MSG,
        },
      },
    },
    shortcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: SHORTCODE_IN_USE_ERROR_MSG,
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_seen_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    redirect_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    createdAt: 'start_date',
    updatedAt: 'updated_at',
    freezeTableName: true,
  });

  return UrlAddress;
};

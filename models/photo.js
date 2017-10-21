'use strict';
module.exports = (sequelize, DataTypes) => {
  var Photo = sequelize.define('Photo', {
    name: DataTypes.STRING,
    path: DataTypes.TEXT,
    previewPath: DataTypes.TEXT,
    label: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Photo;
};
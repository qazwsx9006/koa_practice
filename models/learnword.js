'use strict';
module.exports = (sequelize, DataTypes) => {
  var LearnWord = sequelize.define('LearnWord', {
    groupId: DataTypes.STRING,
    roomId: DataTypes.STRING,
    keyword: DataTypes.STRING,
    reply: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return LearnWord;
};
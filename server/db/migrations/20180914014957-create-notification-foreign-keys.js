"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("notifications", "recipient_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      }),
      queryInterface.addColumn("notifications", "sender_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("notifications", "recipient_id"),
      queryInterface.removeColumn("notifications", "sender_id")
    ];
  }
};

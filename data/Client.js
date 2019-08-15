const sequelize = require('../db');

const Client = sequelize.define('Client', {
    // attributes
    Name: {
      type: Sequelize.STRING,
      allowNull: false
    }
}, {
    // options
});

Client.hasMany(Resort, { as : 'Resorts' });

module.exports = Client;
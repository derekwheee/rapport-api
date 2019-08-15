const sequelize = require('../db');

const Resort = sequelize.define('Resort', {
    // attributes
    Name: {
      type: Sequelize.STRING,
      allowNull: false
    }
}, {s
    // options
});

Resort.hasOne(Client);

module.exports = Resort;
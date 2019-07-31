'use strict';
module.exports = function(app) {
  var bringgExe = require('../controllers/bringgExeController');

  app.route('/newOrder')
    .post(bringgExe.new_order)
    .get(bringgExe.get_customer_orders);
};



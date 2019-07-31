var mongoose = require('mongoose'),
    NewOrder = mongoose.model('Orders'),
    queryHandler = require('./queryHandler');

    exports.new_order = function(req, res) {
        var new_order = new NewOrder(req.body);
        new_order.save(function(err, order){
            if(err){
                res.send(err);
            }

            res.json(order);
        })
        queryHandler.bringg_new_customer(new_order);
    };

    exports.get_customer_orders = function(req, res){
        queryHandler.get_customer(req.body, res);
    }



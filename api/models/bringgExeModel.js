'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OrderSchema = new Schema({
  title: {
    type: String,
    default: "Title"
  },
  external_id: {
    type: String,
    required: "Must Have Id"
  },
  customer :{
    name: {
      type: String,
      required: 'most have a name'
    },
    phone: {
      type: String,
      required: 'most have a phone'
    },
    address: {
      type: String,
      required: 'most have a address'
    },
    company_id: {
      type: Number,
      required: 'most have a company_id'
    }
  },
  price: {
    type: Number
  },  
  created_date: {
    type: Date,
    default: Date.now
  },
  scheduled_at: {
    type: String,
    default: Date.now
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  }
});

module.exports = mongoose.model('Orders', OrderSchema);
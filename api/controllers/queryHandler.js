var https = require('https');
var CryptoJS = require('crypto-js');
var moment = require('moment');

function buildQuery(params) {
  params.timestamp = Date.now();
  params.access_token = "ZtWsDxzfTTkGnnsjp8yC";

  var query_params = '';

  for (var paramIdx in params) {
    var param = params[paramIdx];
    if (query_params.length > 0) {
      query_params += '&';
    }
    query_params += paramIdx + '=' + encodeURIComponent(param);
  }

  params.signature = CryptoJS.HmacSHA1(query_params, "V_-es-3JD82YyiNdzot7").toString();

  return params;
}

function buildOptions(method, url, length) {
  return options = {
    hostname: 'developer-api.bringg.com',
    port: 443,
    path: '/partner_api/' + url,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': length
    }
  };
}
exports.bringg_new_customer = async function (order) {
  var params = { "name": order.customer.name, "company_id": order.customer.company_id, "address": order.customer.address, "phone": order.customer.phone };
  params = buildQuery(params);

  var data = JSON.stringify(params);
  const options = buildOptions('POST', 'customers', data.length);

  var rs = '';
  const req = await https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      rs += d;
    });

    res.on('end', function () {
      order.customer_id = JSON.parse(rs).customer.id;
      bringg_new_task(order);
    });
  });

  req.on('error', (error) => {
    console.error(error)
  });

  console.log(data);
  req.write(data);
  req.end();
}

function bringg_new_task(task) {
  var params = {
    "company_id": task.customer.company_id, "customer_id": task.customer_id, "address": task.customer.address, "scheduled_at": task.scheduled_at,
    "title": task.title, "lat": task.lat, "lng": task.lng
  };
  params = buildQuery(params);

  var data = JSON.stringify(params);
  const options = buildOptions('POST', 'tasks', data.length);

  var rs = '';
  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      rs += d;
    });

    res.on('end', function () {
      console.log(rs);
    });
  });

  req.on('error', (error) => {
    console.error(error)
  });

  console.log(data);
  req.write(data);
  req.end();

}

exports.get_customer = function (body, response) {
  var params = { "company_id": body.company_id };
  params = buildQuery(params);

  var data = JSON.stringify(params);
  const options = buildOptions('GET', 'customers/phone/' + body.phone, data.length);
  var rs = '';

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      rs += d;
    });

    res.on('end', () => {
      var responseObject = {};
      responseObject.customer_id = JSON.parse(rs).customer.id;
      responseObject.company_id = body.company_id;
      responseObject.tasks = [];
      // ids = { "customer_id": JSON.parse(rs).customer.id, "company_id": body.company_id };
      get_tasks(1, responseObject, response);
    });
  });

  req.on('error', (error) => {
    console.error(error)
  });

  console.log(data);
  req.write(data);
  req.end();

}

function get_tasks(page, responseObject, response) {
  var params = { "company_id": responseObject.company_id, "page": page };
  params = buildQuery(params);

  var data = JSON.stringify(params);
  const options = buildOptions('GET', 'tasks', data.length);
  var rs = '';

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      rs += d;
    });

    res.on('end', () => {
      if (JSON.parse(rs).length < 50) {
        getLastWeekTasks(rs, responseObject, responseObject.customer_id);
        response.json(responseObject)
      } else{
        getLastWeekTasks(rs, responseObject, responseObject.customer_id);
        get_tasks(page + 1, responseObject, response);
      }
    });
  })

  req.on('error', (error) => {
    console.error(error)
  });

  req.write(data);
  req.end();

}

function getLastWeekTasks(tasks, responseObject, customer_id) {
  all_tasks = JSON.parse(tasks);

  // Find only the tasks that are relevent for the customer 
  customer_tasks = all_tasks.filter(d => d.customer.id === customer_id);

  // Build the dates of last week - Sunday and Sauterday 
  firstDay = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
  lastDay = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

  // Get only the tasks that was scheduled between these days
  last_week = customer_tasks.filter(d => d.scheduled_at.split('T')[0] >= firstDay && d.scheduled_at.split('T')[0] <= lastDay);
  responseObject.tasks = responseObject.tasks.concat(last_week);
}
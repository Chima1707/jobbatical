
var assert = require('assert');
var pg = require('pg');

function create_tables (callback) {
  var client = new pg.Client(process.env.DATABASE_URL);
  client.connect(function(err) {
    assert(!err); // die if we cannot connect
    var file = require('path').resolve('./database-setup.sql');
    var query = require('fs').readFileSync(file, 'utf8').toString();
    console.log('\n', query);
    client.query(query, function(err, result) {
      client.end();
      return callback(err, result);
    });
  });
}

create_tables(function (err, data) {
  console.log('DB Table Created & Test Data Inserted');
});
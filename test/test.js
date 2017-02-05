'use strict';

var test   = require('tape');
var server = require('./../server'); 

test('GET /topActiveUsers (get top active users for a week that has no single application)', function(t) {
  var options = {
    method: 'GET',
    url: '/topActiveUsers?page=1'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.length, 6, '6 users found as expected' );
    t.equal(response.result[0].apps, '0', 'most active user has no application for the todays week ' + new Date().toISOString());
    t.end();
  });
});


test('GET /topActiveUsers (get top active users for a week that has applications)', function(t) {
  var options = {
    method: 'GET',
    url: '/topActiveUsers?page=1&week=2015-01-21',
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.length, 6, '6 users found as expected');
    t.equal(response.result[0].id, 2, 'user_id 2 is the most active user for week ' + '2015-01-21' );
    t.equal(response.result[0].apps, '1', 'most active user has one application for week ' + '2015-01-21' );
    t.equal(response.result[0].listings.length, 1, ' one listing found for most active user for week ' + '2015-01-21' );
    t.end();
  });
});

test('GET /users (get a user that does not exists)', function(t) {
  var options = {
    method: 'GET',
    url: '/users?user_id=10',
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 404, 'user not found');
    t.end();
  });
});

test('GET /users (get a user that exists)', function(t) {
  var options = {
    method: 'GET',
    url: '/users?user_id=2',
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'user with user_id 2 found successfully');
    t.equal(response.result.createdListings.length, 0, 'user with user_id 2 has no created listing');
    t.equal(response.result.companies.length, 0, 'user with user_id 2 has no company');
    t.equal(response.result.applications.length, 1, 'user with user_id 2 has 1 application');
    t.end();
  });
});


test.onFinish(function () {
  server.stop(function(){});
})
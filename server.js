'use strict';

const Hapi = require('hapi');
const Boom = require('boom')
const Joi = require('joi')
const moment = require('moment')
const async = require('async')
const Path = require('path')
const service = require('./lib/service')

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'frontend')
            }
        }
    }
});
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


server.route({
    method: 'GET',
    path:'/topActiveUsers', 
    handler: (request, reply) => {
     let limit = request.query.limit || 10
     let page = request.query.page || 1
     let start =(page - 1) * limit
     let week = request.query.week // YYYY-MM-DD
     let weekStart = week && moment(week).subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')
     let weekEnd = week && moment(week).subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')

     service.fetchTopActiveUsers(request.pg.client, start, limit, weekStart, weekEnd, (err, users) => {
         if (err) {
             return reply(err) 
         }
         service.fetchTopListingForUsers (request.pg.client, users, (err, users) => {
             if (err) {
             return reply(err) 
            }
            return reply(users)
         }) 
     })
    },
    config: {
      validate: {
        query: {
          limit: Joi.number().integer(),
          page: Joi.number().integer(),
          week: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
        }
      }
    }
});

server.route({
    method: 'GET',
    path:'/users', 
    handler: (request, reply) => {
     let user_id = request.query.user_id
     service.getUser(request.pg.client, user_id, (err, user) => {
         if(err) {
             if (err === 'not found') {
                 return reply(Boom.notFound('User not found'))
             }
             return reply(err)
       }
       async.series({
        companies: service.getUserCompanies.bind(null, request.pg.client, user_id),
        createdListings: service.getUserCreatedListings.bind(null, request.pg.client, user_id),
        applications: service.getUserApplications.bind(null, request.pg.client, user_id)
       }, (err, results) => {
         if (err) {
              return reply(err)
         }
         user.companies = results.companies
         user.createdListings = results.createdListings,
         user.applications = results.applications
         return reply(user)
      })
     })
    },
    config: {
      validate: {
        query: {
          user_id: Joi.number().integer()
        }
      }
    }
});

server.register([require('hapi-postgres-connection'), require('inert')], (err) => {
  if (err) {
    throw err
  }
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});
});

server.start((err) => {
    if (err) {
     throw err
  }
  console.log('Server running at:', server.info.uri);
});

module.exports = server
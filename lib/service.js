'use strict';

const moment = require('moment')
const async = require('async')

module.exports = {
    fetchTopActiveUsers: fetchTopActiveUsers,
    fetchTopListingForUsers: fetchTopListingForUsers,
    getUser: getUser,
    getUserCompanies: getUserCompanies,
    getUserCreatedListings: getUserCreatedListings,
    getUserApplications: getUserApplications
}

/**
 * @param {Object} client - The postgres client.
 * @param {Number} start - Row number to start from
 * @param {Number} limit - Amount of users to retrieve
 * @param {String} startDay - Start day of the week, format is YYYY-MM-DD HH:mm:ss
 * @param {String} endDay - End day of the week, format is YYYY-MM-DD HH:mm:ss
 * @callback callback - Callback to call
 */
function fetchTopActiveUsers (client, start, limit, startDay, endDay, callback) {

     startDay = startDay || moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')
     endDay = endDay || moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')

     let userByActivityQuery = `select users.id, users.name, users.created_at, count(applications.id) as apps 
                   from users 
                   left join applications 
                   on users.id = applications.user_id
                   and applications.created_at >= $1
                   and applications.created_at <= $2
                   group by users.id
                   order by apps desc LIMIT $3 OFFSET $4`
        client.query(userByActivityQuery, [startDay, endDay, limit, start], function(err, result) {
         if (err) {
             return callback(err) 
         }
         return callback(null, result.rows)
        })
}
/**
 * @param {Object} client - The postgres client.
 * @param {Object[]} users - users to fetch top listings for
 * @callback callback - Callback to call
 */
function fetchTopListingForUsers (client, users, callback) {
    let fetchUserListingsQuery = `select  applications.listing_id, listings.name from applications
               inner join listings
               on listings.id = applications.listing_id
               where applications.user_id =$1
               order by applications.created_at desc LIMIT 3`
     async.each(users, function (user, callback) {
          client.query(fetchUserListingsQuery, [user.id], (err, result) => {
              if (err) {
                  return callback(err)
              }
           user.listings = result.rows
           callback()
          })
      }, (err) => {
       if(err) {
       return callback(err)
       }
       return callback(users)
      })
}

/**
 * @param {Object} client - The postgres client.
 * @param {Number} user_id - id of user to fetch
 * @callback callback - Callback to call
 */
function getUser(client, user_id, callback) {
    let getUserQuery = `select id, name, created_at as createdAt  from users where id =$1`;
     client.query(getUserQuery, [user_id], (err, result) => {
       if (err) {
           return  callback(err)
       }  
       if (!result.rows || !result.rows.length) {
          return  callback('not found') 
       }
       return callback(null, result.rows[0])
     })
}

/**
 * @param {Object} client - The postgres client.
 * @param {Number} user_id - id of user to fetch companies for
 * @callback callback - Callback to call
 */
function getUserCompanies(client, user_id, callback) {
    let getUserCompaniesQuery = `select  companies.id as id, companies.name as name, companies.created_at as createdAt, teams.contact_user as isContact from teams
                        inner join companies
                        on teams.company_id = companies.id
                        where teams.user_id = $1`;
     client.query(getUserCompaniesQuery, [user_id], (err, result) => {
       if (err) {
           return  callback(err)
       }  
       return callback(null, result.rows)
     })
}

/**
 * @param {Object} client - The postgres client.
 * @param {Number} user_id - id of user to fetch created listings for
 * @callback callback - Callback to call
 */
function getUserCreatedListings(client, user_id, callback) {
    let getUserCreatedListingsQuery = `select id , name, description, created_at as createdAt from listings
                                       where created_by = $1`;
     client.query(getUserCreatedListingsQuery, [user_id], (err, result) => {
       if (err) {
           return  callback(err)
       }  
       return callback(null, result.rows)
     })
}

/**
 * @param {Object} client - The postgres client.
 * @param {Number} user_id - id of user to fetch applications for
 * @callback callback - Callback to call
 */
function getUserApplications(client, user_id, callback) {
    let getUserApplicationQuery = `select applications.id as id, applications.created_at as createdAt, applications.cover_letter as coverLetter,
                                   listings.id as listingid, listings.name as listingname, listings.description as listingdescription from applications 
                                   inner join listings
                                   on applications.listing_id = listings.id
                                   where applications.user_id = $1`;
     client.query(getUserApplicationQuery, [user_id], (err, result) => {
       if (err) {
           return  callback(err)
       }
       let res = result.rows.map(function (row) {
           let listing = {name: row.listingname, id: row.listingid, description: row.listingdescription}
           delete row.listingname
           delete row.listingid
           delete row.listingdescription
           row.listing = listing
           return row
       })  
       return callback(null, res)
     })
}

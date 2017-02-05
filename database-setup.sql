
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

create table users (
	id serial primary key,
	created_at timestamp default current_timestamp,
	name character varying(64)
);

create table companies (
	id serial primary key,
	created_at timestamp default current_timestamp,
	name character varying(64)
);

create table teams (
	id serial primary key,
	company_id integer references companies (id),
	user_id integer references users (id),
	contact_user boolean default false
);

create table listings (
	id serial primary key,
	created_at timestamp default current_timestamp,
	created_by integer references users (id),
	name character varying(64),
	description text
);

create table applications (
	id serial primary key,
	created_at timestamp default current_timestamp,
	user_id integer references users (id),
	listing_id integer references listings (id),
	cover_letter text
);


insert into users (id, created_at, name) values
	(1, '2015-01-13 15:30', 'Mark'),
	(2, '2015-01-13 15:30', 'John'),
	(3, '2016-01-01 10:30', 'Melinda'),
	(4, '2016-01-17 23:30', 'Carl'),
	(5, '2016-02-02 16:30', 'Tim'),
	(6, '2016-02-02 16:30', 'Jessica')
;

insert into companies (id, created_at, name) values
	(1, '2015-01-13 15:00', 'Facewall'),
	(2, '2015-01-17 15:00', 'Carl & Co')
;

insert into teams (company_id, user_id, contact_user) values
	(1, 1, TRUE),
	(2, 3, FALSE),
	(2, 4, TRUE)
;

insert into listings (id, created_at, created_by, name, description) values
	(1, '2015-01-15 11:00', 1, 'Join us conquering the world!', 'This is your best chance to be on the right side of the equation...')
;

insert into applications (created_at, user_id, listing_id, cover_letter) values
	('2015-01-16 12:00', 2, 1, 'Hello, ...')
;
# jobbatical
A sample 


## Install
 After cloning the repository, install the required dependencies by running
 ```sh
 npm install
 ```

### Note 

You have to set an environmental variable `DATABASE_URL` to be able to run both the test and aplication
Type/paste this in your terminal to set up `DATABASE_URL` environmental variable
for this case use `DATABASE_URL` as postgres://kjal0sbv1t:gwrxrzieuj@assignment.codsssqklool.eu-central-1.rds.amazonaws.com:5432/kjal0sbv1t_db:
```sh
export DATABASE_URL=postgres://kjal0sbv1t:gwrxrzieuj@assignment.codsssqklool.eu-central-1.rds.amazonaws.com:5432/kjal0sbv1t_db
```

## Test
To run the test, run
```sh
npm run test
```
if you have `DATABASE_URL` environmental variable setup already
Or run
```sh
DATABASE_URL=postgres://kjal0sbv1t:gwrxrzieuj@assignment.codsssqklool.eu-central-1.rds.amazonaws.com:5432/kjal0sbv1t_db npm run test
```
to set up the `DATABASE_URL` and also run the test at the same time

## Run 
To run the application run, 
```sh
npm run start
```
if you have  `DATABASE_URL` environmental variable setup already
Or run
```sh
DATABASE_URL=postgres://kjal0sbv1t:gwrxrzieuj@assignment.codsssqklool.eu-central-1.rds.amazonaws.com:5432/kjal0sbv1t_db npm run start
```
to set up the `DATABASE_URL` and also run the application at the same time

Open [front-end application](http://localhost:8080/) to view the frontend application

The Backend services, can be found at
[top active users list](http://localhost:8000/topActiveUsers?page=1&week=2015-01-21) 
and
[view user info](http://localhost:8000/users?user_id=2)


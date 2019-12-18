## ABOUT:
It's a project to expose swapi APIs with some modifications.

## Setup

1. Clone this repo using SSH
2. Install Node with version >= 10
3. Follow these commands:
```
$ cp .env.sample .env
$ npm install
$ npm run watch
```
4. The default port is 3000 where server runs. You can pass PORT as environment variable to run in different port.

## Run using docker-compose
$ docker-compose up

## API Documentation
Open http://localhost:3000/api-docs

## APIs
1. Fetch movie list:
```
/api/movies
```
2. Fetch Characters:
```
/api/characters?sort=<key>&gender=<gendervalue>
```
The API accepts sort and filter query.
To sort in descending order, pass with prefix '-'.
3. Fetch Comments for a movie:
```
/api/movies/:movieId/comments
```
4. Post comment for a movie:
```
/api/movies/:movieId/comments

Data: {
  "message": '...'
}
```

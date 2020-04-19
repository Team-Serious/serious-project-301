'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.static('./public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// ROUTS
app.get('/search', searchHandler);
app.get('/', homeHandler);
app.post('/search-result', searchResulthHandler);
app.get('/about', aboutHandler);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// function aboutHandler for ('/about')
function aboutHandler(req, res) {
  res.render('pages/about');
}


///// function homehandler for ('/')
function homeHandler(req, res) {
  res.render('pages/home');
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// function searchhandler for ('/search')
function searchHandler(req, res) {
  res.render('pages/search');
}



// const theLocation=req.query.city;
// let SQL =`SELECT * FROM thelocations WHERE search_query='${theLocation}'`;
// console.log(SQL);
// client.query(SQL)
// .then(data =>{
//     if (data.rows.length >0){
//     console.log('from DB',data.rows);
//     res.send(data.rows[0]);}
//     else {
//         const key= process.env.GEOCODE_API_KEY;
//         const url= `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${theLocation}&format=json`;
//         superagent.get(url)
//         .then(data1 =>{
//             const locationInfo= new Location(theLocation, data1.body);
//             res.send(locationInfo);
//             let SQL = 'INSERT INTO thelocations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)';
//             let safeValues= [locationInfo.search_query , locationInfo.formatted_query , locationInfo.latitude , locationInfo.longitude];
//            client.query(SQL, safeValues)
//            .then( data =>{
//             console.log('added to DB',data.rows);
//            });
//         });
//     }
// })
// .catch (() => {        res.send('error');    });


///// function searchResulthandler for ('/search-result')
function searchResulthHandler(req, res) {


  let petObjects = [];
  let url;
  if (req.body.pet === 'cat') {
    console.log('cats');
    let SQL = 'SELECT * FROM search_result WHERE search_req=$1;';
    let value = [req.body.breed];
    console.log(SQL);
    client.query(SQL, value)
      .then(data => {
        console.log('then');
        console.log(data.rows);
        if (data.rows.length > 0) {
          console.log('from DB', data.rows);
          res.render('pages/search-result', { data: data.rows });
        }
        else {
          // let cat;
          console.log('else');
          url = `https://api.thecatapi.com/v1/images/search?breed_ids=${req.body.breed}&include_breeds=true&limit=12`;
          superagent.get(url)
            .then(data => {
              data.body.map((element, index) => {
                const cat = new Cats(element, req.body.breed, index);
                petObjects.push(cat);
                let SQL1 = 'INSERT INTO search_result (pet_type,pet_name,gender,breed, pet_weight, img, description, origin, search_req) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);';
                let safeValues = [cat.pet_type, cat.pet_name, cat.gender, cat.breed, cat.pet_weight, cat.img, cat.description, cat.origin, req.body.breed];
                client.query(SQL1, safeValues)
                  .then(data => {
                    console.log('added to DB', data.rows);
                  });
              });
              res.render('pages/search-result', { data: petObjects });

            });
        }
      })
      .catch(() => { res.send('error'); });
  }



  if (req.body.pet === 'dog') {
    url = `https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=asc&page=0&limit=15&api_key=${process.env.API_KEY}`;
    superagent.get(url)
      .then(data => {
        data.body.map((element, index) => {
          const dog = new Dogs(element, req.body.breed, index);
          if (dog.breed === req.body.breed) { petObjects.push(dog); }
        });
        res.render('pages/search-result', { data: petObjects });
        // res.send(petObjects);
      });
  }
}


let names = ['Poppy', 'Bella', 'Molly', 'Alfie', 'Charlie', 'Daisy', 'Rosie', 'Teddy', 'Lola', 'Millie', 'Bella', 'Tilly', 'Lola', 'Coco', 'Luna', 'Molly', 'Rosie', 'Phoebe'];

let gender = ['Male', 'Female'];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// CATS  CONSTRUCTOR
function Cats(data, req) {
  this.pet_type = 'cat';
  this.pet_name = names[Math.floor((Math.random() * names.length))];
  this.gender = gender[Math.floor((Math.random() * gender.length))];
  this.breed = data.breeds[0].name;
  this.pet_weight = data.breeds[0].weight.metric.substring(0, 2);
  this.img = data.url;
  this.description = data.breeds[0].description;
  this.origin = data.breeds[0].origin;
  this.search_req = req;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// DOGS CONSTRUCTOR
function Dogs(data, req) {
  this.pet_type = 'dog';
  this.pet_name = names[Math.floor((Math.random() * names.length))];
  this.gender = gender[Math.floor((Math.random() * gender.length))];
  this.breed = data.breeds[0].name;
  this.pet_weight = data.breeds[0].weight.metric.substring(0, 2);
  this.img = data.url;
  this.description = data.breeds[0].temperament;
  if (data.breeds[0].origin) { this.origin = data.breeds[0].origin; }
  else { this.origin = 'Unkown'; }
  this.search_req = req;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('listening from port ', PORT);
    });

  });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

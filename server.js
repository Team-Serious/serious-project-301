'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const fetch = require('node-fetch');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.static('./public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let names = ['Kyrie', 'Sage', 'Justice', 'Alfie', 'Haven', 'Reece', 'Finn', 'Sterling', 'Landry', 'Indigo', 'Shay', 'Jules', 'Halo', 'Coco', 'Blair', 'Navy', 'Miller', 'Ocean', 'Cleo', 'Lennox', 'Gianno', 'Frankie', 'Jamie', 'Oakley', 'Drew', 'Armani', 'Noel', 'Milan', 'Lennon', 'London', 'Charlie', 'alexis', 'Taylor', 'Blake', 'Quinn', 'Parker', 'Angel', 'Jordan'];

let selectedNames = [];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// ROUTS
app.get('/', homeHandler);
app.get('/search', searchHandler);
app.post('/search-result', searchResulthHandler);
app.get('/about', aboutHandler);
app.get('/rehome', rehomeHandler);
app.get('/user', userHandler);
app.delete('/delete/:id', deletePet);
app.put('/update/:id', updatePet);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// this to render the user seletion
function userHandler(req, res) {
  let SQL = 'SELECT * FROM selected_pet;';
  client.query(SQL)
    .then(data => {
      res.render('pages/user', { pets: data.rows });
    });
}

function rehomeHandler(req, res) {
  res.render('pages/rehome');
}

////// function aboutHandler for ('/about')
function aboutHandler(req, res) {
  res.render('pages/about');
}

var y = 0;
///// function homehandler for ('/')
function homeHandler(req, res) {


  fetch('https://api.ipify.org/?format=json')
    .then(result => result.json())
    .then(x => {
      // console.log(x);
      return x;
    })
    .then(z => y = z);
  // .then(m => console.log('rrrr', r, y, m));

  res.render('pages/home');
}
///// function deletePet for ('/delete')
function deletePet(req, res) {
  let sql = 'DELETE FROM selected_pet WHERE id=$1;';
  let safeValue = [req.params.id];
  // console.log(safeValue);

  client.query(sql, safeValue)
    .then(res.redirect('/'));
}
///// function updatePet for ('/update')
function updatePet(req, res) {
  let { pet_name, breed, pet_weight, description, origin } = req.body;
  let id = req.params.id;
  let sql = 'UPDATE selected_pet SET pet_name=$1,breed=$2,pet_weight=$3,description=$4,origin=$5 WHERE id=$6; ';
  let safeValues = [pet_name, breed, pet_weight, description, origin, id];
  // console.log('zzzzzzz00', safeValues);

  client.query(sql, safeValues)
    .then(res.redirect(`/user`));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// function searchhandler for ('/search')
function searchHandler(req, res) {
  console.log(y.ip, 'ooooo');
  let url = 'http://ip-api.com/json/149.200.225.167';
  superagent.get(url)
    .then(data => console.log(data.body));
  res.render('pages/search');
}
let petObjects = [];

/// Insert the selected pet to the DB  ( selected_pet table ) this just do the insert and redirect to '/user'
app.post('/pet/:pet_name', (req, res) => {
  let unique = req.params.pet_name;
  petObjects.forEach(val => {
    if (unique === val.pet_name) {
      // let selectedPet = val;
      let SQL = 'INSERT INTO selected_pet (pet_type,pet_name,gender,breed, pet_weight, img, description, origin, search_req) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);';
      let safeValues = [val.pet_type, val.pet_name, val.gender, val.breed, val.pet_weight, val.img, val.description, val.origin, val.search_req];
      client.query(SQL, safeValues)
        .then(() => {
          res.redirect('/user');
        });
    }
  });
});

function searchResulthHandler(req, res) {


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
          petObjects = [];
          // let cat;
          console.log('else');
          url = `https://api.thecatapi.com/v1/images/search?breed_ids=${req.body.breed}&include_breeds=true&limit=12`;
          superagent.get(url)
            .then(data => {
              data.body.map((element, index) => {
                let name = names[Math.floor((Math.random() * names.length))];
                while (selectedNames.includes(name)) {
                  name = names[Math.floor((Math.random() * names.length))];
                }
                selectedNames.push(name);
                const cat = new Cats(element, req.body.breed, name, index);
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
        } else {
          petObjects = [];
          url = `https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=asc&page=0&limit=15&api_key=${process.env.API_KEY}`;
          superagent.get(url)
            .then(data => {
              data.body.map((element, index) => {
                let name = names[Math.floor((Math.random() * names.length))];
                selectedNames.push(name);
                while (selectedNames.includes(name)) {
                  name = names[Math.floor((Math.random() * names.length))];
                }
                const dog = new Dogs(element, req.body.breed, name, index);
                if (dog.breed === req.body.breed) {
                  petObjects.push(dog);
                  let SQL1 = 'INSERT INTO search_result (pet_type,pet_name,gender,breed, pet_weight, img, description, origin, search_req) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);';
                  let safeValues = [dog.pet_type, dog.pet_name, dog.gender, dog.breed, dog.pet_weight, dog.img, dog.description, dog.origin, req.body.breed];
                  client.query(SQL1, safeValues)
                    .then(data => {
                      console.log('added to DB', data.rows);
                    });
                }
              });
              res.render('pages/search-result', { data: petObjects });
            });
        }
      })
      .catch(() => { res.send('error'); });
  }
}



let gender = ['Male', 'Female'];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// CATS  CONSTRUCTOR
function Cats(data, req, name) {
  this.pet_type = 'cat';
  this.pet_name = name;
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
function Dogs(data, req, name) {
  this.pet_type = 'dog';
  this.pet_name = name;
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

'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.static('./public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let names = ['Kyrie', 'Sage', 'Justice', 'Alfie', 'Haven', 'Reece', 'Finn', 'Sterling', 'Landry', 'Indigo', 'Shay', 'Jules', 'Halo', 'Coco', 'Blair', 'Navy', 'Miller', 'Ocean', 'Cleo', 'Lennox', 'Gianno', 'Frankie', 'Jamie', 'Oakley', 'Drew', 'Armani', 'Noel', 'Milan', 'Lennon', 'London', 'Charlie', 'alexis', 'Taylor', 'Blake', 'Quinn', 'Parker', 'Angel', 'Jordan'];
let selectedNames = [];
let fact = true;
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
app.get('/location', locationHandler);
app.post('/pet/:pet_name',insertToDatabase);
app.post('/add', addToRehome);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function to show user data from database '/user'
function userHandler(req, res) {
  let SQL = 'SELECT * FROM selected_pet;';
  client.query(SQL)
    .then(data => {
      res.render('pages/user', { pets: data.rows });
    });
}

// function that render a form for rehome a pet '/rehome'
function rehomeHandler(req, res) {
  res.render('pages/rehome');
}

// function about Us page '/about'
function aboutHandler(req, res) {
  res.render('pages/about');
}

// function to display nearest Veterinarians '/location'
function locationHandler(req, res) {
  let locationType = req.query.ipRadio;
  if (locationType === 'useOtherlocation') {
    let locationFtomUser = req.query.userInput;
    let url = `https://api.opencagedata.com/geocode/v1/json?q=${locationFtomUser}&key=${process.env.API_OPENCAGEDATA_KEY}`;
    superagent.get(url)
      .then(data => {
        let lattitude = data.body.results[0].geometry.lat;
        let longitude = data.body.results[0].geometry.lng;
        return [lattitude, longitude];
      }).then(latlondata => {
        let lattitude = latlondata[0];
        let longitude = latlondata[1];
        url = `https://api.tomtom.com/search/2/search/veterinary.json?key=${process.env.API_TOMTOM_LOCATION_KEY}&lat=${lattitude}&lon=${longitude}`;
        superagent.get(url)
          .then(data => {res.render('pages/location', { data: data.body.results });
          });
      });

  } else {
    let url = 'http://ip-api.com/json/';
    superagent.get(url)
      .then(locationData => {
        let lattitude = locationData.body.lat;
        let longitude = locationData.body.lon;
        let url = `https://api.tomtom.com/search/2/search/veterinary.json?key=${process.env.API_TOMTOM_LOCATION_KEY}&lat=${lattitude}&lon=${longitude}`;
        superagent.get(url)
          .then(data => {res.render('pages/location', { data: data.body.results });
          });
      });
  }
}

///// function homehandler for ('/')
function homeHandler(req, res) {
  let url;
  if (fact) {
    url = 'https://catfact.ninja/facts?limit=1&max_length=140';
    superagent.get(url)
      .then(element => {
        let catFact = element.body.data[0].fact;
        res.render('pages/home', { theFact: catFact });
      });
  }
  if (!fact) {
    url = 'https://dog-api.kinduff.com/api/facts';
    superagent.get(url)
      .then(element => {
        let dogFact = element.body.facts[0];
        res.render('pages/home', { theFact: dogFact });
      });
  }
  fact = !fact;
}

///// function deletePet for ('/delete')
function deletePet(req, res) {
  let sql = 'DELETE FROM selected_pet WHERE id=$1;';
  let safeValue = [req.params.id];
  client.query(sql, safeValue)
    .then(res.redirect('/user'));
}

///// function updatePet for ('/update')
function updatePet(req, res) {
  let { pet_name, breed, pet_weight, description, origin } = req.body;
  let id = req.params.id;
  let sql = 'UPDATE selected_pet SET pet_name=$1,breed=$2,pet_weight=$3,description=$4,origin=$5 WHERE id=$6; ';
  let safeValues = [pet_name, breed, pet_weight, description, origin, id];
  client.query(sql, safeValues)
    .then(res.redirect(`/user`));
}

///// Insert the selected pet(rehome) to the DB
function addToRehome(req, res) {
  console.log(req.body);
  let { pet, name, gender, Breed, weight, imgLink, disc, origin } = req.body;
  let sql = 'INSERT INTO search_result (pet_type,pet_name,gender,breed, pet_weight, img, description, origin,search_req, isFromApi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);';
  let safeValues = [pet, name, gender, Breed, weight, imgLink, disc, origin, Breed, 'F'];
  console.log(safeValues, 'xxxxxxxxxxxxxxx');
  client.query(sql, safeValues)
    .then(() => {
      res.redirect('/rehome');
    });
}

// function searchhandler for ('/search')
function searchHandler(req, res) {
  res.render('pages/search');
}



let petObjects = [];
/// Insert the selected pet to the DB  ( selected_pet table ) this just do the insert and redirect to '/user'
function insertToDatabase(req, res){
  let unique = req.params.pet_name;
  petObjects.forEach(val => {
    if (unique === val.pet_name) {
      let SQL = 'INSERT INTO selected_pet (pet_type,pet_name,gender,breed, pet_weight, img, description, origin, search_req) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);';
      let safeValues = [val.pet_type, val.pet_name, val.gender, val.breed, val.pet_weight, val.img, val.description, val.origin, val.search_req];
      client.query(SQL, safeValues)
        .then(() => {
          res.redirect('/user');
        });
    }
  });
}

function searchResulthHandler(req, res) {
  let url;
  if (req.body.pet === 'cat') {
    let SQL = 'SELECT * FROM search_result WHERE search_req=$1;';
    let value = [req.body.breed];
    client.query(SQL, value)
      .then(data => {
        let counter = data.rows.reduce((acc, e) => {
          if (e.isfromapi === 'T') acc++;
          return acc;
        }, 0);
        if (counter > 0) {
          res.render('pages/search-result', { data: data.rows });
        }
        else {
          petObjects = [];
          data.rows.forEach(el => {
            if (el.isfromapi === 'F') {
              petObjects.push(el);
            }
          });
          url = `https://api.thecatapi.com/v1/images/search?breed_ids=${req.body.breed}&include_breeds=true&limit=6`;
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
                let SQL1 = 'INSERT INTO search_result (pet_type,pet_name,gender,breed, pet_weight, img, description, origin, search_req, isFromApi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);';
                let safeValues = [cat.pet_type, cat.pet_name, cat.gender, cat.breed, cat.pet_weight, cat.img, cat.description, cat.origin, req.body.breed, cat.isFromApi];
                client.query(SQL1, safeValues)
                  .then(() => {
                    // console.log('added to DB', data.rows);
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
    client.query(SQL, value)
      .then(data => {
        let counter = data.rows.reduce((acc, e) => {
          if (e.isfromapi === 'T') acc++;
          return acc;
        }, 0);
        if (counter > 0) {
          res.render('pages/search-result', { data: data.rows });
        } else {
          petObjects = [];
          data.rows.forEach(el => {
            if (el.isfromapi === 'F') {
              petObjects.push(el);
            }
          });
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
                  let SQL1 = 'INSERT INTO search_result (pet_type,pet_name,gender,breed, pet_weight, img, description, origin, search_req,isFromApi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);';
                  let safeValues = [dog.pet_type, dog.pet_name, dog.gender, dog.breed, dog.pet_weight, dog.img, dog.description, dog.origin, req.body.breed, dog.isFromApi];
                  client.query(SQL1, safeValues)
                    .then(() => {
                      // console.log('added to DB', data.rows);
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
  this.isFromApi = 'T';
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
  this.isFromApi = 'T';
}

////////error
app.get('*', (req, res) => {
  res.render('pages/error');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('listening from port ', PORT);
    });

  });

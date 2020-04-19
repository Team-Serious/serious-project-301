'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
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
app.get('/about',aboutHandler);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// function aboutHandler for ('/about')
function aboutHandler(req,res){
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

///// function searchResulthandler for ('/search-result')
function searchResulthHandler(req, res) {
  let petObjects = [];
  let url;
  if (req.body.pet === 'cat') {
    url = `https://api.thecatapi.com/v1/images/search?breed_ids=${req.body.breed}&include_breeds=true&limit=12`;
    superagent.get(url)
      .then(data => {
        data.body.map((element, index) => {
          const cat = new Cats(element, index);
          petObjects.push(cat);
        });
        res.render('pages/search-result', { data: petObjects });
        // res.send(petObjects);
      });
  }
  if (req.body.pet === 'dog') {
    url = `https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=asc&page=0&limit=15&api_key=${process.env.API_KEY}`;
    superagent.get(url)
      .then(data => {
        data.body.map((element, index) => {
          const dog = new Dogs(element, index);
          if (dog.breed === req.body.breed) { petObjects.push(dog); }
        });
        res.render('pages/search-result', { data: petObjects });
        // res.send(petObjects);
      });
  }
}


let names=['Poppy', 'Bella', 'Molly', 'Alfie', 'Charlie', 'Daisy', 'Rosie', 'Teddy', 'Lola', 'Millie', 'Bella', 'Tilly', 'Lola', 'Coco', 'Luna', 'Molly', 'Rosie', 'Phoebe'];

let gender=['Male', 'Female'];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// CATS  CONSTRUCTOR
function Cats(data) {
  this.pet_type = 'cat';
  this.pet_name = names[Math.floor((Math.random() * names.length) )];
  this.gender = gender[Math.floor((Math.random() * gender.length) )];
  this.breed = data.breeds[0].name;
  this.pet_weight = data.breeds[0].weight.metric.substring(0, 2);
  this.img = data.url;
  this.description = data.breeds[0].description;
  this.origin = data.breeds[0].origin;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// DOGS CONSTRUCTOR
function Dogs(data) {
  this.pet_type = 'dog';
  this.pet_name = names[Math.floor((Math.random() * names.length) )];
  this.gender = gender[Math.floor((Math.random() * gender.length) )];
  this.breed = data.breeds[0].name;
  this.pet_weight = data.breeds[0].weight.metric.substring(0, 2);
  this.img = data.url;
  this.description = data.breeds[0].temperament;
  if (data.breeds[0].origin) { this.origin = data.breeds[0].origin; }
  else { this.origin = 'Unkown'; }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(` PORT  ${PORT} is alive`);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

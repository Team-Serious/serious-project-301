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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// function searchhandler for ('/search')
function homeHandler(req, res) {

  res.render('pages/home');
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// function searchhandler for ('/search')
function searchHandler(req, res) {

  res.render('pages/search');
}


function searchResulthHandler(req,res){
  let petObjects=[];
  let url;
  if (req.body.pet == 'cat')
  {
      url=`https://api.thecatapi.com/v1/images/search?breed_ids=${req.body.breed}&include_breeds=true&limit=10`;
      superagent.get(url)
      .then(data =>{
          data.body.map( element =>{
              const cat= new Cats(element);
              petObjects.push(cat);
          });
          res.send(petObjects);
         });
  }
  if (req.body.pet == 'dog'){
      url=`https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=asc&page=0&limit=15&api_key=${process.env.API_KEY}`;
      superagent.get(url)
      .then(data =>{
          data.body.map( element =>{
              const dog= new Dogs(element);
              if (dog.breed == req.body.breed)
                {petObjects.push(dog);}
          });
          res.send(petObjects);
         });
  }

 

 // res.render('page/search-result');
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// CATS  CONSTRUCTOR
function Cats(data){
  this.type   = 'cat';
  this.name= data.breeds[0].id;
  this.breed = data.breeds[0].name;
  this.weight = data.breeds[0].weight.metric.substring(0,2);
  this.img    = data.url;
  this.description = data.breeds[0].description;
  this.origin  = data.breeds[0].origin;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// DOGS CONSTRUCTOR
function Dogs(data){
  this.type   = 'dog';
  this.name= 'not named';
  this.breed = data.breeds[0].name;
  this.weight = data.breeds[0].weight.metric.substring(0,2);
  this.img    = data.url;
  this.description = data.breeds[0].temperament;
  if (data.breeds[0].origin) {    this.origin  = data.breeds[0].origin;    }
  else     { this.origin  = "Unkown"; }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(` PORT  ${PORT} is alive`);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

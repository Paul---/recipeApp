'use strict'
const apiKey = `0f0c58362031c1b4629fe2a06ecfebc2`;
let ingredients = 'i=chocolate';

//event listeners
$('.search-btn').on('click submit',  function (e) {
  e.preventDefault();
  e.which===13? search():null;
  search();
});

async function search(){
  let ingString = $('#search-ingredients').val();
  let formattedIngs = formatIngredients(ingString);
  let recipeArr = await returnRecipeArray(formattedIngs);
  await displayRecipes(recipeArr);
  $('#search-ingredients').val('');
}

//end of event listeners

async function returnRecipeArray(ingredients) {
  const corsWorkAround = `https://api.allorigins.win/get?url=`;
  let URL = `${corsWorkAround}${encodeURIComponent('http://www.recipepuppy.com/api/?')}${ingredients}`;
  let resultsArr = await fetch(URL).then(res => res.json()).then(res => JSON.parse(res.contents)).then(res => res.results);
  return resultsArr;
}

async function displayRecipes(recipeArr) {
  $('.recipe-list').html('');
  recipeArr.forEach(el => {
    $(`<li>${el.title} <br> <a href="${el.href}" target="_blank" ><img class="thumbnail-img" src='${el.thumbnail}' alt=${el.title} /> </a> <br> ${el.ingredients}
    </li>`).appendTo('.recipe-list');
  })
}

function displayShoppingList() {
  //list all recipe ingredients
}

function formatIngredients(ingredients) {
  //  return commas separated string of ingredients
  let arr = ingredients.split(' ').join(',')
  return `i=${arr}`;
}

async function loadPage(ingredients) {
  let arr = await returnRecipeArray(ingredients);
  displayRecipes(arr);
}

//initial page load
//$(loadPage(ingredients));
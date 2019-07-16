'use strict'
const apiKey = `7e581f01be536fa35f7d36e2746fa8ed`;
let ingredients = 'chocolate';

//event listeners
$('.search-btn').on('click submit',  function (e) {
  e.preventDefault();
  search($('#search-ingredients').val() );
});

async function search(query){
  let formattedIngs = formatIngredients(query);
  let recipeArr = await returnRecipeArray(formattedIngs);
  await displayRecipes(recipeArr);
  $('#search-ingredients').val('');
}

//end of event listeners
//***********************************************************
async function returnRecipeArray(ingredients) {
  let URL = `https://www.food2fork.com/api/search?key=${apiKey}&q=${ingredients}`;
  let resultsArr = await fetch(URL).then(res => res.json()).then(res => res);
  return resultsArr;
}

async function displayRecipes(recipeArr) {
  $('.recipe-list').html('');
  recipeArr.recipes.forEach(el => {
    $(`<li class="recipe-li"> <a href="https://www.food2fork.com/api/get?key=${apiKey}&rId=35382" target="_blank" ><img class="thumbnail-img" src='${el.image_url}' alt=${el.title} /> </a> <div class='recipe-title-div'> <h4 class="recipe-title">${el.title}</h4></div>
    </li>`).appendTo('.recipe-list');
  })
}

function displayShoppingList() {
  //list all recipe ingredients
}

function formatIngredients(ingredients) {
  //  return commas separated string of ingredients
  let arr = ingredients.split(' ').join(',')
  return `${arr}`;
}

async function loadPage(ingredients) {
  let arr = await returnRecipeArray(ingredients);
  displayRecipes(arr);
}

//initial page load
$(loadPage(ingredients));
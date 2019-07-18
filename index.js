'use strict'

// cdcaf77900cc416836fc5f4cdba35d47
// da5cea6d324729686c62d2d31d91b0be
// cd576fafe1aba67942e8ee42df5168e9
// 340c0e8204c153aec46ae2103ad8e6eb
// 930bc5b5a9b1fb99dcb2a2e011f64900
// 86bdf91aef7ebad9e0ff67d0b34be435
// e9bbd0a67061b4725aab9461813323c3
//used up
// 3a2fbfa047a5b46ac2a4491aa18105c8
// 5137c8f4084b3e19a8803e2baf2f7604
const apiKey = `5137c8f4084b3e19a8803e2baf2f7604`;
let ingredients = '';

//event listeners ********************************************************
$('.search-btn').on('click submit', function (e) {
  e.preventDefault();
  search($('#search-ingredients').val());
});


// end event listeners******************************************************

function formatIngredients(ingredients) {
  //  return commas separated string of ingredients
  let arr = ingredients.split(' ').join(',')
  return `${arr}`;
}

async function returnRecipeArray(ingredients) {
  let URL = `https://www.food2fork.com/api/search?&key=${apiKey}&q=${ingredients}&sort=r/`;
  let resultsArr = await fetch(URL).then(res => res.json()).then(res => res);
  return resultsArr;
}

async function displayRecipes(recipeArr) {
  $('.recipe-list').html('');
  recipeArr.recipes.forEach(el => {
    $(`<li value="${el.recipe_id}" class="recipe-li"><a href="#" ><img class="thumbnail-img" src='${el.image_url}' alt=${el.title} /></a> <div class='recipe-title-div'><h4 class="recipe-title">${el.title}</h4></div>
    </li>`).appendTo('.recipe-list')
  });
  //add event listener to each li
  $('li').on('click', function (e) {
    e.preventDefault();
    displaySelectedRecipe($(e.target).closest('li').val());
  });
}

async function search(query) {
  let formattedIngs = formatIngredients(query);
  let recipeArr = await returnRecipeArray(formattedIngs);
  await displayRecipes(recipeArr);
  $('#search-ingredients').val('');
}

async function displaySelectedRecipe(recipeId) {
  //remove list of recipes
  //$('.recipe-list').html('');
  //fetch individual recipe
  let chosenRecipe = await fetch(`https://www.food2fork.com/api/get?key=${apiKey}&rId=${recipeId}`).then(res => res.json());
  //display large img with description and ingredients for printing
  let ingredientsList = '';
  await chosenRecipe.recipe.ingredients.forEach(el => {
    ingredientsList += `<li class="ingredients-li">${el}</li>`;
  });
  $('.selected-recipe-sec').removeClass('hidden').html(`<section role="main" class="chosenRecipe-div"><h2 class="chosen-recipe-h2">${chosenRecipe.recipe.title}</h2><figure><img class="chosen-img" src="${chosenRecipe.recipe.image_url}" alt="${chosenRecipe.recipe.title}" title="${chosenRecipe.recipe.title}" /> <figcaption>Published by: ${chosenRecipe.recipe.publisher}</figcaption></figure><br>  <button class="btn print-recipe-btn" type="button" value="Print">Print These Ingredients</button>
  <button class="btn directons-btn" type="button" value="Get Directions" onclick="getDirections('${chosenRecipe.recipe.source_url}')">Get Directions</button> <ul class="recipe-inigredients">${ingredientsList}</ul></section>`);

  // $('.print-recipe-btn').on('click', printFunction);
  // $('.directons-btn').on('click', getDirections(event, chosenRecipe.recipe.source_url) )
}

async function loadPage(ingredients) {
  let arr = await returnRecipeArray(ingredients);
  displayRecipes(arr);
}

function printFunction() {
  //event.preventDefault();
  console.log('Clicked print');
}

function getDirections(url) {
  //event.preventDefault();
  console.log('directions website will launch');
  window.open(url);
}
//initial page load
$(loadPage(ingredients));

//  chosenRecipe.recipe returns -->
// { publisher: "Simply Recipes", f2f_url: "http://food2fork.com/view/36611", ingredients: Array(9), source_url: "http://www.simplyrecipes.com/recipes/moms_roast_turkey/", recipe_id: "36611", … }
// f2f_url: "http://food2fork.com/view/36611"
// image_url: "http://static.food2fork.com/momsroastturkey520a300x189c6d75af3.jpg"
// ingredients: (9)["1 turkey, approx. 15 lbs.*", "Juice of a lemon", "Salt and pepper", "Olive oil or melted butter", "1/2 yellow onion, peeled and quartered", "Tops and bottoms of a bunch of celery", "2 carrots", "Parsley", "Sprigs of fresh rosemary, thyme↵"]
// publisher: "Simply Recipes"
// publisher_url: "http://simplyrecipes.com"
// recipe_id: "36611"
// social_rank: 99.9999999886814
// source_url: "http://www.simplyrecipes.com/recipes/moms_roast_turkey/"
// title: "Mom&#8217;s Roast Turkey"


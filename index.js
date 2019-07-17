'use strict'
const apiKey = `4b871c8253ab9b5fd7195ae15a5ea46b`;
let ingredients = 'chocolate';

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
  let URL = `https://www.food2fork.com/api/search?key=${apiKey}&q=${ingredients}`;
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
  $('.recipe-list').html('');
  //fetch individual recipe
  let chosenRecipe = await fetch(`https://www.food2fork.com/api/get?key=${apiKey}&rId=${recipeId}`).then(res => res.json());
  //display large img with description and ingredients for printing
  let ingredientsList = '';
  chosenRecipe.recipe.ingredients.forEach(el => {
    ingredientsList += `<li class="ingredients-li">${el}</li>`;
  });
  console.log(ingredientsList);
  $('.recipe-list').html(`<section role="main" class="chosenRecipe-div"><img src="${chosenRecipe.recipe.image_url}" alt="${chosenRecipe.recipe.title}" /><br><ul class="recipe-inigredients">${ingredientsList}</ul></section>`);
}

function displayShoppingList() {
  //list all recipe ingredients
}

async function loadPage(ingredients) {
  let arr = await returnRecipeArray(ingredients);
  displayRecipes(arr);
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


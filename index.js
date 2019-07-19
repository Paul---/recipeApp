'use strict'

let apiKey, ingredients = '',
keyArr = [
  '43bff83dd6c189993665cc861c3d9680',
  '5c690c2fd121d8d3d51a524d7ed62c05',
  '9c26949234983d6dc94c84ffc96f0fad',
  '86bdf91aef7ebad9e0ff67d0b34be435',
  'e9bbd0a67061b4725aab9461813323c3',
  'da5cea6d324729686c62d2d31d91b0be',
  'cdcaf77900cc416836fc5f4cdba35d47',
  '3a2fbfa047a5b46ac2a4491aa18105c8',
  '5137c8f4084b3e19a8803e2baf2f7604',
  '3de2f708c1e89205a74b2f2481c957bc',
  'cd576fafe1aba67942e8ee42df5168e9',
  '340c0e8204c153aec46ae2103ad8e6eb',
  '930bc5b5a9b1fb99dcb2a2e011f64900',
  'cfa1a4080b06c23d6c1add846c030fbb',
  '762f624be45e412f54061859d2c8e171',
  'd9bbaa08023b6ca45f80c07c90afba3c'
];
//event listeners ********************************************************
$('.search-btn').on('click', function (e) {
  e.preventDefault();
  search($('#search-ingredients').val());
});

$('#search-ingredients').on('keypress', (e)=>{
if(e.keyCode===13){
  e.preventDefault();
  search($('#search-ingredients').val());
  }
})



// end event listeners******************************************************

function formatIngredients(ingredients) {
  //  return commas separated string of ingredients
  let arr = ingredients.split(' ').join(',')
  return `${arr}`;
}

async function returnRecipeArray(ingredients) {

  let keyNum = 0;
  let response;
  do {

    apiKey = keyArr[keyNum];
    response = await fetch(`https://www.food2fork.com/api/search?key=${apiKey}&q=${ingredients}&sort=r/`).then(res => res.json());
    apiKey = keyArr[keyNum];
    keyNum++;
  } while (response.hasOwnProperty('error'));

  let URL = `https://www.food2fork.com/api/search?&key=${apiKey}&q=${ingredients}&sort=r/`;
  let resultsArr = await fetch(URL).then(res => res.json()).then(res => res);
  return resultsArr;
}

async function displayRecipes(recipeArr) {
  $('.recipe-list').html('');
  recipeArr.recipes.forEach(el => {
    $(`<li value="${el.recipe_id}" class="recipe-li"><img class="thumbnail-img" src='${el.image_url}' alt=${el.title} /><div class='recipe-title-div'><h4 class="recipe-title">${el.title}</h4></div>
    </li>`).appendTo('.recipe-list')
  });
  //add event listener to each li
  $('.recipelist-h3').removeClass('hidden')
  $('li').on('click', function (e) {
    e.preventDefault();
    displaySelectedRecipe($(e.target).closest('li').val());
    document.documentElement.scrollTop = 100;
  });
}

async function search(query) {
  let formattedIngs = formatIngredients(query);
  let recipeArr = await returnRecipeArray(formattedIngs);
  await displayRecipes(recipeArr);
  $('#search-ingredients').val('');
  $('.selected-recipe-sec').html('');
}

async function displaySelectedRecipe(recipeId) {
  //fetch individual recipe
  $('.fetching').removeClass('hidden');
  let chosenRecipe = await fetch(`https://www.food2fork.com/api/get?key=${apiKey}&rId=${recipeId}`).then(res => res.json());
  //display large img with description and ingredients for printing
  let ingredientsList = '';
  await chosenRecipe.recipe.ingredients.forEach(el => {
    ingredientsList += `<li class="ingredients-li">${el}</li>`;
  });
  $('.fetching').addClass('hidden');

  $('.selected-recipe-sec').removeClass('hidden').html(`<section role="main" class="chosenRecipe-div"><div class="container chosen-recipe-h2-div"><h2 role="heading" class="chosen-recipe-h2">${chosenRecipe.recipe.title}</h2></div><figure><img role="image" class="chosen-img" src="${chosenRecipe.recipe.image_url}" alt="${chosenRecipe.recipe.title}" title="${chosenRecipe.recipe.title}" /><div class="container published-by-caption"> <figcaption role="caption">Published by: ${chosenRecipe.recipe.publisher}</figcaption></div></figure><br> <div class="container button-div"> <button role="button" class="btn print-recipe-btn" type="button" value="Print" onclick="printFunction()">Print</button>
  <button role="button" class="btn directons-btn" type="button" value="Get Directions" onclick="getDirections('${chosenRecipe.recipe.source_url}')">Get Directions</button></div> <div class="recipe-list-div"><ul class="recipe-inigredients">${ingredientsList}</ul></div></section>`);
}

async function loadPage(ingredients) {
  $('#scripts-error-msg').remove();
  let arr = await returnRecipeArray(ingredients);
  $('.loading-div').remove();
  displayRecipes(arr);
}

function printFunction() {
  print($('.chosenRecipe-div'));
}

function getDirections(url) {
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


'use strict'

//API Endpoints
const ApiUrlGet = `https://www.food2fork.com/api/get?key=`,
  ApiUrlSearch = `https://www.food2fork.com/api/search?key=`;

let apiKey, ingredients = '',
  // Required API Keys
  keyArr = [
    'beeff984a8932bdb8ff4d9ebe82b8e5d',
    '6fa2d41235620165b889e088cbfb0fee',
    '64cbf1f4967702e0bbab5feab34b4ff3',
    '0600cbf997ef65c5402b91cc5609bfb9',
    '7242ecab3cd3fd117c6b8e50bd010bef',
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
    'd9bbaa08023b6ca45f80c07c90afba3c',
    'f64610acd7e381627234affbfcc83367',
    '3abdfd2143493a0f2a5234fb51f9bd9f'
  ];

//event listeners 
//Serach on click
$('.search-btn').on('click keypress', function (e) {
  goSearch(e);
});
//call search on enter button
$('#search-ingredients').on('keypress', (e) => {
  if (e.keyCode === 13 ) {
    goSearch(e);
  }
})

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
    response = await fetch(`${ApiUrlSearch}${apiKey}&q=${ingredients}&sort=r/`).then(res => res.json()).catch(e => {
      errorMsg();
    });
    apiKey = keyArr[keyNum];
    keyNum++;
  } while (response.hasOwnProperty('error'));
  let URL = `${ApiUrlSearch}${apiKey}&q=${ingredients}&sort=r/`;
  let resultsObj = await fetch(URL).then(res => res.json()).then(res => res).catch(e => {
    //display network error message
    errorMsg();
  });
  return resultsObj;
}

async function displayRecipes(recipeObj) {
  $('.recipe-list').html('');
  if (recipeObj.recipes.length === 0) {
    $('.fetching').addClass('hidden');
    $('.no-results').removeClass('hidden');
  } else {
    recipeObj.recipes.forEach(el => {
      $(`<li value="${el.recipe_id}" class="recipe-li"><img class="thumbnail-img" src='${el.image_url}' alt="${el.title}" /><div class='recipe-title-div'><h4 class="recipe-title">${el.title}</h4></div>
    </li>`).appendTo('.recipe-list')
    });
    //add event listener to each li
    $('.recipelist-h3').removeClass('hidden')
    $('li').on('click', function (e) {
      e.preventDefault();
       displaySelectedRecipe($(e.target).closest('li').attr('value'));
      window.scroll({
        top: 100
      })
    });
  }
}

async function search(query) {
  //make sure 'no results' message is hidden
  $('.no-results').addClass('hidden');
  //show fetching message
  $('.fetching').removeClass('hidden');
  let formattedIngs = formatIngredients(query);
  let recipeArr = await returnRecipeArray(formattedIngs);
  await displayRecipes(recipeArr);
  displaySelectedRecipe(recipeArr.recipes[0].recipe_id);
  //hide fetching message
  $('.fetching').addClass('hidden');
  $('#search-ingredients').val('');
  $('.selected-recipe-sec').html('');
}

async function displaySelectedRecipe(recipeId = 47746) {
  //fetch individual recipe
  $('.fetching').removeClass('hidden');
  let chosenRecipe = await fetch(`${ApiUrlGet}${apiKey}&rId=${recipeId}`).then(res => res.json()).catch(e => {
    errorMsg();
  });
  //display large img with description and ingredients for printing
  let ingredientsList = '';
  let res = await chosenRecipe.recipe.ingredients;

  if (res === undefined) {
    $('.fetching').addClass('hidden');
    alert('Broken Link--Please Try A Different One');
  }
  res.forEach(el => {
  ingredientsList += `<li class="ingredients-li">${el}</li>`;
  });
  //Hide fetching message
  $('.fetching').addClass('hidden');
  //Display selected recipe
  $('.selected-recipe-sec').removeClass('hidden').html(`
  <section role="main" class="chosenRecipe-div">
  <div class="container chosen-recipe-h2-div">
    <h2 role="heading" class="chosen-recipe-h2">${chosenRecipe.recipe.title}</h2>
  </div>
  <figure> <img role="image" class="chosen-img" src="${chosenRecipe.recipe.image_url}"
      alt="${chosenRecipe.recipe.title}" title="${chosenRecipe.recipe.title}" />
    <div class="container published-by-caption">
      <figcaption role="caption">Published by: ${chosenRecipe.recipe.publisher} </figcaption>
    </div>
  </figure> <br>
  <div class="container button-div"> <button role="button" class="btn print-recipe-btn" type="button" value="Print"
      onclick="printFunction()">Print</button>
    <button role="button" class="btn directons-btn" type="button" value="Get Directions"
      onclick="getDirections('${chosenRecipe.recipe.source_url}')">Get Directions</button> </div>
  <div class="recipe-list-div">
    <ul class="recipe-inigredients">${ingredientsList}</ul>
  </div>
 </section>
  `);
}

async function loadPage(ingredients) {
  $('#scripts-error-msg').remove();
  let arr = await returnRecipeArray(ingredients);
  $('.loading-div').remove();
  displayRecipes(arr);
  displaySelectedRecipe(arr.recipes[Math.floor(Math.random() * Math.floor(30))].recipe_id);
}

function errorMsg() {
  //display network error message
  $('.fetching').addClass('hidden');
  $('.recipe-list-section').addClass('hidden');
  $('.serverErr').addClass('hidden')
  $('.top-section').append(`<h2 class="serverErr">We're encountering network difficulties. Please check your internet connection and try again.</h2>`);
}

function goSearch(e){
  e.preventDefault();
  search($('#search-ingredients').val());
}

function printFunction() {
  print($('.chosenRecipe-div'));
}

function getDirections(url) {
  window.open(url);
}

//initial page load
$(loadPage(ingredients));


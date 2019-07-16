//make sure to use jQuery
'use strict'


const fetchURL =(ingredients)=>{
  const corsWorkAround = `https://api.allorigins.win/get?url=`
  let puppyURL = `${corsWorkAround}${encodeURIComponent('http://www.recipepuppy.com/api/?')}`
  fetch(puppyURL).then(res => res.json()).then(res => JSON.parse(res.contents)).then(res => res.results.forEach(el => {
    $(`<li>${el.title} <br> <a href="${el.href}" target="_blank" ><img src='${el.thumbnail}' alt=${el.title} /> </a> <br> ${el.ingredients}
    </li>`).appendTo('.recipe-list')
  }) );
  
}

fetchURL();

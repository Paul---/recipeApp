//make sure to use jQuery
'use strict'

const puppyURL = `https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/`

fetch(puppyURL).then( res=>res.json() ).then(res=>console.log(res))

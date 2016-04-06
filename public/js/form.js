function formToObj(form) {  
  var elems = form.elements
  var formObj = {}, i, len = elems.length, str=''

  for(i = 0; i < len; i += 1) {
    var element = elems[i]
    var type = element.type
    var name = element.name
    var value = element.value
    if (value !== '')
      formObj[name] = value
  }
  return formObj
}


var myForm = document.querySelector('form')

myForm.addEventListener('submit', function (e) {
  e.preventDefault()
  //console.log('elements:', myForm.elements)
  fetch('/login', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: formToObj(myForm)
    })
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
    var result = document.querySelector('.notification .status')
    result.textContent = json.status
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
})
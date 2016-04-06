var htmlparser = require("htmlparser2")
var request = require("request")
// ^^ You will need to NPM install these two ^^
var jar = request.jar()
var config = {}
var req = {
  method: "POST",
  jar: jar,
  form: {}
}
var parser = new htmlparser.Parser({
  onopentag: function(name, attribs) {
    if (name === "input") {
      //console.log("name:", name)
      //console.log("attribs:", attribs)
      if (attribs.name === 'tbUserName') {
        req.form[attribs.name] = config.user
      } else if(attribs.name === 'tbUserPassword'){
        req.form[attribs.name] = config.pass
      } else {
        if (attribs.value) {
          req.form[attribs.name] = attribs.value
        }
      }
    }
    if (name === "form") {
      //console.log("name:", name)
      //console.log("attribs:", attribs)
      req.action = attribs.action
    }
  },
  ontext: function(text) {
    if (text !== ''){
      //console.log("-->'"+ text+"'");
    }
  },
  onclosetag: function(tagname) {
    if (tagname === "form") {
      //console.log("end form");
    }
  }
}, {
  decodeEntities: true
})

function tryAuth(cb) {
  console.log('attemping login...')
  request({
    uri: 'https://w3.ucollege.edu/PG/login.aspx?ReturnUrl=/PG/default.aspx',
    method: req.method,
    jar: jar,
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10,
    form: req.form
    }, function(error, response, body) {
      if (error) {
        return console.warn('error!', error);
      }
      console.log('response status:', response.statusCode)
      jar = request.jar()
      if (response.statusCode === 302)
        cb(true)
      else if (response.statusCode === 500)
        cb(500)
      else
        cb(false)
      //console.log('body:', body)
    }
  )
}
function doAuth(user, password, cb) {
  config.user = user
  config.pass = password
  request({
    uri: "https://www.ucollege.edu/pg",
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10,
    jar: jar
  }, function(error, response, body) {
    if (error) {
      return console.warn('error!', error);
    }
    //console.log('response:', response)
    /*console.log('response status:', response.statusCode)
    console.log('req domain:', response.request.uri.host)
    req.uri = response.request.uri.host
    //console.log('body:', body)
    */
    parser.write(body)
    parser.end()
    tryAuth(cb)
  })
}

module.exports = doAuth
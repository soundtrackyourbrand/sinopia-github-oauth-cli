var opener = require('opener');
var http = require('http');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').execSync;

var registry = exec('npm config get registry').toString().trim()

opener(registry + 'oauth/authorize');

fs.readFile('./index.html', function(err, html) {
  if (err) {
    throw err;
  }

  http.createServer(function(req, res) {
    var query = url.parse(req.url, true).query;
    var token = decodeURIComponent(query.token);

    var u = url.parse(registry);
    var keyBase = '//' + u.host + u.path + ':'
    exec('npm config set ' + keyBase + '_authToken "' + token + '"');
    exec('npm config set ' + keyBase + 'always-auth true');

    res.writeHeader(200, {"Content-Type": "text/html"});
    res.end(html, function() {
      process.exit(0);
    });

  }).listen(8239);
})

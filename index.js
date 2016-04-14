var opener = require('opener');
var http = require('http');
var url = require('url');
var exec = require('child_process').execSync;

var registry = exec('npm config get registry').toString().trim()

opener(registry + 'oauth/authorize');

http.createServer(function(req, res) {
  var query = url.parse(req.url, true).query;
  var token = decodeURIComponent(query.token);

  var u = url.parse(registry);
  var keyBase = '//' + u.host + u.path + ':'
  exec('npm config set ' + keyBase + '_authToken "' + token + '"');
  exec('npm config set ' + keyBase + 'always-auth true');

  res.write('DONE! Get back to your terminal!');
  res.end();

  process.exit(0);

}).listen(8239);

var opener = require('opener');
var http = require('http');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').execSync;
var path = require('path');

var argv = require('minimist')(process.argv.slice(2));
var registry = (argv.registry || exec('npm config get registry').toString()).trim();
registry = registry.replace(/\/?$/, '/'); //Add trailing slash if needed
if (registry.indexOf('registry.npmjs.org') > -1) {
  console.log('It seems you are using the default npm repository.');
  console.log('Please update it to your sinopia url by either running:');
  console.log('');
  console.log('npm config set registry <url>');
  console.log('');
  console.log('or by using registry argument');
  console.log('');
  console.log('sinopia-github-oauth --registry <url>');
  process.exit(0);
}

opener(registry + 'oauth/authorize');

fs.readFile(path.join(__dirname, 'index.html'), function(err, html) {
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

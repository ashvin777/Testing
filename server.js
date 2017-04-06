var connect = require('connect'),
  httpProxy = require('http-proxy');

var app = connect();

var proxy = httpProxy.createProxyServer({
  target: 'https://www.google.com'
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=');
});

proxy.on('error', function(e) {
  console.log(e);
});

app.use(function(req, res, next) {
  if (req.headers['origin']) {
    res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
    res.setHeader('Access-Control-Max-Age', '3600');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
  }
  if (req.method !== 'OPTIONS') {
    next();
  } else {
    res.end();
  }
});

app.use(function(req, res) {
  proxy.web(req, res);
});

app.listen(8000);
console.log('Proxy server started.')

   
const { HttpRequest} = require("@aws-sdk/protocol-http");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { Sha256 } = require("@aws-crypto/sha256-browser");

var https = require('https');
var xml = require('xml2js');

const aws = require("aws-sdk");
aws.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  else {
    console.log("Access key:", aws.config.credentials.accessKeyId);
  }
});
console.log("full credentials: %j", aws.config.credentials);

const bucketName = 'fileserver-authentification-test';  // bucket name

const run = async () => {
    var region = 'ap-northeast-2';
    var domain = bucketName+'.s3.'+region+'.amazonaws.com';
    
    console.log('domain: '+domain);

    var myService = 's3';
    var myMethod = 'GET';
    var myPath = '/';
    var body = '';

    // Create the HTTP request
    var request = new HttpRequest({
        headers: {
            'host': domain
        },
        hostname: domain,
        method: myMethod,
        path: myPath,
        body: body,
    });
    console.log('request: %j', request);

    // Sign the request
    var signer = new SignatureV4({
        credentials: defaultProvider(),
        region: region,
        service: myService,
        sha256: Sha256
    });
    console.log('signer: %j', signer);

    var signedRequest;
    try {
        signedRequest = await signer.sign(request);
        console.log('signedRequest: %j', signedRequest);

    } catch(err) {
        console.log(err);
    }

    // request
    performRequest(domain, signedRequest.headers, signedRequest.body, myPath, myMethod, function(response) {    
        // parse the response from our function and write the results to the console
        xml.parseString(response, function (err, result) {
            if(err) {
                console.log('err: '+err);
            }
            else {
                console.log('result: %j', result);
            };
        });
    });
};
run();

// the REST API call using the Node.js 'https' module
function performRequest(endpoint, headers, data, path, method, success) {
    var dataString = data;
  
    var options = {
      host: endpoint,
      port: 443,
      path: path,
      method: method,
      headers: headers
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');
    
        var responseString = '';
    
        res.on('data', function(data) {
            responseString += data;
        });
    
        res.on('end', function() {
            //console.log(responseString);
            success(responseString);
        });
    });

    req.write(dataString);
    req.end();
} 


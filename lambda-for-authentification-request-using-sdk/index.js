   
const { HttpRequest} = require("@aws-sdk/protocol-http");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { Sha256 } = require("@aws-crypto/sha256-browser");

const bucketName = process.env.bucketName; 
var https = require('https');
var xml = require('xml2js');

exports.handler = async (event, context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## EVENT: ' + JSON.stringify(event))
    
    var region = process.env.AWS_DEFAULT_REGION;
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

    // Sign the request
    var signer = new SignatureV4({
        credentials: defaultProvider(),
        region: region,
        service: myService,
        sha256: Sha256
    });

    var signedRequest;
    try {
        signedRequest = await signer.sign(request);
        console.log('signedRequest: %j', signedRequest);

    } catch(err) {
        console.log(err);
    }

    // request
    let isCompleted = false;
    performRequest(domain, signedRequest.headers, signedRequest.body, function(response) {    
        // parse the response from our function and write the results to the console
        xml.parseString(response, function (err, result) {
            if(err) {
                console.log('err: '+err);
            }
            else {
                console.log('result: %j', result);
            };
            
            isCompleted = true;
        });
    });

    function wait(){
        return new Promise((resolve, reject) => {
          if(!isCompleted) {
            setTimeout(() => resolve("wait..."), 1000)
          }
          else {
            setTimeout(() => resolve("wait..."), 0)
          }
        });
    }
    console.log(await wait());
    console.log(await wait());
    console.log(await wait());
    console.log(await wait());
    console.log(await wait());

    const response = {
        statusCode: 200,
    };
    return response;
};

// the REST API call using the Node.js 'https' module
function performRequest(endpoint, headers, data, success) {
    var dataString = data;
  
    var options = {
      host: endpoint,
      port: 443,
      path: '/',
      method: 'GET',
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
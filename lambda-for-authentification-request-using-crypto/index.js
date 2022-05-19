var crypto = require('crypto-js');
var https = require('https');
var xml = require('xml2js');

const bucketName = process.env.bucketName; 
const access_key = process.env.access_key;
const secret_key = process.env.secret_key;

exports.handler = async (event, context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## EVENT: ' + JSON.stringify(event))
    
    console.log('AWS_ACCESS_KEY_ID: '+process.env.AWS_ACCESS_KEY_ID);
    console.log('AWS_SECRET_ACCESS_KEY: '+process.env.AWS_SECRET_ACCESS_KEY);
    console.log('AWS_DEFAULT_REGION: '+process.env.AWS_DEFAULT_REGION);
        
    var region = process.env.AWS_DEFAULT_REGION;
    var url = bucketName+'.s3.'+region+'.amazonaws.com';
    console.log('url: '+url);
    
    var myService = 's3';
    var myMethod = 'GET';
    var myPath = '/';

    // get the various date formats needed to form our request
    var amzDate = getAmzDate(new Date().toISOString());
    var authDate = amzDate.split("T")[0];
    console.log('authData: '+authDate);

    // we have an empty payload here because it is a GET request
    var payload = '';
    // get the SHA256 hash value for our payload
    var hashedPayload = crypto.SHA256(payload).toString();
    
    console.log('hashedPayload: '+hashedPayload);

    // create our canonical request
    var canonicalReq =  myMethod + '\n' +
        myPath + '\n' +
        '\n' +
        'host:' + url + '\n' +
        'x-amz-content-sha256:' + hashedPayload + '\n' +
        'x-amz-date:' + amzDate + '\n' +
        '\n' +
        'host;x-amz-content-sha256;x-amz-date' + '\n' +
        hashedPayload;
        
    // hash the canonical request
    var canonicalReqHash = crypto.SHA256(canonicalReq).toString();
    console.log('canonicalReqHash: '+canonicalReqHash);

    // form our String-to-Sign
    var stringToSign =  'AWS4-HMAC-SHA256\n' +
        amzDate + '\n' +
        authDate+'/'+region+'/'+myService+'/aws4_request\n'+
        canonicalReqHash;

    // get our Signing Key
    var signingKey = getSignatureKey(crypto, secret_key, authDate, region, myService);
    console.log('signingKey: '+signingKey);

    // Sign our String-to-Sign with our Signing Key
    var authKey = crypto.HmacSHA256(stringToSign, signingKey);
    console.log('authKey: '+authKey);

    // Form our authorization header
    var authString  = 'AWS4-HMAC-SHA256 ' +
        'Credential='+
        access_key+'/'+
        authDate+'/'+
        region+'/'+
        myService+'/aws4_request,'+
        'SignedHeaders=host;x-amz-content-sha256;x-amz-date,'+
        'Signature='+authKey;
        
    console.log('authString: '+authString);    
    
    // throw our headers together
    const headers = {
        'Authorization' : authString,
        'Host' : url,
        'x-amz-date' : amzDate,
        'x-amz-content-sha256' : hashedPayload
    };

    // call our function
    let isCompleted = false;
    performRequest(url, headers, payload, function(response) {    
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

// this function gets the Signature Key, see AWS documentation for more details, this was taken from the AWS samples site
function getSignatureKey(Crypto, key, dateStamp, regionName, serviceName) {
    var kDate = Crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = Crypto.HmacSHA256(regionName, kDate);
    var kService = Crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = Crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}

// this function converts the generic JS ISO8601 date format to the specific format the AWS API wants
function getAmzDate(dateStr) {
    var chars = [":","-"];
    for (var i=0;i<chars.length;i++) {
        while (dateStr.indexOf(chars[i]) != -1) {
            dateStr = dateStr.replace(chars[i],"");
        }
    }
    dateStr = dateStr.split(".")[0] + "Z";
    return dateStr;
}

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
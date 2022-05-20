# Node.JS Client에서 AWS SDK를 이용한 Lambda Funtion URL 요청

## 설치 및 실행 결과 

여기에서는 Node.JS로 된 독립된 Client가 Temparary security credential을 이용하여 S3에 있는 파일 리스트를 확인 합니다.

1) [관련 코드](https://github.com/kyopark2014/aws-security-token-service/tree/main/client)을 디렉토리 포함하여 다운로드 받습니다. 

2) 아래와 같이 client를 node로 실행합니다. 

```c
$ node client-url.js
```

3) 실행시 얻어진 정보는 아래와 같습니다. 

```java
response: "\"Hello from Lambda!\""
```


## 주요 코드 설명

아래와 같이 AWS SDK를 이용하여 temparary security credential을 구합니다. 

```java
   const params = {
        RoleArn: 'arn:aws:iam::123456789012:role/role-for-s3-fileserver',
        RoleSessionName: 'session',
    };
    const assumeRoleCommand = new AssumeRoleCommand(params);
    
    let data;
    try {
        data = await sTS.send(assumeRoleCommand);
    
        console.log('data: %j',data);
    } catch (error) {
          console.log(error);
    }
```

새로운 credential로 업데이트 합니다.

```java
    aws.config.credentials.accessKeyId = data.Credentials.AccessKeyId;
    aws.config.credentials.sessionToken = data.Credentials.SessionToken;
    console.log("modified credentials: %j", aws.config.credentials);
```

아래와 같이 signature를 구합니다.

```java
    var region = 'ap-northeast-2';
    var domain = 'hgwavninyisqd6utbvywn7drpe0mvkwp.lambda-url.ap-northeast-2.on.aws';
    
    console.log('domain: '+domain);

    var myService = 'lambda';
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
```

아래와 같이 https로 Lambda Function URL에 접속을 합니다.

```java
    // request
    performRequest(domain, signedRequest.headers, signedRequest.body, myPath, myMethod, function(response) {    
        console.log('response: %j', response);
    });
    
    
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
```

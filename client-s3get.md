# Node.JS Client에서 AWS SDK를 이용한 S3 파일 리스트 확인

여기에서는 Node.JS로 된 독립된 Client가 Temparary security credential을 이용하여 S3에 있는 파일 리스트를 확인 합니다.

## 설치 및 시험

1) [관련 코드](https://github.com/kyopark2014/aws-security-token-service/tree/main/client)을 디렉토리 포함하여 다운로드 받습니다. 

2) 아래와 같이 client를 node로 실행합니다. 

```c
$ node client-s3get.js
```

3) 실행시 얻어진 정보는 아래와 같습니다. 

```java
{
   "ListBucketResult":{
      "$":{
         "xmlns":"http://s3.amazonaws.com/doc/2006-03-01/"
      },
      "Name":[
         "fileserver-authentification-test"
      ],
      "Prefix":[
         ""
      ],
      "Marker":[
         ""
      ],
      "MaxKeys":[
         "1000"
      ],
      "IsTruncated":[
         "false"
      ],
      "Contents":[
         {
            "Key":[
               "sample3.jpeg"
            ],
            "LastModified":[
               "2022-05-19T01:16:23.000Z"
            ],
            "ETag":[
               "\"093a049457c901fcf2d40d978cdc1d1b\""
            ],
            "Size":[
               "2620808"
            ],
            "Owner":[
               {
                  "ID":[
                     "00668b9389bf6cc10c04459c18d086fda0b2133259451402d70ff59a72f10b0b"
                  ]
               }
            ],
            "StorageClass":[
               "STANDARD"
            ]
         }
      ]
   }
}
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

아래와 같이 하여 signatue를 구합니다. 

```java
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
```

S3에 저장된 파일 정보를 아래와 같이 조회합니다.

```java
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
```    

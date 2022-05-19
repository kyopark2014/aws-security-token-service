# AWS REST API Authentication (Crypto 이용)

[AWS REST API Authentication Demo](https://github.com/railroadmanuk/awsrestauthentication)을 참조하여 restful api로 S3의 파일에 대해 검색하고자 합니다. 

##  Crypto로 인증요청을 테스트하기 위한 Lambda 생성

1) [lambda-for-authentification-request-using-crypto](https://github.com/kyopark2014/aws-security-token-service/tree/main/lambda-for-authentification-request-using-crypto)의 소스를 clone 합니다.

2) Lambda console에서 "lambda-for-authentification-request-using-crypto"로 lambda를 생성합니다. 

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

3) 생성된 lambda의 environment variables을 아래와 같이 입력합니다. 

![noname](https://user-images.githubusercontent.com/52392004/169189374-fdd7e7d1-a340-4ffb-bb7e-765b91068250.png)

4) "lambda-for-authentification-request-using-crypto"을 [run]하여 결과를 확인 합니다. 

## 관련 코드 정리 

[Authenticated Amazon S3 REST request](https://docs.aws.amazon.com/AmazonS3/latest/userguide/RESTAuthentication.html)와 같이 "Authorization" 헤더의 생성이 필요합니다. 

[Authenticating Requests (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html#auth-methods-intro)와 같이 "StringToSign"과 "Signing Key"를 생성하여 "Signature"를 생성하여야 합니다. 

![image](https://user-images.githubusercontent.com/52392004/169191424-a6c603f3-fd4d-4f12-a493-b353541213f5.png)

[Authenticating Requests: Using the Authorization Header (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-auth-using-authorization-header.html)에 따라 canonicalReq을 생성합니다.

![signature](https://user-images.githubusercontent.com/52392004/169192051-792e9eee-0570-493a-a10f-a074bc41d726.png)



```java
    var canonicalReq =  myMethod + '\n' +
        myPath + '\n' +
        '\n' +
        'host:' + url + '\n' +
        'x-amz-content-sha256:' + hashedPayload + '\n' +
        'x-amz-date:' + amzDate + '\n' +
        '\n' +
        'host;x-amz-content-sha256;x-amz-date' + '\n' +
        hashedPayload;
```

아래와 같이 "StringToSign"을 생성하고, Signature를 생성합니다.

```java
    var stringToSign =  'AWS4-HMAC-SHA256\n' +
        amzDate + '\n' +
        authDate+'/'+region+'/'+myService+'/aws4_request\n'+
        canonicalReqHash;

    var signingKey = getSignatureKey(crypto, secret_key, authDate, region, myService);
```


아래와 같이 authKey를 생성하고 authString을 만듧니다.


```java
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
```

결과적으로 아래와 같은 header를 request에 사용할 수 있습니다. 

```java
    const headers = {
        'Authorization' : authString,
        'Host' : url,
        'x-amz-date' : amzDate,
        'x-amz-content-sha256' : hashedPayload
    };
```    


## 시험 결과

아래와 같이 [Authenticating Requests (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html#auth-methods-intro)에 따라 인증을 거쳐서 아래와 같이 Restful API로 S3의 파일정보를 확인 할 수 있습니다.

```java
{
    "ListBucketResult": {
        "$": {
            "xmlns": "http://s3.amazonaws.com/doc/2006-03-01/"
        },
        "Name": [
            "fileserver-authentification-test"
        ],
        "Prefix": [
            ""
        ],
        "Marker": [
            ""
        ],
        "MaxKeys": [
            "1000"
        ],
        "IsTruncated": [
            "false"
        ],
        "Contents": [
            {
                "Key": [
                    "sample3.jpeg"
                ],
                "LastModified": [
                    "2022-05-19T01:16:23.000Z"
                ],
                "ETag": [
                    "\"093a049457c901fcf2d40d978cdc1d1b\""
                ],
                "Size": [
                    "2620808"
                ],
                "Owner": [
                    {
                        "ID": [
                            "00668b9389bf6cc10c04459c18d086fda0b2133259451402d70ff59a72f10b0b"
                        ]
                    }
                ],
                "StorageClass": [
                    "STANDARD"
                ]
            }
        ]
    }
}
```



## Reference 

[Authorization header](https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html)

[AWS REST API Authentication Demo](https://github.com/railroadmanuk/awsrestauthentication)

[AWS REST API Authentication Using Node.js](https://virtualbrakeman.wordpress.com/2017/02/13/aws-rest-api-authentication-using-node-js/)

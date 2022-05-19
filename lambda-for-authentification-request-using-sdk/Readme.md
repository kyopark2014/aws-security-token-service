# AWS REST API Authentication (AWS SDK)

AWS SDK를 이용하여 restful api로 S3의 파일에 대해 검색하고자 합니다. 

## AWS SDK로 인증요청을 테스트하기 위한 Lambda 생성

1) [lambda-for-authentification-request-using-sdk](https://github.com/kyopark2014/aws-security-token-service/tree/main/lambda-for-authentification-request-using-sdk)의 소스를 clone 합니다.

2) Lambda console에서 "lambda-for-authentification-request-using-sdk"로 lambda를 생성합니다. 

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

3) 생성된 lambda의 environment variables을 아래와 같이 입력합니다. 

![noname](https://user-images.githubusercontent.com/52392004/169335866-03017f03-e7a7-4aca-91e5-67a25549e7b7.png)

4) lambda에 아래와 같이 S3에 대한 퍼미션을 부여합니다.

```java
{
    "Effect": "Allow",
    "Action": [
        "s3:*",
        "s3-object-lambda:*"
    ],
    "Resource": "*"
}
```        

5) "lambda-for-authentification-request-using-sdk"을 [run]하여 결과를 확인 합니다. 

## 관련 코드 정리 

bucket 이름과 region을 조합하여 domain을 생성합니다. 

```java
    var region = process.env.AWS_DEFAULT_REGION;
    var domain = bucketName+'.s3.'+region+'.amazonaws.com';
    console.log('domain: '+domain);
```    

http get에 대한 request는 아래와 같습니다. 

```java
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
```    

Sign된 request는 아래와 같이 구할 수 있습니다. 

```java
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
```


## 시험 결과

sign된 Request의 값은 아래와 같습니다. 여기서 Temparary security credential이 이용되고 있음을 확인 할 수 있습니다.

```java
{
    "method": "GET",
    "hostname": "fileserver-authentification-test.s3.ap-northeast-2.amazonaws.com",
    "query": {},
    "headers": {
        "host": "fileserver-authentification-test.s3.ap-northeast-2.amazonaws.com",
        "x-amz-date": "20220519T151257Z",
        "x-amz-security-token": "SampleZ2luX2VjEBcaDmFwLW5vcnRoZWFzdC0yIkYwRAIgByb0jgIaKMrrjkZd/6gWktf25aLoLezJV3W1uKt1QsECIH/UwyFftYQW1u4tBvX84j0sZz/P3Vlxi23X3oc4xe89Kq0CCPD//////////wEQABoMNjc3MTQ2NzUwODIyIgzhf/qDjRqq+r81p3IqgQKTr32UQ+l4PkAwMlFXbzzkRyp3F61jeXLsGW6MW5HQRIEGnC8WSYMGG8qaaRImCanTUUyucGWZLugNqtmbWjn2kwltIKlcKw0G8+RqfQXTLxEzIQJzfiP2XxNieEG8lyrPMj5Y3KMsrTFzOiyryyPVmmZIO9pcTMkQSVrtaIGA/yLM3mbwSP+oJfGsHxHcKpkNISKlzkZ+RnEhYfnzfFPVisexlB/ILv7I9X9wgMjoM/zxBEVJm/qwcCWrXkSJLsrto03VFqimF3pNCIy5ZSdEj+9/zs95WNA0BCU6LgwS9TJeZmb8mulR6Km6tLS/KwpgAPwCTLSC/6TRbXx3RfrCbzDyrJmUBjqbAXYE0PZeNPsn3NFl3wl4pI99oRwbB+pCLNfTnMvUsoMxMymNjOxy2NqY/AxCHZZm/26x0sG9lr9eIWHHWUBbJe96H1vZEMQHvrhQkiMmrSOdNB2kXrSJ0R823sKEf5KI0usVap0Kd0rC+XaJF3LoYUYldD+oY0aP547YcJqha5QbLPr3dtiCidEzbh0mTCoWTIHlhsv/lclS4HtG",
        "x-amz-content-sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "authorization": "AWS4-HMAC-SHA256 Credential=SAMPLEKIXN5TFB4MVIHI/20220519/ap-northeast-2/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date;x-amz-security-token, Signature=sample587ef9cdf12fd740d1fe54b250978a370f1cbf06d051b7089b24a2b6a"
    },
    "body": "",
    "protocol": "https:",
    "path": "/"
}
```


Sigened header와 body를 이용해 S3 domain으로 request를 보내면, 아래와 같이 S3의 파일정보를 확인 할 수 있습니다.

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

[Signing HTTP requests to Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/request-signing.html#es-request-signing-node)

[AWS REST API Authentication Using Node.js](https://virtualbrakeman.wordpress.com/2017/02/13/aws-rest-api-authentication-using-node-js/)

# Node.JS Client에서 AWS SDK를 이용한 S3 파일 리스트 확인

여기에서는 Node.JS로 된 독립된 Client가 Temparary security credential을 이용하여 S3에 있는 파일 리스트를 확인 합니다.

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

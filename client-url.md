# Node.JS Client에서 AWS SDK를 이용한 Lambda Funtion URL 요청

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

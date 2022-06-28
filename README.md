# AWS STS를 이용한 Temparary security credential 활용하기 

[Lambda의 Function URL](https://aws.amazon.com/ko/about-aws/whats-new/2022/04/aws-lambda-function-urls-built-in-https-endpoints/)와 같이 IAM을 이용하여 REST api를 호출할때는 보안상 Temparary security credential를 고려해 볼 수 있습니다. 여기에서는 AWS CLI 또는 Amazon Lambda를 이용해 STS(Security Token Server)로 부터 Temparary security credential을 생성하여 Lambda Function URL을 호출할때 사용하고, Crypto와 AWS SDK를 이용해 REST API로 S3를 호출하는 예제를 제공합니다.

## Temporary security credential 

AWS Security Token Service (AWS STS) creates and provides trusted users with temporary security credentials that can control access to your AWS resources. Temporary security credentials work almost identically to the long-term access key credentials that your IAM users can use, with the following differences:

Temporary security credentials are short-term, as the name implies. They can be configured to last for anywhere from a few minutes to several hours. After the credentials expire, AWS no longer recognizes them or allows any kind of access from API requests made with them.

Temporary security credentials are not stored with the user but are generated dynamically and provided to the user when requested. When (or even before) the temporary security credentials expire, the user can request new credentials, as long as the user requesting them still has permissions to do so.


## AWS CLI를 이용한 Temparary security credential 생성하기 

[AWS CLI를 이용한 temparary secruity credential](https://github.com/kyopark2014/aws-security-token-service/blob/main/credential-using-aws-cli.md)에서는 AWS CLI를 이용한 temparary security credential을 생성하는 방법을 설명합니다. 

## Lambda 를 이용하여 Temparary security credential 생성하기 

[lambda-for-sts](https://github.com/kyopark2014/aws-security-token-service/tree/main/lambda-for-sts)에서는 lambda를 이용하여 STS에 접속해, temparary security credential를 얻어오는 과정을 설명합니다. 

## Temparary security credential로 Lambda Function URL 호출하기 

[Temparary Security credential 을 이용하여 Lambda Function URL 접속](https://github.com/kyopark2014/aws-security-token-service/blob/main/lambda-invation-using-temp-credential.md)에 따라 Lambda Function URL로 Temparary security credential을 이용해 API를 호출 할 수 있습니다.

## AWS REST API Authentication 

### Lambda에서 Crypto 이용하여 S3 파일 리스트 확인

[Crypto를 이용한 AWS REST API Authentication](https://github.com/kyopark2014/aws-security-token-service/tree/main/lambda-for-authentification-request-using-crypto)와 같이 [Signing AWS requests with Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html)을 이용하여 S3에 저장된 파일 정보를 읽어 올 수 있습니다. 

### Lambda에서 AWS SDK를 이용하여 S3 파일 리스트 확인

[AWS SDK를 이용한 AWS REST API Authentification](https://github.com/kyopark2014/aws-security-token-service/tree/main/lambda-for-authentification-request-using-sdk)와 같이 AWS SDK를 이용하여 S3에 저장된 파일정보를 읽어 올 수 있습니다. Lambda는 Temparary security credential을 Environment variable로 사용하므로 별도 구현없이 AWS SDK 안전하게 REST API를 호출 할 수 있습니다. 

### Node.JS Client에서 Temparary security credential를 이용하여 S3 파일 리스트 확인 

[Node.JS로 된 독립된 Client가 Temparary security credential을 이용하여 S3에 있는 파일 리스트](https://github.com/kyopark2014/aws-security-token-service/blob/main/client-s3get.md)를 확인 합니다. 

### Node.JS Client에서 Temparary security credential를 이용하여 Lambda Function URL에 요청 

[Node.JS로 된 독립된 Client가 Temparary security credential을 이용하여 Lambda Funtion URL에 접속](https://github.com/kyopark2014/aws-security-token-service/blob/main/client-url.md)을 요청하고 응답을 확인 할 수 있습니다. 

## Reference

[Temporary security credentials in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)


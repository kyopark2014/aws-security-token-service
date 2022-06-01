# Lambda를 이용한 STS 연결 

여기서는 STS(Security Token Server)를 접속해서 token을 받아오는 것을 Lambda를 통해 구현해보고자 합니다. 

## Lambda 생성

1) Lambda console로 이동하여, [Create function]을 선택합니다.

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

2) 이름으로 "lambda-stscliet"로 입력후, [Create function]을 선택하여 lambda를 생성합니다.

3) [Lambda for sts](https://github.com/kyopark2014/aws-security-token-service/tree/main/lambda-for-sts)에서 "deploy.zip"을 다운로드하여, lambda에 소스로 업로드 합니다.

4) 아래의 IAM Role 생성시 필요한, Functional ARN을 메모장 같은곳에 복사해 놓습니다. 


## IAM Role 생성

1) IAM Console에 접속해서 [Create role]을 선택합니다.

https://us-east-1.console.aws.amazon.com/iamv2/home#/roles

2) 아래와 같이 [Use case]로 "S3"을 선택하고, [Next]를 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/169001515-748f5974-1b43-4d1d-b608-93f0329a969b.png)

3) 아래와 같이 "AmazonS3FullAccess"을 선택하고 [Next]를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/169001991-dbfb9ba1-e3d4-4a80-bf6b-4d8dac6bb89c.png)

4) 아래와 같이 [Role name]으로 "role-for-s3-fileserver"로 입력후, 아래로 스크롤하여 [Create role]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/169002505-166eb42d-c368-44fd-ac24-1c8e33bc4c2c.png)

5) role을 수정하기 위하여, 아래와 같이 [IAM] - [Roles]에서 "role-for-s3-fileserver"를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/169002884-920e467c-f130-4baf-9b72-72137601c718.png)

6) 아래와 같이 [Trust relationships]를 선택한 후, [Edit trust policy]를 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/169003506-265317f2-382c-4783-84d8-3ffd01f3a86c.png)

7) Trust relationship에 아래의 policy를 추가합니다. 여기서 추가한 policy는 lambda가 해당 role에 대한 access 권한을 가지게 하기 위함 입니다.

![noname](https://user-images.githubusercontent.com/52392004/169005167-ca9ac35e-f595-4198-85a8-97e5b0821625.png)


```java
{			
	"Effect": "Allow",
	"Principal": {
		"AWS": "arn:aws:sts::123456789012:assumed-role/lambda-stsclient-role-dl4jp7qc/lambda-stsclient"
	},
	"Action": "sts:AssumeRole"
}
```    

[Lambda를 이용한 STS 연결](https://github.com/kyopark2014/aws-security-token-service/blob/main/lambda-for-sts/index.js)과 같이 아래처럼 
    try {
        const data = await sTS.send(assumeRoleCommand);

        console.log('data: %j',data);
        
        // do something
    } catch (error) {
        console.log(error);
    }


## Test 결과 

1) Lambda에시 실행합니다. 

2) 결과를 확인 합니다. 

결과에서 "Credentials"에 있는 AccessKeyId, SecretAccessKey, SessionToken을 얻었으며, expire time도 Expiration로 확인 할 수 있습니다.

```java
{
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "e7aefa4c-d470-4f8b-9d30-09a724affdca",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Credentials": {
        "AccessKeyId": "sampleXN5TBVTEPVG7",
        "SecretAccessKey": "sampleQhWreB/ezbm2u+llpzPK3AbQquQ3gl6",
        "SessionToken": "IQoJb3JpZ2luX2VjEPn//////////wEaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMyLaQ1Z9Ilmv4Gnf84lPw6v62sbntqTagmR68Z6TrbiAiBc24TqZ+tD8qJdhmQdcvLQ5857pPbUiQB2Ru9kVrI0nyqdAgjS//////////8BEAAaDDY3NzE0Njc1MDgyMiIMvZ8jWPiX1tloy0fzKvEBElJTaIf+EnO8d8DFvLrdVHGoakLoHYgmqnJafHmI4FN/8+yFBywz4VrzB44YWC6krAatkPK70Y93BiZPryRnl7zhHDZ7BH1WT7o7oh7ctLaBFzkIAOpTs6uIFW6KcQXGZWgoNQXq5JPS6+uvhEaaJQlsbBosI7t4C1E5Seqay5Ky/F+Cg36KkoggzmdJ/gONjUXD38hFVqqPLI1m1JaxOUtVVwviEDExgO/BPwDA5HIlVpEqixMQsh0QGrhiqHMs5NfBSejIFYAcVDeGN6yqc1xNkFi4XNA2NzNYQpau83N0rJeEwwhD8W5IUDd1/S5J3TCc5ZKUBjqdAWs2zBUXGe2otwTiQzgfKZo36A3D15Z96mz8XZm6+sP0F7wWP5PdRlclEtNZG/LiC0wyoLG1dw5eYAIWw0IV0CxrsdqEEY/0RcuTPpDmRunIG9pMdDotiTu1BBEAXoy4Pl6MrVsqZWLWWz4kdpYnWb8x2DlRi/irLkVcVTmFVzTfzoUm8aybKEym2/rg3lczqYhCpFF2/esqfplR/E8=",
        "Expiration": "2022-05-18T09:47:24.000Z"
    },
    "AssumedRoleUser": {
        "AssumedRoleId": "sampleKIXN5TI7THMKUAD:session",
        "Arn": "arn:aws:sts::123456789012:assumed-role/role-for-s3-fileserver/session"
    }
}
```

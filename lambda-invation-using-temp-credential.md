# Temparary security credential 을 이용하여 Lambda Function URL 접속

Lambda Function URL은 외부에서 Lambda로 직접 접속 할 수 있어 편리하며, IAM 인증과 무인증(None)의 2가지 옵션을 제공하고 있습니다. 여기서는 Lambda Function URL의 인증방식을 AWS IAM으로 설정시에 Temparary Security Credential을 사용하여 접속하는 방법에 대해 설명합니다.


## Lambda 생성 및 Function URL 설정

1) Lambda Console에 접속하여 [Create function]을 선택합니다.

https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions

2) [Function name]에 "lambda-for-functional-url-with-iam"으로 입력후, [Create function]을 선택하여 lambda를 생성합니다.

3) 생성한 Lambda의 [Configuration] - [Functional URL]에서 [Create function URL]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/169073306-3b5fd102-d43c-44ca-a4ae-afcf5ec4a2c1.png)

4) [AWS_IAM]을 선택후 [Save]를 선택합니다.

![noname](https://user-images.githubusercontent.com/52392004/169073585-58fd4214-f3d9-4904-abab-5692e5f25bbc.png)



## STS에 접속하여 Temparary security credential 받아오기 

1) "role-for-lambda-invocation"을 만들기 위해, 먼저 "lambda-full-access"을 생성합니다. 

https://us-east-1.console.aws.amazon.com/iamv2/home#/policies

[Create Policy]를 선택후 아래의 policy를 가지는 "lambda-full-access"을 생성합니다. 

```java
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:*"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

2) IAM console에서 "role-for-lambda-invocation"을 생성합니다. 

https://us-east-1.console.aws.amazon.com/iamv2/home#/roles

[Create role]을 선택후 "role-for-lambda-invocation"을 아래와 같이 생성합니다. 

![noname](https://user-images.githubusercontent.com/52392004/169075611-dd773d84-adf6-4d7a-93c6-964c7adcdec6.png)

[Add permissions]에서 생성한 "lambda-full-access"을 추가하여 생성합니다.

"role-for-lambda-invocation" 생성후에 아래와 같이 [Edit trust policy]로 진입해 아래의 principal을 추가합니다.

![noname](https://user-images.githubusercontent.com/52392004/169077479-4829ddb0-cbf3-494f-96be-383d0ce2c17c.png)


```java
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:user/accountId"
  },
  "Action": "sts:AssumeRole"
}
```        

2) 아래와 같이 AWS CLI를 이용하여 Temparary Security Credential을 생성합니다. 

```c
$ aws sts assume-role --role-arn arn:aws:iam::123456789012:role/role-for-lambda-invocation --role-session-name "RoleSession1"
```

```java
{
    "Credentials": {
        "AccessKeyId": "SAMPLEKIXN5THWN3AB6U",
        "SecretAccessKey": "sampleSlCLxYVmpdRe5hmKPnh64HFE/wTHg5xFLD",
        "SessionToken": "IQoJb3JpZ2luX2VjEP///////////wEaDmFwLW5vcnRoZWFzdC0yIkYwRAIgaBZBv9ljYpTlStcyla4mfCJ0wbUTKEqLgvFFiIKTeuICIG2CghfB9hEGmsxtX84T79Tjk/95m0ZFJoBNvfBYUBSfKqICCNj//////////wEQABoMNjc3MTQ2NzUwODIyIgw0fye8R12xihyEybQq9gFqPj0EoCX7oH9ikmP0HSnij5IiJZ7IBl87q5b60RVxYX0QKlu6PhMhal1L/55IvqvqD/yj4oh5Xx/XqOQ0Bw4GPS79nTI7ARDDCKdMWGmY5ZgEGYH7SY/Uci8IyUB0wC3F1C2n8cA/YbCXfjM8Z6KOXxMKXOmFVPWiBq4ClRCwfbJBLUxLd0JH/9t6SvZrSqtlImgaMAoNcqy7PJa2vUR3hVQT69oaPgIBjOHmKnsp9f2BPWhh/m2V9A7cuuQSaExAl/XZ9qGuAObhgU55/+f+zb2IRbHMq4E3pYTuC+chfEPsAWv8I3AAdK+8YllAQ0eRxzJC8YIwuYaUlAY6ngE8RGpLyBw+E7LavtnCtLsSgnzjrCM0O8Tgm5E74iAH03LmChpXI0X/U103cqoEUt2wI3SRXNP8fv5ERR3cNo69tVMHbhczw3/mKtpj6M4XeFiAGON4HXn6bT4ONhag/lnpVa+QqYYkbe8EE9cmgAw+WlZQi3TL8MgQ0CyY45QvvwfqOXhsp1dSIIZPDXStuD2F260yMBuQF3ExKTz+bw==",
        "Expiration": "2022-05-18T15:31:21+00:00"
    },
    "AssumedRoleUser": {
        "AssumedRoleId": "AROAZ3KIXN5TOSUQQXSOQ:RoleSession1",
        "Arn": "arn:aws:sts::12345678012:assumed-role/role-for-lambda-invocation/RoleSession1"
    }
}
```

## Postman을 이용해 접속하기 

1) Functin URL을 기준으로 [Automation]으로 진입합니다.

2) [Type]으로 "AWS Signature"를 선택합니다.

3) [AccessKey]로 생성된 "AccessKeyId"의 값을 입력합니다.

4) [SecretKey]로 생성된 "SecretAccessKey"의 값을 입력합니다.

5) [AWS Region]은 "ap-northeast-2"을 입력합니다.

6) [Sevice Name]으로 "labmda"를 입력합니다. 

7) [Session Token]으로 생성된 "SessionToken"의 값을 입력합니다. 

아래와 같이 상기의 값을 모두 입력후 [Send]를 하면 Lambda Function URL에 접속하여 "Hello from labmda!"와 같은 응답을 받음을 확인 할 수 있습니다. 

![noname](https://user-images.githubusercontent.com/52392004/169079386-49d52e34-d2f5-43dc-b66c-e8af553a3591.png)

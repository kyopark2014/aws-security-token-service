# AWS CLI를 이용한 temparary security credential 생성하기 

## IAM Role 생성
"role-for-s3-fileserver"과 같은 IAM Role을 미리 생성하여야 하는데, 아래처럼 Trust relationships에 사용자 계정(여기서는 "myid")을 반드시 추가하여야 합니다. 

```java
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "s3.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:user/myid"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

## AWS CLI에서 생성하기 

```c
$ aws sts assume-role --role-arn arn:aws:iam::123456789012:role/role-for-s3-fileserver --role-session-name "RoleSession1"
```

아래와 같이 생성된 Temparary Security Credential을 확인 할 수 있습니다. 

```java
{
    "Credentials": {
        "AccessKeyId": "SAMPLEXN5TBLNOLQP7",
        "SecretAccessKey": "sampledAkSybvomqV4+6YG+fDnLcpOiOPK6W",
        "SessionToken": "IQoJb3JpZ2luX2VjEPX//////////wEaDmFwLW5vcnRoZWFzdC0yIkgwRgIhAKljMXgbE30AOQPXEXkbeGZtC+InL5Rk28eC9jkD38HnAiEAn4WSgA4YiWcHlVHlkaet4Mt//o3gWidijB4ygNnFocoqogIIzv//////////ARAAGgw2NzcxNDY3NTA4MjIiDNf6TNuZMuGIgC74/Sr2AVFC+dmIU0u0E8VuFx+6EpC1bqgVIwcPs6DObA2lMkd7TFrk0Czq/O+WqMEEaW7+r3kvOt6QnLy/nezNxduLQ2Mg6aOd99YCynFTbwzMJH27Prnv6Xc5d4BCjAlAvDhH0FTXr2u6V+ONEVaOqnik376zW++OIpn7ncZyAQbaOYta9ndKymh9Uxtqso4jp25pB8igJhjE91pKpSGjBAz36UDvuVA4UeDyqrzg6TAEi0CSSvpv2s0GJg7s3uwqDc3LsZ5iA3rhQWz2xxBVuOUuSTaxlQXjwcR9txk/A9uCaqTUeL65lL3X58RXBAEC9pPDEjG3ho8sZDCzgpKUBjqcAdsvgLddsDfgwk8fvaIRjJWPsCIoR3mHQgJtjklDcxnPb66EeTVS+IEzseTvA40mQ9o5GmW6L9GKbPEJUOqbQe+ItySWFt9aaiVvc52PmglcjUMubW1rMJunoKxf12x7odLEuV2u6bmsyj3E1tVZCOpX9P1Q8NVwp/h2cqOF8jaS28BuisOKMOwSdz3kmtRMwt+PVfmho1TMwHB2dg==",
        "Expiration": "2022-05-18T06:16:35+00:00"
    },
    "AssumedRoleUser": {
        "AssumedRoleId": "sampleXN5TI7THMKUAD:RoleSession1",
        "Arn": "arn:aws:sts::123456789012:assumed-role/role-for-s3-fileserver/RoleSession1"
    }
}
```


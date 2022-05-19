const aws = require('aws-sdk');

const {STSClient, AssumeRoleCommand}  = require('@aws-sdk/client-sts');
const sTS = new STSClient({region: 'ap-northeast-2'});

exports.handler = async (event, context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## EVENT: ' + JSON.stringify(event))
    
    const params = {
      RoleArn: 'arn:aws:iam::123456789012:role/role-for-s3-fileserver',
      RoleSessionName: 'session',
    };
    const assumeRoleCommand = new AssumeRoleCommand(params);

    try {
        const data = await sTS.send(assumeRoleCommand);

        console.log('data: %j',data);
        
        // do something
    } catch (error) {
        console.log(error);
    }

    const response = {
        statusCode: 200,
    };
    return response;
};

#! /bin/bash

# set up credentials
mkdir ~/.elasticbeanstalk
touch ~/.elasticbeanstalk/aws_credential_file
chmod 600 ~/.elasticbeanstalk/aws_credential_file

echo "[default]"
echo "AWSAccessKeyId=$AWS_ACCESS_KEY_ID" >> ~/.elasticbeanstalk/aws_credential_file
echo "AWSSecretKey=$AWS_SECRET_KEY" >> ~/.elasticbeanstalk/aws_credential_file

export AWS_CREDENTIAL_FILE=~/.elasticbeanstalk/aws_credential_file

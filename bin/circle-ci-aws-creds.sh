#! /bin/bash

# set up credentials
mkdir ~/.elasticbeanstalk
touch ~/.elasticbeanstalk/aws_credential_file
chmod 644 ~/.elasticbeanstalk/aws_credential_file

echo "[default]" >> ~/.elasticbeanstalk/aws_credential_file
echo "AWSAccessKeyId=AKIAICTG7E2XY6YPGFWA" >> ~/.elasticbeanstalk/aws_credential_file
echo "AWSSecretKey=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" >> ~/.elasticbeanstalk/aws_credential_file

export AWS_CREDENTIAL_FILE=~/.elasticbeanstalk/aws_credential_file

#! /bin/bash

# set up credentials

touch /home/ubuntu/.aws-credentials
chmod 600 /home/ubuntu/.aws-credentials
echo "AWSAccessKeyId=$AWS_ACCESS_KEY_ID" > /home/ubuntu/.aws-credentials
echo "AWSSecretKey=$AWS_SECRET_KEY" >> /home/ubuntu/.aws-credentials
echo 'export AWS_CREDENTIAL_FILE=/home/ubuntu/.aws-credentials' >> ~/.circlerc

FROM centos:centos6

# Enable EPEL for Node.js
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN yum install -y npm

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

EXPOSE  8080

ENV DATABASE_HOST emojinary.c5awfmpmbqkj.us-west-2.rds.amazonaws.com
ENV DATABASE_PORT 5432
ENV DATABASE_NAME emojinary_prod

CMD ["node", "/src/index.js"]

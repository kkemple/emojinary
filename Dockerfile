FROM centos:centos6

# Enable EPEL for Node.js
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js and npm
RUN yum install -y npm

# Bundle app source
COPY . /src

# Move to working directory
WORKDIR /src

# Install app dependencies
RUN npm install

# create log files
RUN mkdir logs
RUN touch logs/info.log
RUN touch logs/error.log

#expose port
EXPOSE  8080

CMD ["node", "index.js"]

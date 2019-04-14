FROM node:carbon

# Create app directory
#WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN mkdir /opt/sendy/
COPY . /opt/sendy/
WORKDIR /opt/sendy/

ARG DOCKER_ENV
ENV DOCKER_ENV=$DOCKER_ENV

RUN npm install && npm run build

#RUN npm install -g npm
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]

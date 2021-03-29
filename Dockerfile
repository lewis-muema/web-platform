# FROM sendy-docker-local.jfrog.io/node:carbon AS build-stage
FROM sendy-docker-local.jfrog.io/node-carbon-alpine AS build-stage

RUN apk add git

RUN adduser -D sendy

RUN mkdir /opt/sendy/ 
WORKDIR /opt/sendy/

RUN chown -R sendy:sendy /opt/sendy/ 
RUN chown -R sendy:sendy /home/sendy/


ARG DOCKER_ENV
ENV DOCKER_ENV=$DOCKER_ENV

USER sendy:sendy

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

FROM sendy-docker-local.jfrog.io/node-carbon-alpine 

RUN adduser -D sendy

WORKDIR /usr/user/app

COPY --from=build-stage --chown=sendy:sendy /opt/sendy ./

#this installs dumb-init - a minimalistic init system for docker containers
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

USER sendy:sendy

EXPOSE 8080

CMD [ "dumb-init" ,"npm", "start" ] 


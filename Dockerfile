FROM sendy-docker-local.jfrog.io/node:14.18.1 AS build-stage
WORKDIR /opt/sendy/

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

FROM sendy-docker-local.jfrog.io/node:14.18.1-alpine

RUN adduser -D sendy

WORKDIR /usr/user/app

COPY --from=build-stage --chown=sendy:sendy /opt/sendy ./
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

USER sendy:sendy

EXPOSE 8080

CMD [ "dumb-init" ,"npm", "start" ]
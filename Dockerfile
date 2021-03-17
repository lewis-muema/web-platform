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


# Copy over the package.json
COPY package.json .

# Install the dependancies
RUN npm install --only=production
RUN npm install rimraf

# Copy over the application files
COPY . .

# Build the application
RUN npm run build

FROM sendy-docker-local.jfrog.io/node-carbon-alpine 

RUN adduser -D sendy

WORKDIR /usr/user/app

COPY --from=build-stage /opt/sendy .

USER sendy
EXPOSE 8080
CMD [ "npm", "start" ]


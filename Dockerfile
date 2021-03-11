FROM sendy-docker-local.jfrog.io/node:carbon AS build-stage
RUN useradd -u 3000 sendy

# Create app directory
#WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

RUN mkdir /opt/sendy/ && \
    mkdir /home/sendy
WORKDIR /opt/sendy/

RUN chown -R sendy:sendy /opt/sendy/ 
RUN chown -R sendy:sendy /home/sendy/


ARG DOCKER_ENV
ENV DOCKER_ENV=$DOCKER_ENV

USER sendy:sendy


# Copy over the package.json
COPY package.json .
# Install the dependancies
RUN npm install

# Copy over the application files
COPY . .

# Build the application
RUN npm run build

################################
#Used Carbon-alpine to maintain the same node version as build-stage
FROM node:carbon-alpine as production

# RUN useradd -u 3000 sendy


WORKDIR /usr/src/app

COPY --from=build-stage /opt/sendy/ .

USER node

EXPOSE 8080
CMD [ "npm", "start" ]


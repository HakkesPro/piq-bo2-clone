# 1. docker build -f Dockerfile -t piq/bo2 .
# 2. docker run --name paymentiq-backoffice-2-monorepo --rm -it piq/bo2 sh

# Use alpine node v16
FROM node:alpine as builder
#Create an alias for the container built from the node:alpine base image

#Setting the working directory inside the container to be the same name as our app on our local machine.
WORKDIR /bambora

#Copying our package.json file from our local machine to the working directory inside the docker container.
COPY package.json ./

## validate apk + fetch git, python and run yarn install
RUN apk update
RUN apk add git
RUN apk add --update --no-cache curl py-pip
RUN apk add --no-cache --virtual .gyp \
  make \
  g++ \
  && yarn install \
  && apk del .gyp

#Copying our project files from our local machine to the working directory in our container.
COPY . .

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV BRANCH=main

#  Create a new container from a linux base image that has the aws-cli installed
# FROM mesosphere/aws-cli

# RUN echo ${AWS_ACCESS_KEY_ID}

# #Using the alias defined for the first container, copy the contents of the build folder to this container
# COPY --from=builder /bambora/workspaces/frontend/build .

# #Set the default command of this container to push the files from the working directory of this container to our s3 bucket, publish to the current branch (develop/main etc)
# CMD ["s3", "sync", "./", "s3://backoffice2.paymentiq.io/$BRANCH"]

# FROM nginx:alpine
# WORKDIR /bambora
# COPY --from=0 /bambora/config/nginx/default.conf /etc/nginx/conf.d/
# COPY --from=0 /bambora/dist/app /usr/share/nginx/html/
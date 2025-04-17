# node v20 as base image
FROM node:20

# set working directory
WORKDIR /app

# copy root and client package.json and package-lock.json files
COPY package*.json ./
COPY client/package*.json ./client/

# install dependencies using custom script
RUN npm run install:all

# copy root and client .env files
COPY .env .env
COPY client/.env client/.env

# copy the app to the container
COPY . .

# set the port
ENV PORT=8000

# expose the port
EXPOSE 8000

# run the app
CMD ["npm", "start"]

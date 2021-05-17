FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

EXPOSE 3002

CMD [ "npm", "start" ]
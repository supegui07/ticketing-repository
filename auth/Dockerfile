FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ postgresql-dev

RUN npm install

COPY . .
COPY ./frontend ./frontend


EXPOSE 5000

CMD ["npm", "start"]

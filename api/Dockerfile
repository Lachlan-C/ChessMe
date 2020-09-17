#docker build -t chessmeapi .
#docker run -it -p 5000:5000 chessmeapi

FROM node:12

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
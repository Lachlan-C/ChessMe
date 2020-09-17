#docker build -t chessmeBoard .
#docker run -it -p 80:3000 chessmeBoard

FROM node:12

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]
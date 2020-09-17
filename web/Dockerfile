#docker build -t chessmeWeb .
#docker run -it -p 3000:3000 chessmeWeb

FROM node:12

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
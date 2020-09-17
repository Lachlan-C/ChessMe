#docker build -t chessmeBoard .
#docker run -it -p 80:3000 chessmeBoard

FROM node:12

WORKDIR /board

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]
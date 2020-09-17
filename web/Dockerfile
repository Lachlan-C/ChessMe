#docker build -t chessmeweb .
#docker run -it -p 3000:3000 chessmeweb

FROM node:12

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
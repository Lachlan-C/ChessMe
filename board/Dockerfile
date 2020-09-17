#docker build -t chessmeboard .
#docker run -it -p 80:3001 chessmeboard

FROM node:12

WORKDIR /board

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]
#docker build -t chessmemqtt .
#docker run -it -p 5001:5001 chessmemqtt

FROM node:12

WORKDIR /mqtt

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "npm", "start" ]
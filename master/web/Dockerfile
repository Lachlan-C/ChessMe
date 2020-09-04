#docker build -t chessme .
#docker run -it -p 3000:3000 chessme


FROM node:alpine


WORKDIR /web
#ENV PATH /web/.env

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]
FROM node:14

WORKDIR /webbanhang_be
COPY package.json .
RUN npm install
COPY . .
CMD npm start
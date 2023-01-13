FROM node:lts

WORKDIR /var/www/app
COPY package*.json .

RUN npm i
COPY . .

CMD ["npm", "start"]

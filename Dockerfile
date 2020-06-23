FROM node:12
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "node", "--experimental-modules", "./server/server.js" ]

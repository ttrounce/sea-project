FROM node:12-slim

COPY campus-connect/package*.json ./

RUN npm install

COPY campus-connect ./

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
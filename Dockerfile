FROM node:20-alpine

COPY package*.json .
RUN npm ci

COPY . .

ENTRYPOINT [ "npm", "run", "start" ]

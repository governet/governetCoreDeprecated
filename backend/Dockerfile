FROM node:8.15.0-stretch

WORKDIR /usr/src/governet

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY routes.js .
COPY queries.js .
COPY app.js .

EXPOSE 3000

CMD ["node", "app.js"]


FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN mkdir -p uploads/logs uploads/layout
CMD ["node","server.js"]

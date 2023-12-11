FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install
RUN npm install -g serve
RUN npm run build
EXPOSE 5000
CMD ["serve", "-s", "dist"]
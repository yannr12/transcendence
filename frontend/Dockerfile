FROM node:20

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .

RUN npx tsc

EXPOSE 8003

CMD ["npm", "run", "dev"]
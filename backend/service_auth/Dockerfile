FROM node:20

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json
RUN npm install

RUN mkdir -p /app/data

COPY . .

EXPOSE 8001

# RUN useradd --user-group --create-home --shell /bin/bash appuser && \
#     chown -R appuser:appuser /app

# USER appuser

CMD ["npm", "run" , "dev"]
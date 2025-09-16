FROM node:20

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Espace ou on auras notre application / API
WORKDIR /app

# config
COPY package*.json ./

# RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm rebuild better-sqlite3

RUN mkdir -p /app/data

COPY . .

# Add a non-root user and set permissions
# RUN useradd --user-group --create-home --shell /bin/bash appuser && \
#     chown -R appuser:appuser /app

# USER appuser

EXPOSE 8004

CMD ["npm", "run", "dev"]
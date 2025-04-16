FROM node:23-slim

RUN apt-get update && apt-get install -y \
    python3 python3-pip ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir yt-dlp --break-system-packages

WORKDIR /slyhear

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN rm -rf src/database/* && touch src/database/db.sqlite
RUN mkdir -p src/upload/images src/upload/sounds

EXPOSE 3324

CMD ["node", "server.js"]
FROM node:22-slim
WORKDIR /app
COPY ./package*.json ./
RUN npm install --omit=dev
COPY ./ ./
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
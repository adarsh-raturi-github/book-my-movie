FROM node:alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm start"]
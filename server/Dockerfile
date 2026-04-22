FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Generate Prisma client at build time
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 4000
CMD ["npm", "run", "dev"]
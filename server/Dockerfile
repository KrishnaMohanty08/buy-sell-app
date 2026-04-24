FROM node:20-alpine

WORKDIR /app

# ✅ Fix: install required system deps for Prisma
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
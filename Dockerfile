# Stage 1: Install Dependencies
FROM node:lts AS dependencies

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Stage 2: Build
FROM node:lts AS builder

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules

COPY . .

# Stage 3: Final image
FROM node:alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 4000

CMD ["npm", "run", "dev"]

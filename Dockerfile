FROM node:14-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production \
&& npm cache clean --force

COPY . .

EXPOSE 5000

CMD ["npm","run","server"]
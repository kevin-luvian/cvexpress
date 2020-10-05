FROM node:12
WORKDIR /app
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . ./
EXPOSE 7000
CMD ["npm","start"]

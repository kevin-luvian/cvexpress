FROM node:12 as build
WORKDIR /app
ENV PATH ./node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:latest
COPY --from=build /app/build /var/www/html
COPY ./nginx/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

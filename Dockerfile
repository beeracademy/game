FROM node:12-alpine as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . /app

RUN yarn build --prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM node:12-alpine as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

RUN ./node_modules/.bin/ngcc --properties es2015  browser module main --create-ivy-entry-points

COPY . /app

RUN yarn build --prod

FROM nginx:alpine

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

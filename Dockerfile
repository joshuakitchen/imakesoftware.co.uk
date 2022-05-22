FROM node:18-alpine AS build

WORKDIR /usr/src/app/

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /src/usr/app/

COPY package*.json .

RUN npm ci

COPY --from=build /usr/src/app/out .

COPY --from=build /usr/src/app/static ./static
COPY --from=build /usr/src/app/templates ./templates

CMD ["npm", "start"]

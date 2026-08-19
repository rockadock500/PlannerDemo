FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Force Docker cache invalidation - change CACHEBUST value to rebuild
ARG CACHEBUST=1
RUN echo "Build timestamp: $CACHEBUST"

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build

CMD ["sh", "-c", "serve -s build -l $PORT"]

FROM node:10

# install application
ARG application="paystack-project"
ENV APPLICATION=$application

ARG track="development"
ENV TRACK=$track

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run lint
# RUN npm run test-coverage
# RUN npm run check-coverage
RUN npm run build-ts

FROM node:10

LABEL maintainer="Vishal, https://github.com/vishalok12"

# install application
ARG application="paystack-project"
ENV APPLICATION=$application

ARG port="80"
ENV PORT=$port
EXPOSE $PORT

ARG track="development"
ENV TRACK=$track

VOLUME /logs

ARG target="build"

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci --only=production
COPY --from=0 /app/dist dist
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

FROM --platform=linux/arm64 node:20-buster
WORKDIR /app/

RUN mkdir node_modules
RUN mkdir apps
RUN mkdir apps/backend-api
RUN mkdir apps/sentry
RUN mkdir -p apps/cdk-apps/src/shared
RUN mkdir environments
RUN mkdir libs

COPY package.json ./
COPY nx.json ./
COPY angular.json ./
COPY tsconfig.base.json ./
COPY apps/cdk-apps/src/shared ./apps/cdk-apps/src/shared
COPY apps/backend-api ./apps/backend-api
COPY apps/sentry ./apps/sentry
COPY environments environments
COPY node_modules ./node_modules
COPY libs ./libs

EXPOSE 3333

CMD npm run start

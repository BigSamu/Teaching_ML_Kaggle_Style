FROM node:15
ARG API_URL
ENV REACT_APP_API_SERVER=${API_URL}

WORKDIR /app
COPY . .

RUN npm install && npm run build
CMD ["npx", "serve", "-l", "5000", "-s", "./build"]

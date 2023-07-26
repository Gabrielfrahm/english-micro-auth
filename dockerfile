# Etapa 1: Construção do aplicativo
FROM node:18-alpine as builder

ENV DOCKERIZE_VERSION v0.6.1

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

# Copia apenas os arquivos necessários para a imagem final
COPY . .

# Etapa 2: Imagem final leve
FROM node:18-alpine

WORKDIR /app

# Copia a pasta do aplicativo construído da etapa anterior
COPY --from=builder /app .

CMD ["tail",  "-f" , "/dev/null"]

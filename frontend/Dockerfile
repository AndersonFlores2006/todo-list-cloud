# Dockerfile para Frontend React
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia el archivo .env antes de la construcción para que las variables estén disponibles
# Este paso asume que el .env ya ha sido creado por GitHub Actions en el directorio 'frontend/'
COPY .env ./

COPY . .
RUN npm run build

# Servir la app con 'serve'
FROM node:18-alpine as production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"] 
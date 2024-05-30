# Utiliser une image de base officielle Node.js
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le package.json et le package-lock.json (le cas échéant)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel votre application s'exécute
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server.js"]

# Guess the game!

## Installation

### Téléchargement du projet

- `git clone git@github.com:paulintrognon/guess-the-game.com.git`

### Installation

- `yarn`

### Configuration

- Créez vous une base de données, et utilisez les fichiers .sql dans le dossier server/db/migrations/ pour créer votre base (lancez les dans l'ordre des dates)
- Copiez `index.js.dist` et `server.json.dist` en `index.js` et `server.json`, et remplissez les données (un compte cloudinary et un compte mailgun sont nécéssaires)

### Lancer le dev

- `yarn api` pour lancer l'API
- `yarn front` pour lancer le front

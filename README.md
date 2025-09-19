# Discord Bot Tickets + TikTok + Twitch

Bot Discord complet pour :  
- Déplacer automatiquement les tickets selon le **premier message** et des mots-clés  
- Envoyer des notifications lorsqu’un compte **TikTok** ou **Twitch** est en live  

---

## 📦 Fonctionnalités

- **Tickets** :  
  - Déplacement automatique selon le mot-clé du premier message  
  - Ne touche que les tickets dans la catégorie `Tickets`  
  - Notifications privées à l’utilisateur pour confirmer le déplacement  

- **TikTok** :  
  - Vérification toutes les 60 secondes si un compte est en live  
  - Notification automatique dans le salon Discord choisi  

- **Twitch** :  
  - Vérification toutes les 60 secondes si un compte est en live  
  - Notification automatique dans le salon Discord choisi  

---

## ⚙️ Prérequis

- Node.js ≥ 18  
- Git (optionnel)  
- Bot Discord avec son token  
- Catégories sur ton serveur Discord pour tickets et mots-clés  
- Pour Twitch : **Client ID** et **Client Secret** via [Twitch Developer](https://dev.twitch.tv/console/apps)  
- Pour TikTok : le **nom d’utilisateur** à surveiller  

---

## 🛠️ Installation du projet

1. **Cloner le projet**
`git clone https://github.com/ton-compte/discord-bot.git
cd discord-bot`


2. **Initialiser Node.js et installer les dépendances**
`npm init -y
npm install discord.js axios cheerio dotenv`

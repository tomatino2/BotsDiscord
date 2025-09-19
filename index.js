import { Client, GatewayIntentBits, Partials } from 'discord.js';
import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

const channelId = process.env.CHANNEL_ID;

// --- Tickets ---
const motsCategories = {
  "wipe": "Wipe",
  "reset": "Wipe",
  "bug": "Bugs",
  "problème": "Bugs",
  "jeux": "Bugs",
  "remboursement": "Remboursements",
  "argent": "Remboursements",
  "achat": "Boutique",
  "boutique": "Boutique"
};
const ticketCategory = process.env.TICKET_CATEGORY;

// --- TikTok ---
const tiktokUser = process.env.TIKTOK_USERNAME;
let wasLiveTikTok = false;

// --- Twitch ---
const twitchUser = process.env.TWITCH_USERNAME;
let wasLiveTwitch = false;
let twitchToken = '';

async function getTwitchToken() {
  try {
    const res = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });
    twitchToken = res.data.access_token;
  } catch (err) {
    console.error('Erreur OAuth Twitch:', err.message);
  }
}

// --- Vérification Twitch ---
async function checkTwitchLive() {
  try {
    if (!twitchToken) await getTwitchToken();
    const res = await axios.get(`https://api.twitch.tv/helix/streams`, {
      params: { user_login: twitchUser },
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${twitchToken}`
      }
    });

    const channel = await client.channels.fetch(channelId);
    const isLive = res.data.data.length > 0;

    if (isLive && !wasLiveTwitch) {
      wasLiveTwitch = true;
      channel.send(`📣 ${twitchUser} est maintenant en **live Twitch** ! https://www.twitch.tv/${twitchUser}`);
    } else if (!isLive && wasLiveTwitch) {
      wasLiveTwitch = false;
    }
  } catch (err) {
    console.error('Erreur Twitch:', err.message);
  }
}

// --- Vérification TikTok ---
async function checkTikTokLive() {
  try {
    const url = `https://www.tiktok.com/@${tiktokUser}`;
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = load(data);
    const isLive = $('div[data-e2e="live-badge"]').length > 0;

    const channel = await client.channels.fetch(channelId);

    if (isLive && !wasLiveTikTok) {
      wasLiveTikTok = true;
      channel.send(`📣 ${tiktokUser} est maintenant en **live TikTok** ! https://www.tiktok.com/@${tiktokUser}`);
    } else if (!isLive && wasLiveTikTok) {
      wasLiveTikTok = false;
    }

  } catch (err) {
    console.error('Erreur TikTok:', err.message);
  }
}

// --- Gestion tickets ---
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const salon = message.channel;

  // Vérifie que le salon est dans la catégorie ticket
  if (!salon.parent || salon.parent.name.toLowerCase() !== ticketCategory.toLowerCase()) return;

  // Vérifie que c’est le premier message
  const messages = await salon.messages.fetch({ limit: 2 });
  if (messages.size > 1) return;

  const contenu = message.content.toLowerCase();
  let categorieTrouvee = null;

  for (const mot in motsCategories) {
    if (contenu.includes(mot.toLowerCase())) {
      categorieTrouvee = motsCategories[mot];
      break;
    }
  }

  if (!categorieTrouvee) return;

  const category = message.guild.channels.cache.find(
    c => c.type === 4 && c.name.toLowerCase() === categorieTrouvee.toLowerCase()
  );

  if (!category) return;

  try {
    await salon.setParent(category.id, { lockPermissions: false });
    await message.author.send(`📦 Ton ticket a été automatiquement déplacé dans la catégorie **${category.name}**.`);
  } catch (err) {
    console.error(err);
  }
});

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  setInterval(checkTikTokLive, 60000);
  setInterval(checkTwitchLive, 60000);
});

client.login(process.env.DISCORD_TOKEN);

let DiscordBotTOKEN = "TOKEN"
let OpenAIAPIKey = "OPENAPIKEY"

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: OpenAIAPIKey,
});
const openai = new OpenAIApi(configuration);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
    if(msg.author.bot) return

    if(!msg.mentions.has(client.user)) return

    msg.content = msg.content.replace(/<@\d+>/g, "")

    let response = await msg.reply("Generating response...")

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: msg.content,
        max_tokens: 200,
        user: msg.author.id.toString(),
    });

    response.edit(completion.data.choices[0].text)
})

client.login(DiscordBotTOKEN)

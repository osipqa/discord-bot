const { Client, Collection } = require("discord.js");
const { ConsoleColors } = require("./utils/consoleColors");
const { token } = require("./utils/config");


/* Это та же штука про команды
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const commands = [
  {
    name: "online",
    description: "Показывает список пользователей, находящихся в онлайне.",
  },
  {
    name: "clear",
    description: "Удалить сообщение пользователей",
  },
  {
    name: "status",
    description: "Показывает ваш онлайн-статус на сервере.",
  }
];
*/

const client = new Client({
  intents: [
    1 << 0, // GUILDS
    1 << 1, // GUILD_MEMBERS
    1 << 2, // GUILD_MODERATION
    1 << 3, // GUILD_EMOJIS_AND_STICKERS
    1 << 4, // GUILD_INTEGRATIONS
    1 << 5, // GUILD_WEBHOOKS
    1 << 6, // GUILD_INVITES
    1 << 7, // GUILD_VOICE_STATES
    1 << 8, // GUILD_PRESENCES
    1 << 9, // GUILD_MESSAGES
    1 << 10, // GUILD_MESSAGE_REACTIONS
    1 << 11, // GUILD_MESSAGE_TYPING
    1 << 12, // DIRECT_MESSAGES
    1 << 13, // DIRECT_MESSAGE_REACTIONS
    1 << 14, // DIRECT_MESSAGE_TYPING
    1 << 15, // MESSAGE_CONTENT
    1 << 16, // GUILD_SCHEDULED_EVENTS
    1 << 20, // AUTO_MODERATION_CONFIGURATION
    1 << 21, // AUTO_MODERATION_EXECUTION
  ],
});

client.commands = new Collection();

client.commands.set("online", require("./commands/online"));
client.commands.set("clear", require("./commands/clear"));
client.commands.set("status", require("./commands/status"));

client.once("ready", async () => {
    console.log(
      ConsoleColors.Success + "Бот успешно активирован." + ConsoleColors.Reset,
    );
    console.log(`${client.user.tag} | ${client.user.id}`);
    console.log("");
    console.log("Ссылка для приглашения бота на сервер:");
    console.log(
      `> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`, // ВКЛЮЧЕНЫ АДМИН ПРАВА, ПРЕДУПРЕЖДАЮ!
    );
    console.log("");

 /* Лень переделывать, пока что будет так. Добавили команду - раскоментили, деплойнули, закоменитили

    const rest = new REST({ version: "9" }).setToken(token);

    try {
      console.log("Начата обновление глобальных команд приложения (/).");

      // Создаем глобальные команды
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });

      console.log("Успешно обновлены глобальные команды приложения (/).");
    } catch (error) {
      console.error(error);
    }
  */

});

client.login(token).catch(error => {
  console.error('Ошибка входа бота:', error);
});
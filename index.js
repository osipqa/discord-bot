const { Client, Collection } = require("discord.js");
const { ConsoleColors } = require("./utils/consoleColors");
const { token } = require("./utils/config");


const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const commands = [
  {
    name: "online",
    description: "Показывает список пользователей, находящихся в онлайне.",
  },
  {
    name: "clear",
    description: "Удалить сообщение пользователей (50 штук)",
  },
  {
    name: "status",
    description: "Показывает ваш онлайн-статус на сервере.",
  }
];


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

const rest = new REST({ version: "9" }).setToken(token);

async function deleteGlobalCommands(client, rest) {
  try {
    console.log("Начато удаление глобальных команд приложения (/).");

    // Получаем текущие глобальные команды
    const existingCommands = await rest.get(
      Routes.applicationCommands(client.user.id)
    );

    // Удаляем существующие глобальные команды
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: [] }
    );

    console.log("Завершено удаление глобальных команд приложения (/).");

  } catch (error) {
    console.error("Ошибка при удалении глобальных команд:", error);
  }
}

async function addGlobalCommands(client, rest, commands) {
  try {
    console.log("Начато добавление глобальных команд приложения (/).");

    // Создаем глобальные команды
    const addedCommands = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log("Завершено добавление глобальных команд приложения (/).", addedCommands);

  } catch (error) {
    console.error("Ошибка при добавлении глобальных команд:", error);
  }
}

async function updateGlobalCommands(client, rest, commands) {
  try {
    console.log("Начато обновление глобальных команд приложения (/).");

    // Обновляем глобальные команды
    const updatedCommands = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log("Завершено обновление глобальных команд приложения (/).", updatedCommands);

  } catch (error) {
    console.error("Ошибка при обновлении глобальных команд:", error);
  }
}


//  await deleteGlobalCommands(client, rest);                   - УДАЛИТЬ
//  await addGlobalCommands(client, rest, commands);            - ДОБАВИТЬ
//  await updateGlobalCommands(client, rest, commands);         - ОБНОВИТЬ (ЗАЧЕМ?)

client.once("ready", async () => {
  updateGlobalCommands(client, rest, commands)
    console.log(
      ConsoleColors.Success + "Бот успешно активирован." + ConsoleColors.Reset,
    );
    console.log(`${client.user.tag} | ${client.user.id}`);
    console.log("");
    const command = await rest.get(Routes.applicationCommands(client.user.id));

    console.log("Список глобальных команд приложения (/):", command);

    console.log("Ссылка для приглашения бота на сервер:");
    console.log(
      `> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`, // ВКЛЮЧЕНЫ АДМИН ПРАВА, ПРЕДУПРЕЖДАЮ!
    );
    console.log("");

});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!client.commands.has(commandName)) return;

  try {
    const command = client.commands.get(commandName);
    if (command) {
      await command.execute(interaction);
    } else {
      console.error(`Команда не найдена: ${commandName}`);
      await interaction.reply({ content: `Произошла ошибка при выполнении команды. ${commandName}`, ephemeral: true });
    }
  } catch (error) {
    console.error(error);
  
    // Выводим дополнительные детали об ошибке в консоль
    if (error instanceof Error && error.message) {
      console.error('Error message:', error.message);
    }
  
    // Отправляем ответ с информацией об ошибке в чат
    await interaction.reply({ content: `Произошла ошибка при выполнении команды. ${error.message}`, ephemeral: true });
  }
});


client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'clears') {
      // Проверяем, есть ли у пользователя разрешение на управление сообщениями
      if (message.member.hasPermission('MANAGE_MESSAGES')) {
          const amount = parseInt(args[0]);

          if (isNaN(amount)) {
              return message.reply('Укажите число сообщений для удаления.');
          } else if (amount <= 0 || amount > 100) {
              return message.reply('Укажите число от 1 до 100.');
          }

          // Удаляем сообщения
          await message.channel.bulkDelete(amount + 1);
          message.channel.send(`Удалено ${amount} сообщений.`).then(msg => msg.delete({ timeout: 5000 }));
      } else {
          message.reply('У вас нет прав на использование этой команды.');
      }
  }
});

client.login(token).catch(error => {
  console.error('Ошибка входа бота:', error);
});
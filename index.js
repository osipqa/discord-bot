const { Client, Collection } = require('discord.js');
const { ConsoleColors } = require('./utils/consoleColors');
const { token, role_id, server_id, mainChannel_id } = require('./utils/config');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
  {
    name: 'online',
    description: 'Показывает список пользователей, находящихся в онлайне + общее время.',
    options: [
      {
        name: 'user',
        type: 6,
        description: 'Указанный пользователь (оставьте пустым для списка всех)',
        required: false,
      },
    ],
  },
  {
    name: 'clear',
    description: 'Удалить сообщение пользователей (100)',
    options: [
      {
        name: 'amount',
        type: 4,
        description: 'Количество сообщений для удаления (100)',
        required: false,
      },
    ],
  },
  {
    name: 'updateroles',
    description: 'Обновить роли для всех участников.',
    options: [
      {
        name: 'rolename',
        type: 3,
        description: 'Имя роли для обновления',
        required: true,
      },
    ],
  },
  {
    name: 'status',
    description: 'Показывает ваш онлайн-статус на сервере.',
  },
];

const client = new Client({
  intents: [
    1 << 0, 1 << 1, 1 << 2, 1 << 3, 1 << 4, 1 << 5, 1 << 6, 1 << 7, 1 << 8, 1 << 9,
    1 << 10, 1 << 11, 1 << 12, 1 << 13, 1 << 14, 1 << 15, 1 << 16, 1 << 20, 1 << 21,
  ],
});

client.commands = new Collection();

const rest = new REST({ version: '9' }).setToken(token);

async function deleteGlobalCommands(client, rest) {
  try {
    console.log('Начато удаление глобальных команд приложения (/).');
    await rest.put(Routes.applicationCommands(client.user.id), { body: [] });
    console.log('Завершено удаление глобальных команд приложения (/).');
  } catch (error) {
    console.error('Ошибка при удалении глобальных команд:', error);
  }
}

async function addGlobalCommands(client, rest, commands) {
  try {
    console.log('Начато добавление глобальных команд приложения (/).');
    const addedCommands = await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Завершено добавление глобальных команд приложения (/).', addedCommands);
  } catch (error) {
    console.error('Ошибка при добавлении глобальных команд:', error);
  }
}

async function updateGlobalCommands(client, rest, commands) {
  try {
    console.log('');
    console.log('Начато обновление глобальных команд приложения (/).');
    const updatedCommands = await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Завершено обновление глобальных команд приложения (/).');
    console.log('');
  } catch (error) {
    console.error('Ошибка при обновлении глобальных команд:', error);
  }
}

const updaterolesCommand = require('./commands/updateroles');
const onlineCommand = require('./commands/online');
client.commands.set('updateroles', updaterolesCommand);
client.commands.set('online', onlineCommand);

client.once('ready', async () => {
  await updateGlobalCommands(client, rest, commands);
  console.log(ConsoleColors.Success + 'Бот успешно активирован.' + ConsoleColors.Reset);
  console.log(`${ConsoleColors.Warning}${client.user.tag} ${ConsoleColors.Reset}|${ConsoleColors.Warning} ${client.user.id} ${ConsoleColors.Reset}`);
  console.log('');
  console.log('Ссылка для приглашения бота на сервер:');
  console.log('');
  console.log(`>${ConsoleColors.Error} https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`,);
  console.log('' + ConsoleColors.Reset);
});

client.on('guildMemberAdd', (member) => {
  const guild = member.guild;
  const role = guild.roles.cache.get(role_id);

  if (role) {
    member.roles.add(role).catch(console.error);
    const channel = guild.systemChannel;
    if (channel) {
      channel.send(`Добро пожаловать, ${member.user.tag}! Роль "${role.name}" была присвоена.`);
    }
  } else {
    console.error(`Роль с ID ${roleId} не найдена.`);
  }
});

client.on('ready', () => {
  console.log(`Бот вошел как ${client.user.tag}`);

  const guild = client.guilds.cache.get(server_id);
  const role = guild?.roles.cache.get(role_id);
  const channel = guild?.channels.cache.get(mainChannel_id);

  if (role) {
    guild.members.cache.forEach((member) => {
      // Проверяем, есть ли у пользователя уже данная роль
      if (!member.roles.cache.has(role_id)) {
        // Добавляем роль пользователю
        member.roles.add(role).catch(console.error);
        
        // Проверяем, есть ли целевой канал
        if (channel) {
          // Отправляем сообщение в целевой канал
          channel.send(`Внимание, ${member.user.tag}! Роли были обновлены. Теперь у вас есть роль ${role.name}.`);
        } else {
          console.error(`Целевой канал не найден на ${guild.name}.`);
        }
      }
    });
    console.log(`Роли обновлены для всех участников в ${guild.name}.`);
  } else {
    console.error(`Роль с ID ${role_id} не найдена.`);
  }
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'updateroles') {
    const updaterolesCommand = client.commands.get('updateroles');
    if (updaterolesCommand) {
      await updaterolesCommand.execute(interaction);
    } else {
      console.error('Команда не найдена: updateroles');
    }
  } else if (commandName === 'clear') {
    const { clear } = require('./commands/clear');
    await clear(interaction, options?.getInteger('amount'));
  } else if (commandName === 'status') {
    const statusCommand = require('./commands/status');
    await statusCommand.execute(interaction);
  } else if (commandName === 'online') {
    try {
      const { online } = require('./commands/online');
      await online(interaction, options);
    } catch (error) {
      console.error(`Ошибка выполнения команды online: ${error.message}`);
      await interaction.reply('Произошла ошибка при выполнении команды online.');
    }
  }
});

client.login(token).catch(error => {
  console.error('Ошибка входа бота:', error);
});

const Discord = require('discord.js');

async function clear(context) {
  try {
    const amount = 50; // Количество сообщений для удаления по умолчанию

    const textChannel = context.channel;

    const messages = await textChannel.messages.fetch({ limit: amount });
    await textChannel.bulkDelete(messages, true);
    await context.reply(`Удалено ${messages.size} сообщений.`);
  } catch (error) {
    console.error(`Ошибка удаления сообщений: ${error.message}`);
    await context.reply('У нас какая-то ошибка... :c');
  }
}

module.exports = {
  data: {
    name: 'clear',
    description: 'Очистить указанное количество сообщений.',
    options: [
      {
        name: 'amount',
        type: 'INTEGER',
        description: 'Количество сообщений для удаления (50)',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return await interaction.reply('У вас недостаточно прав для выполнения этой команды.');
    }

    try {
      await clear(interaction);
    } catch (error) {
      console.error(`Произошла ошибка при удалении сообщений: ${error.message}`);
      await interaction.reply('Произошла ошибка при удалении сообщений.');
    }
  },
};

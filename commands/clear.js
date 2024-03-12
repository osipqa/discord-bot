async function clear(interaction, amount = 100) {
  try {
    const textChannel = interaction.channel;
    if (!interaction.member.roles.cache.some(role => role.name === 'Администратор')) {
      await interaction.reply('У вас нет прав для выполнения этой команды.');
      return;
    }

    const messages = await textChannel.messages.fetch({ limit: amount });
    await textChannel.bulkDelete(messages, true);
    await interaction.reply(`Удалено ${messages.size} сообщений.`);
  } catch (error) {
    console.error(`Ошибка удаления сообщений: ${error.message}`);
    await interaction.reply('У нас какая-то ошибка... :c');
  }
}

module.exports = { clear };
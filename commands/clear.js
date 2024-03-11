async function clear(interaction, amount = 100) {
  try {
    const textChannel = interaction.channel;
    const messages = await textChannel.messages.fetch({ limit: amount });
    await textChannel.bulkDelete(messages, true);
    await interaction.reply(`Удалено ${messages.size} сообщений.`);
  } catch (error) {
    console.error(`Ошибка удаления сообщений: ${error.message}`);
    await interaction.reply('У нас какая-то ошибка... :c');
  }
}

module.exports = {
  clear,
};

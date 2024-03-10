module.exports = {
  description: "Очистить указанное количество сообщений.",
  options: [
    {
      name: "amount",
      type: "INTEGER",
      description: "Количество сообщений для удаления (от 1 до 100)",
      required: false,
    },
  ],
  execute: async (interaction, args) => {
    // Проверяем, есть ли права "MANAGE_MESSAGES" у пользователя
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return await interaction.reply(
        "У вас недостаточно прав для выполнения этой команды.",
      );
    }

    const amount = args[0] || 100;

    // Проверяем, чтобы количество было в пределах от 1 до 100
    if (amount < 1 || amount > 100) {
      return await interaction.reply(
        "Укажите число от 1 до 100 для удаления сообщений.",
      );
    }

    // Удаляем сообщения
    try {
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply(`Удалено ${amount} сообщений.`);
    } catch (error) {
      console.error(
        `Произошла ошибка при удалении сообщений: ${error.message}`,
      );
      await interaction.reply("Произошла ошибка при удалении сообщений.");
    }
  },
};

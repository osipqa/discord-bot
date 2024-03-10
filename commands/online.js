module.exports = {
  description: "Показывает список пользователей, находящихся в онлайне.",
  execute: async (interaction) => {
    console.log(
      `Команда 'online' была использована пользователем ${interaction.user.tag}.`,
    );

    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply(
        "Эта команда может быть использована только на сервере.",
      );
      return;
    }

    try {
      await guild.members.fetch();

      const onlineMembers = guild.members.cache.filter(
        (member) => member.presence?.status === "online",
      );

      if (onlineMembers.size > 0) {
        const onlineUsers = onlineMembers
          .map((member) => {
            return `Онлайн сейчас [test]: ${member.user.tag}`;
          })
          .join("\n");

        await interaction.reply(onlineUsers);
      } else {
        await interaction.reply("На сервере нет онлайн пользователей.");
      }
    } catch (error) {
      console.error(
        `Произошла ошибка при выполнении команды 'online': ${error.message}`,
      );
      await interaction.reply(
        "Произошла ошибка при выполнении команды 'online'.",
      );
    }
  },
};

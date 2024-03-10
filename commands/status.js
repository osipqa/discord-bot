module.exports = {
  description: "Показывает ваш онлайн-статус на сервере.",
  execute: async (interaction) => {
    console.log(`Команда 'online' была использована пользователем ${interaction.user.tag}.`);

    const member = interaction.guild.members.cache.get(interaction.user.id);

    if (member) {
      const status = member.presence?.status || "offline";
      await interaction.reply(`Ваш текущий онлайн-статус: ${status}`);
    } else {
      await interaction.reply("Вы не являетесь участником сервера.");
    }
  },
};
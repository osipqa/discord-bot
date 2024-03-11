module.exports = {
  description: 'Обновить роли для всех участников.',
  execute: async (interaction) => {
    console.log(`Команда 'updateroles' была использована пользователем ${interaction.user.tag}.`);
    const roleToUpdateName = interaction.options.getString('rolename');
    try {
      await guild.members.fetch();
      const roleToUpdate = guild.roles.cache.find(role => role.name === roleToUpdateName);
      if (roleToUpdate) {
        guild.members.cache.forEach((member) => {
          member.roles.add(roleToUpdate).catch(console.error);
        });
        await interaction.reply(`Роли "${roleToUpdate.name}" были обновлены для всех участников.`);
      } else {
        await interaction.reply(`Роль с именем "${roleToUpdateName}" не найдена.`);
      }
    } catch (error) {
      console.error(
        `Произошла ошибка при выполнении команды: ${error.message}`,
      );
      await interaction.reply('Произошла ошибка при выполнении команды.');
    }
  },
};

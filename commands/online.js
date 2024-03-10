module.exports = {
  description: 'Показывает список пользователей, находящихся в онлайне.',
  execute: async (interaction) => {
    console.log(
      `Команда 'online' была использована пользователем ${interaction.user.tag}.`,
    );

    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply(
        'Эта команда может быть использована только на сервере.',
      );
      return;
    }

    const mentionedUserId = interaction.options.getString('user');

    try {
      await guild.members.fetch();

      if (mentionedUserId) {
        const mentionedMember = guild.members.cache.get(mentionedUserId);
        if (mentionedMember && mentionedMember.presence?.status === 'online') {
          const formattedTime = formatOnlineTime(mentionedMember);
          await interaction.deferReply({ ephemeral: true });
          await interaction.followUp({ content: `Онлайн сейчас: ${mentionedMember.user.tag} (${formattedTime})` });
        } else {
          await interaction.deferReply({ ephemeral: true });
          await interaction.followUp({ content: 'Указанный пользователь не онлайн или не найден.' });
        }
      } else {
        const onlineMembers = guild.members.cache.filter(
          (member) => member.presence?.status === 'online',
        );

        if (onlineMembers.size > 0) {
          const onlineUsers = onlineMembers
            .map((member) => {
              const formattedTime = formatOnlineTime(member);
              return `Онлайн сейчас: ${member.user.tag} (${formattedTime})`;
            })
            .join('\n');

          await interaction.deferReply({ ephemeral: true });
          await interaction.followUp({ content: onlineUsers });
        } else {
          await interaction.deferReply({ ephemeral: true });
          await interaction.followUp({ content: 'На сервере нет онлайн пользователей.' });
        }
      }
    } catch (error) {
      console.error(
        `Произошла ошибка при выполнении команды: ${error.message}`,
      );
      await interaction.deferReply({ ephemeral: true });
      await interaction.followUp({ content: 'Произошла ошибка при выполнении команды.' });
    }
  },
};

function formatOnlineTime(member) {
  const joinedTimestamp = member.joinedTimestamp / 1000;
  const currentTime = Math.floor(Date.now() / 1000);
  const onlineTimeSeconds = currentTime - joinedTimestamp;

  const days = Math.floor(onlineTimeSeconds / (24 * 60 * 60));
  const hours = Math.floor((onlineTimeSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((onlineTimeSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(onlineTimeSeconds % 60);

  let formattedTime = '';
  formattedTime += days > 0 ? `${days}d ` : '';
  formattedTime += hours > 0 || formattedTime !== '' ? `${hours}h ` : '';
  formattedTime += minutes > 0 || formattedTime !== '' ? `${minutes}m ` : '';
  formattedTime += `${seconds}s`;

  return formattedTime;
}

async function online(interaction, options) {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply('Эта команда может быть использована только на сервере.');
    return;
  }

  const mentionedUser = options.getUser('user');

  function formatOnlineTime(member) {
    // Implement the logic for formatting online time
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

  try {
    await guild.members.fetch();

    if (mentionedUser) {
      const mentionedMember = guild.members.cache.get(mentionedUser.id);
      if (mentionedMember && mentionedMember.presence?.status === 'online') {
        const formattedTime = formatOnlineTime(mentionedMember);
        await interaction.reply({ content: `Онлайн сейчас: ${mentionedMember.user.tag} (${formattedTime})` });
      } else {
        await interaction.reply('Указанный пользователь не онлайн или не найден.');
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

        await interaction.reply(onlineUsers);
      } else {
        await interaction.reply('На сервере нет онлайн пользователей.');
      }
    }
  } catch (error) {
    console.error(`Произошла ошибка при выполнении команды: ${error.message}`);
    await interaction.reply('Произошла ошибка при выполнении команды.');
  }
}

module.exports = { online };
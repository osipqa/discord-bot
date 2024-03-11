module.exports = {
  description: 'Показывает ваш статус на сервере.',
  execute: async (interaction) => {
    console.log(`Команда 'status' была использована пользователем ${interaction.user.tag}.`);
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (member) {
      const formattedTime = calculateOnlineTime(member);
      await interaction.reply(`Вы на сервере уже ${formattedTime}.`);
    }
  },
};

function calculateOnlineTime(member) {
  const joinedTimestamp = member.joinedTimestamp / 1000;
  const currentTime = Math.floor(Date.now() / 1000);
  const onlineTimeSeconds = currentTime - joinedTimestamp;

  const years = Math.floor(onlineTimeSeconds / (365 * 24 * 60 * 60));
  const months = Math.floor((onlineTimeSeconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
  const days = Math.floor((onlineTimeSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
  const hours = Math.floor((onlineTimeSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((onlineTimeSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(onlineTimeSeconds % 60);

  let formattedTime = '';
  if (years > 0) {
    formattedTime += `${years}y `;
  }
  if (months > 0 || formattedTime !== '') {
    formattedTime += `${months}mo `;
  }
  if (days > 0 || formattedTime !== '') {
    formattedTime += `${days}d `;
  }
  if (hours > 0 || formattedTime !== '') {
    formattedTime += `${hours}h `;
  }
  if (minutes > 0 || formattedTime !== '') {
    formattedTime += `${minutes}m `;
  }
  formattedTime += `${seconds}s`;

  return formattedTime;
}
const Discord = require('discord.js');
const database = require('croxydb');//krom code Krom#0516

exports.run = (client, message, args) => {
  let yrol = database.fetch(`yrol.${message.guild.id}`)
  if(!yrol) return message.channel.send(`Yetkili rolü ayarlanmamış!`)
  if(!message.member.roles.cache.has(yrol)) return message.channel.send(`Bu komutu kullanabilmek için YETKİLİ ROLÜNE sahip olmalısın.`)
 
  if (!message.guild) {
  const ozelmesajuyari = new Discord.MessageEmbed()
  .setColor(0xFF0000)
  .setTimestamp()
  .setAuthor(message.author.username, message.author.avatarURL())
  .addField(':warning: Uyarı :warning:', '`kick` adlı komutu özel mesajlarda kullanamazsın.')
  return message.author.send(ozelmesajuyari); }
  let guild = message.guild
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let modlog = guild.channels.cache.find('name', 'Mod-log');
  if (!codeminglog) return message.reply('`Mod-log` kanalını bulamıyorum.');
  if (reason.length < 1) return message.reply('Sunucudan atma sebebini yazmalısın.');
  if (message.mentions.users.cache.size < 1) return message.reply('Kimi sunucudan atacağını yazmalısın.').catch(console.error);

  if (!message.guild.member(user).kickable) return message.reply('Yetkilileri sunucudan atamam.');
  message.guild.member(user).kick();
//krom code Krom#0516//krom code Krom#0516//krom code Krom#0516
  const embed = new Discord.MessageEmbed()//krom code Krom#0516
    .setColor(0x00AE86)//krom code Krom#0516
    .setTimestamp()//krom code Krom#0516
    .addField('Eylem:', 'Sunucudan atma :bangbang: ')//krom code Krom#0516
    .addField('Atılan Kullanıcı:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('Atan Yetkili:', `${message.author.username}#${message.author.discriminator}`)//krom code Krom#0516
    .addField('Atma Sebebi: ', reason);
  return guild.channels.cache.get(modlog.id).send(embed);
};//krom code Krom#0516
//krom code Krom#0516
exports.conf = {//krom code Krom#0516
  enabled: true,//krom code Krom#0516
  guildOnly: true,
  aliases: ['at'],//krom code Krom#0516
  permLevel: 0
};//krom code Krom#0516

exports.help = {
  name: 'kick',
  description: 'İstediğiniz kişiyi sunucudan atar.',
  usage: 'kick [kullanıcı] [sebep]'
};
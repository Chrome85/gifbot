const Discord = require('discord.js');
const database = require('croxydb');//krom code Krom#0516

exports.run = async(client, message, args) => {
	if(!message.member.roles.cache.has(yrol)) return message.channel.send(`Bu komutu kullanabilmek için YETKİLİ ROLÜNE sahip olmalısın.`)

   	let kanal = message.mentions.channels.first()
    if(!kanal) return message.channel.send('```Ban log kanalını belirtmelisin```')

    db.set(`banlog_${message.guild.id}`, kanal.id)
   
    return message.channel.send(`Ban log kanalı <#${kanal.id}> Olarak ayarlandı!`)
  
 }

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases:['banlog'],
	permlevel: 0
};

exports.help = {
	name: "ban-log"
}
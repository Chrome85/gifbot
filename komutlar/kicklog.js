const Discord = require('discord.js');//krom code Krom#0516
const db = require('croxydb');//krom code Krom#0516
const database = require('croxydb');//krom code Krom#0516
//krom code Krom#0516
exports.run = async(client, message, args) => {//krom code Krom#0516
	let yrol = await database.fetch(`yrol.${message.guild.id}`)
	if(!yrol) return message.channel.send(`Yetkili rolü ayarlanmamış!`)
	if(!message.member.roles.cache.has(yrol)) return message.channel.send(`Bu komutu kullanabilmek için YETKİLİ ROLÜNE sahip olmalısın.`)//krom code Krom#0516
   	let kanal = message.mentions.channels.first()
    if(!kanal) return message.channel.send('```Kick Log kanalını belirtmelisin```')
//krom code Krom#0516
    db.set(`kicklog_${message.guild.id}`, kanal.id)
    let yetkilirol = await database.fetch(`yetkilirol.${message.guild.id}`)

    return message.channel.send(`Kick Log Kanalı Başarıyla <#${kanal.id}> Olarak ayarlandı!`)
  
 }//krom code Krom#0516

exports.conf = {//krom code Krom#0516
	enabled: true,
	guildOnly: false,
	aliases:[],
	permlevel: 0
};

exports.help = {
	name: "kick-log"
}
const Discord = require('discord.js');//krom code Krom#0516
const db = require('croxydb');//krom code Krom#0516
const database = require('croxydb');//krom code Krom#0516
//krom code Krom#0516
exports.run = async(client, message, args) => {//krom code Krom#0516
	let rol = db.fetch(`banrol_${message.guild.id}`)//krom code Krom#0516
   let yrol = await database.fetch(`yrol.${message.guild.id}`)
   if(!yrol) return message.channel.send(`Yetkili rolü ayarlanmamış!`)
   if(!message.member.roles.cache.has(yrol)) return message.channel.send(`Bu komutu kullanabilmek için YETKİLİ ROLÜNE sahip olmalısın.`)
	let banlog = db.fetch(`banlog_${message.guild.id}`)

	if(!banlog) return message.channel.send('Ban log sistemi ayarlanmamış. Ayarlamak için .banlog #kanal ')
    let user = message.mentions.users.first()//krom code Krom#0516
    let sebep = args.slice(1).join(' ') || "Belirtilmemiş."//krom code Krom#0516
     if(!user) return message.channel.send('<a:unlem:785429317898862603>     ``Bir kişi etiketlemelisin.``')
     if(user.id === message.author.id) return message.channel.send('<a:unlem:724733762541453384> ``Kendini banlayamazsın.``')
     if(user.id === client.user.id) return message.channel.send('<a:unlem:724733762541453384> ``Botu banlayamazsın.``')
  if(user.id === message.guild.ownerID) return message.channel.send('<a:unlem:785429317898862603>  ``Sunucu sahibini banlayamazsın.``')
    if (!message.guild.member(user).bannable) return message.reply('<a:unlem:785429317898862603>    ``Bu kişinin rolü senden üstte veya `Üyeleri yasakla` yetkisine sahip.``');
//krom code Krom#0516
   message.channel.send('<@'+ user.id + '> Kişisini **'+ sebep+ '** Sebebiyle banlamak istediğine eminmisin ?').then(async m => {
   	 m.react('✅').then(r =>{ 
//krom code Krom#0516
   const tamam = (reaction,user) => reaction.emoji.name == '✅' && user.id == message.author.id;
      const tamam2 = m.createReactionCollector(tamam)
//krom code Krom#0516
   tamam2.on('collect', async (r)=>{
  message.guild.members.cache.get(user.id).ban({
  	reason: `${sebep}`
          })//krom code Krom#0516
      let embed = new Discord.MessageEmbed()
    .setColor('0x36393E')
    .setTitle('Kişi banlandı')//krom code Krom#0516
    .addField('Yetkili', `${message.author.tag}`)
    .addField('Banlanan kişi', user)
    .addField('Sebep', sebep)//krom code Krom#0516
    client.channels.cache.get(banlog).send(embed)//krom code Krom#0516
       })
    })//krom code Krom#0516
    await m.react('❌').then(r =>{ //krom code Krom#0516

   const tamam = (reaction,user) => reaction.emoji.name == '❌' && user.id == message.author.id;
      const tamam2 = m.createReactionCollector(tamam)

   tamam2.on('collect', async (r)=>{
     m.delete()//krom code Krom#0516
message.channel.send('Banlama işlemi iptal edildi.')
      })//krom code Krom#0516
    })
 })
} 
 
exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases:[],
	permlevel: 0
};

exports.help = {
	name: "ban"
}
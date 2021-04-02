const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const { Client, Util } = require('discord.js');
require('./util/eventLoader.js')(client);
const fs = require('fs');
const db = require("croxydb")//krom code Krom#0516
const database = require('./database.json')

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => { 
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.on('message', msg => {
  if (msg.content === '.eval') {
    if (!["789164345585565706"].includes(message.author.id))//eval kullanack kişilerin id'lerini girin
                return message.reply("`code` komutunu kullanmak için gerekli izne sahip değilsiniz!").catch();
    let result = eval(args.join(" "))
message.channel.send(result)
  }
});


client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
client.login(ayarlar.token);

//---------------------------------------------------KOMUTLAR--------------------------------------------------- //


//-------------------- Mod Log Sistemi --------------------//

client.on('channelCreate', async channel => {
    const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
    if (!c) return;
      var embed = new Discord.MessageEmbed()
                      .addField(`Kanal oluşturuldu`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\nID: ${channel.id}`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL())
      c.send(embed)
  });
  
  client.on('channelDelete', async channel => {
    const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
    if (!c) return;
      let embed = new Discord.MessageEmbed()
                      .addField(`Kanal silindi`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\nID: ${channel.id}`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL())
  
      c.send(embed)
  });
  
     client.on('channelNameUpdate', async channel => {
    const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
    if (!c) return;
      var embed = new Discord.MessageEmbed()
                      .addField(`Kanal İsmi değiştirildi`, ` Yeni İsmi: \`${channel.name}\`\nID: ${channel.id}`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL())
      c.send(embed)
  });
  
  client.on('emojiCreate', emoji => {
    const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
    if (!c) return;
  
      let embed = new Discord.MessageEmbed()
                      .addField(`Emoji oluşturuldu`, ` İsmi: \`${emoji.name}\`\n GIF?: **${emoji.animated}**\nID: ${emoji.id}`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL())
  
      c.send(embed)
      });
  client.on('emojiDelete', emoji => {
    const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
    if (!c) return;
  
      let embed = new Discord.MessageEmbed()
                      .addField(`Emoji silindi`, ` İsmi: \`${emoji.name}\`\n GIF? : **${emoji.animated}**\nID: ${emoji.id}`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL())
  
      c.send(embed)
      });
  client.on('emojiUpdate', (oldEmoji, newEmoji) => {
    const c = newEmoji.guild.channels.cache.get(db.fetch(`codeminglog_${newEmoji.guild.id}`));
    if (!c) return;
  
      let embed = new Discord.MessageEmbed()
                      .addField(`Emoji güncellendi`, ` Eski ismi: \`${oldEmoji.name}\`\n Yeni ismi: \`${newEmoji.name}\`\nID: ${oldEmoji.id}`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${newEmoji.client.user.username}#${newEmoji.client.user.discriminator}`, newEmoji.client.user.avatarURL())
  
      c.send(embed)
      });
  
  client.on('guildBanAdd', async (guild, user) => {    
      const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
    if (!channel) return;
    
    const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())
  
      let embed = new Discord.MessageEmbed()
                      .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
                      .addField(`Kullanıcı banlandı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Sebep: **${entry.reason || 'Belirtmedi'}**\n Banlayan: **${entry.executor.username}#${entry.executor.discriminator}**`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL())
  
      channel.send(embed)
  });
  
  client.on('guildBanRemove', async (guild, user) => {    
      const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
    if (!channel) return;
    
    const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())
  
      let embed = new Discord.MessageEmbed()
                      .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
                      .addField(`Kullanıcının banı açıldı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Banı Kaldıran: **${entry.executor.username}#${entry.executor.discriminator}**`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL())
  
      channel.send(embed)
  });
  client.on('messageDelete', async message => {    
    if(message.author.bot) return
  
      const channel = message.guild.channels.cache.get(db.fetch(`codeminglog_${message.guild.id}`));
    if (!channel) return;
    
      let embed = new Discord.MessageEmbed()
                      .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
                      .setTitle("Mesaj silindi")                
                      .addField(`Silinen mesaj : ${message.content}`,`Kanal: ${message.channel.name}`)
                    //  .addField(`Kanal:`,`${message.channel.name}`)
                      .setTimestamp()
                      .setColor("Black")
                      .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL())
  
      channel.send(embed)
  });
  
  client.on('messageUpdate', async(oldMessage, newMessage) => {
      if(oldMessage.author.bot) return;
      if(oldMessage.content == newMessage.content) return;
  
      const channel = oldMessage.guild.channels.cache.get(db.fetch(`codeminglog_${oldMessage.guild.id}`));
      if(!channel) return;
  
      let embed = new Discord.MessageEmbed()
      .setTitle("Mesaj güncellendi!")
      .addField("Eski mesaj : ",`${oldMessage.content}`)
      .addField("Yeni mesaj : ",`${newMessage.content}`)
      .addField("Kanal : ",`${oldMessage.channel.name}`)
      .setTimestamp()
      .setColor("Black")
      .setFooter(`${oldMessage.client.user.username}#${oldMessage.client.user.discriminator}`,`${oldMessage.client.user.avatarURL()}`)
  
      channel.send(embed)
  });
  
  client.on('roleCreate', async (role) => {    
  
      const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
    if (!channel) return;
    
      let embed = new Discord.MessageEmbed()
  .addField(`Rol oluşturuldu`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
  .setTimestamp()
  .setColor("Black")
  .addField("Rol renk kodu : ",`${role.hexColor}`)
  .setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL())
  
      channel.send(embed)
  });
  
  client.on('roleDelete', async (role) => {    
  
      const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
    if (!channel) return;
    
      let embed = new Discord.MessageEmbed()
  .addField(`Rol silindi`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
  .setTimestamp()
  .setColor("Black")
      .addField("Rol renk kodu : ",`${role.hexColor}`)
  .setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL())
  
      channel.send(embed)
  })
  
  //-------------------- Mod Log Sistemi --------------------//


//-------------------- Otorol Sistemi --------------------//

client.on("guildMemberAdd", async member => {
    let kanal1 = await db.fetch(`otorolkanal_${member.guild.id}`);
    let rol1 = await db.fetch(`otorolrol_${member.guild.id}`);
  
    let kanal = member.guild.channels.cache.get(kanal1);
    let rol = member.guild.roles.cache.get(rol1);
  
    if (!kanal) return;
    if (!rol) return;
  
    const embed = new Discord.MessageEmbed()
  
      .setColor("BLACK")
      .setDescription(
        `Sunucuya Katılan **${member}** Adlı Kullanıcıya Başarıyla \`${rol.name}\` Rolü Verildi.`
      );
  
    kanal.send(embed);
    member.roles.add(rol);
  });
  
  //-------------------- Otorol Sistemi --------------------//
  //-------------------- Reklam Engel Sistemi --------------------//

client.on("message", async message => {
    let uyarisayisi = await db.fetch(`reklamuyari_${message.author.id}`);
    let reklamkick = await db.fetch(`kufur_${message.guild.id}`);
    let kullanici = message.member;
    if (!reklamkick) return;
    if (reklamkick == "Açık") {
      const reklam = [
        "discord.app",
        "discord.gg",
        ".com",
        ".net",
        ".xyz",
        ".tk",
        ".io",
        ".me",
        ".gg",
        "www.",
        "https://",
        "http://",
        ".gl",
        ".org",
        ".com.tr",
        ".biz",
        ".party",
        ".az",
        ".hub"
      ];
      if (reklam.some(word => message.content.toLowerCase().includes(word))) {
        if (!message.member.hasPermission("BAN_MEMBERS")) {
          message.delete();
          db.add(`reklamuyari_${message.author.id}`, 1); //uyarı puanı ekleme
          if (uyarisayisi === null) {
            let uyari = new Discord.MessageEmbed()
              .setColor("BLACK")
              .setTitle("Reklam-Engel!")
              .setDescription(
                `<@${message.author.id}> Reklam Yapmayı Kes! Bu İlk Uyarın! (1/3)`
              )
              .setFooter(client.user.username, client.user.avatarURL())
              .setTimestamp();
            message.channel.send(uyari);
          }
          if (uyarisayisi === 1) {
            let uyari = new Discord.MessageEmbed()
              .setColor("BLACK")
              .setTitle("Reklam-Engel!")
              .setDescription(
                `<@${message.author.id}> Reklam Yapmayı Kes! Bu İkinci Uyarın! (2/3)`
              )
              .setFooter(client.user.username, client.user.avatarURL())
              .setTimestamp();
            message.channel.send(uyari);
          }
          if (uyarisayisi === 2) {
            message.delete();
            await kullanici.kick({
              reason: `Reklam-Engel Sistemi!`
            });
            let uyari = new Discord.MessageEmbed()
              .setColor("BLACK")
              .setTitle("Reklam-Engel!")
              .setDescription(
                `<@${message.author.id}> Reklam Yaptığı İçin Sunucudan Atıldı! (3/3)`
              )
              .setFooter(client.user.username, client.user.avatarURL())
              .setTimestamp();
            message.channel.send(uyari);
          }
          if (uyarisayisi === 3) {
            message.delete();
            await kullanici.members.ban({
              reason: `Reklam-Engel Sistemi!`
            });
            db.delete(`reklamuyari_${message.author.id}`);
            let uyari = new Discord.MessageEmbed()
              .setColor("BLACK")
              .setTitle("Reklam Kick Sistemi")
              .setDescription(
                `<@${message.author.id}> Atıldıktan Sonra Tekrar Reklam Yaptığı İçin Sunucudan Yasaklandı!`
              )
              .setFooter(client.user.username, client.user.avatarURL())
              .setTimestamp();
            message.channel.send(uyari);
          }
        }
      }
    }
  });
  
  //-------------------- Reklam Engel Sistemi --------------------//

  // CAPS ENGEL 
client.on("message", async message => { 
  var anahtar = db.fetch(`caps_${message.guild.id}`)
  if(anahtar === "acik"){
    if(message.author.bot) return;
    if(message.content.length < 5) return;
    let capsengel = message.content.toUpperCase();
    let beyazliste =
      message.mentions.users.first() ||
      message.mentions.channels.first() ||
      message.mentions.roles.first()
      
   if(message.content == capsengel){
    if(!beyazliste && !message.content.includes("@everyone") && !message.content.includes("@here") && !message.member.hasPermission("BAN_MEMBERS"))
      {
        message.delete().then(message.channel.send("Büyük harf kullanmamalısın.!!!").then(i => i.delete(10000)))
      
      }}
      

    
    
  }
  if(!anahtar) return;
})
//capsengel son

//-------------------- Ever Here Engel --------------------//

client.on("message", async msg => {
    let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`);
    if (hereengelle == "acik") {
      const here = ["@here", "@everyone"];
      if (here.some(word => msg.content.toLowerCase().includes(word))) {
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
          msg.delete();
          msg.channel
            .send(`<@${msg.author.id}>`)
            .then(message => message.delete());
          var e = new Discord.MessageEmbed()
            .setColor("BLACK")
            .setDescription(`Bu Sunucuda Everyone ve Here Yasak!`);
          msg.channel.send(e);
        }
      }
    } else if (hereengelle == "kapali") {
    }
  });
  
  //-------------------- Ever Here Engel --------------------//

    //////ETIKETLENINCE PREFIX////
  
    client.on("message", msg => {
        const westrabumbe = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`Krom Code Yönetim Botu ${prefix}\n Yardım için: ${prefix}yardım`)
        if (msg.content.includes(`<@${client.user.id}>`) || msg.content.includes(`<@!${client.user.id}>`)) {
          msg.channel.send(westrabumbe);
        }
      });
      
      ////////ETIKETLNINCE PREFIX///////  


  //-------------------- Jail Sistem  --------------------//

      client.on('guildMemberAdd', async member => {
        const data = require('croxydb')
        const asd = data.fetch(`${member.guild.id}.jail.${member.id}`)
        if(asd) {
        let data2 = await data.fetch(`jailrol_${member.guild.id}`)
        let rol = member.guild.roles.cache.get(data2)
        if(!rol) return;
        let kişi = member.guild.members.cache.get(member.id)
        kişi.roles.add(rol.id);
        kişi.roles.cache.forEach(r => {
        kişi.roles.remove(r.id)
        data.set(`${member.guild.id}.jail.${kişi.id}.roles.${r.id}`, r.id )})
            data.set(`${member.guild.id}.jail.${kişi.id}`, 'Surge')
          const wasted = new Discord.MessageEmbed()
          .setAuthor(member.user.tag, member.user.avatarURL())
          .setColor(`RANDOM`)
          .setDescription(``)
          .setTimestamp()
            member.send(wasted)
          }
        });
          //-------------------- Jail Sistem  --------------------//

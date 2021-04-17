const Discord = require('discord.js');
const fs = require('fs');
const config = require("../config.json");
const fetch = require('node-fetch');
module.exports.run = async (client, message, args) => {
    if(args[0] === undefined) {
        return message.reply("You need to specify a user")
    }
    console.log(args)
    fetch(`https://api.hypixel.net/player?name=${args[0]}&key=${config.hypixelapi}`)
    .then(res => res.text())
    .then(text => {
        var obj = JSON.parse(text);
        var user = obj.player
        console.log(user.stats)
        if (`${user}` === "null"){
            message.reply("This user doesn't exist")
        }
        if (obj.success === 'You have already looked up this name recently'){
            message.reply("Please wait a while before searching the user again")
        }
        //Rank Assignment
        if (user.rank === undefined){
            if(user.newPackageRank === undefined){
                var rank = "Default"
            }else if(user.newPackageRank === "VIP"){
                var rank = "VIP"
            }else if(user.newPackageRank === "VIP_PLUS"){
                var rank = "VIP+"
            }else if(user.newPackageRank === "MVP"){
                var rank = "MVP"
            }else if(user.newPackageRank === "MVP_PLUS"){
                var rank = "MVP+"
            }
            if(user.monthlyPackageRank === "SUPERSTAR"){
                var rank = "MVP++"
            }
        }else{
            var rank = user.rank
        }
        //Rank Assignment End
        //Skywars Stats
        if (user.stats.SkyWars.wins === undefined){
            var swwins = 0
        }else{
            var swwins = user.stats.SkyWars.wins
        }
        if (user.stats.SkyWars.losses === undefined){
            var swlose = 0
        }
        else{
            var swlose = user.stats.SkyWars.losses
        }
        var swg = swwins + swlose
        var swa = swg/500
        if (Math.round(swa*100) < 100){
            var swprogress = `(${Math.round(swa*100)}% Done)`
        }else{
            var swprogress = `Complete`
        }
        //Skywars Stats End
        //Bedwars Stats
        if (user.stats.Bedwars.games_played_bedwars === undefined){
            var bwg = 0
        }else{
            var bwg = user.stats.Bedwars.games_played_bedwars
        }
        var bwa = bwg/500
        if (Math.round(bwa*100) < 100){
            var bwprogress = `(${Math.round(bwa*100)}% Done)`
        }else{
            var bwprogress = `Complete`
        }
        //Bedwars Stats End
        //Duels Stats
        if (user.stats.Duels.games_played_duels === undefined){
            var dug = 0
        }else{
            var dug = user.stats.Duels.games_played_duels
        }
        var dua = dug/500
        if (Math.round(dua*100) < 100){
            var duprogress = `(${Math.round(dua*100)}% Done)`
        }else{
            var duprogress = `Complete`
        }
        //Duels Stats End
        // Level Calculation
        var networkLevel = Math.floor((Math.sqrt(user.networkExp + 15312.5) - 125/Math.sqrt(2))/(25*Math.sqrt(2)));
        if (networkLevel < 50){
            var lvlprogress = `(${Math.floor((networkLevel/50)*100)}% Done)`
        }else{
            var lvlprogress = `Complete`
        }
        //Level Calculation End
        const atlasresults = new Discord.MessageEmbed()
            .setTitle('Atlas Progress')
            .setURL('https://github.com/TheTaxPerson')
            .addField('Hypixel Rank', `${rank}`, true)
            .addField('Hypixel Level', `${networkLevel}/50\n${lvlprogress}`, true)
            .addField('\u200B', '\u200B')
            .addFields(
                { name: 'Skywars', value: `${swg}/500 Games\n${swprogress}`, inline: true },
                { name: 'Bedwars', value: `${bwg}/500 Games\n${bwprogress}`, inline: true },
                { name: 'Duels', value: `${dug}/500 Games\n${duprogress}`, inline: true },
            )
            .setThumbnail(`https://crafatar.com/renders/head/${user.uuid}`)
            
            .setTimestamp()
        //ColorChange
        if (rank == "Default"){
            atlasresults.setColor("#b7b7b2")
        }else if (rank == "VIP" || rank == "VIP+"){
            atlasresults.setColor("#1bfc30")
        }else if (rank == "MVP" || rank == "MVP+"){
            atlasresults.setColor("#00baff")
        }else if (rank == "MVP++"){
            atlasresults.setColor("#fbae23")
        }else if (rank == "ADMIN" || rank == "YOUTUBER"){
            atlasresults.setColor("#FF0000")
        }else{
            atlasresults.setColor("#cd00cd")
        }
        console.log(user)
        if (user.lastLogin > user.lastLogout){
            atlasresults.setFooter('User is currently online', `https://crafatar.com/avatars/${user.uuid}`);
        }else{
            atlasresults.setFooter('User is currently offline', `https://crafatar.com/avatars/${user.uuid}`);
        }
        message.channel.send(atlasresults);
    })
    
}
module.exports.help = {
  name: 'atlas'
}

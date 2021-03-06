const Discord = require('discord.js');
const bot = new Discord.Client();
//edit suf to change the suffix for commands
const suf = "rr";
bot.login('NDA4ODY4MTQ3MDE0NDAyMDQ4.DVYgFQ.bIRw2oAgxtn7IaZsmJf6Q7q-lzg');
const gameStatus = "Type '" + suf + "' for help.";

const helpMsg = 'Type the suffix before all these commands ' + suf + '. * = optional\n' +
'\n' +
'\"get\" - Gets and sets the current page \n' +
'          - Usage:\"' + suf + ' get [subreddit] [tab*]\"\n' +
'          - Alias: \"s\", \"g\", \"set\"\n' +
'          - Notes: Using \"frontPage\" or \"front\" will set it to front page reddit\n' +
'          - Example: \"' + suf + " get overwatch top\"\n" +
'\n' +
'\"list\" - Lists all posts on current page \n' +
'           - Usage:\"' + suf + ' list\"\n' +
'           - Alias: \"l\"\n' +
'\n' +
'\"[number]\" - Gets a post from the current page, its based on the numbering given by the "list" command \n' +
'               - Usage:\"' + suf + ' [number]\"\n' +
'\n' +
'\"random\" - Gets random post from current page \n' +
'           - Usage:\"' + suf + ' random\"\n' +
'           - Alias: \"rand\", \"r\"\n' +
'\n' +
'\"next\" - Gets and sets the next page based on the current page \n' +
'           - Usage:\"' + suf + ' next\"\n' +
'\n'
;

var servers = {};
var watching = {
    "channels":[
    ]
};

bot.on('ready', () => {
    console.log("Bot is ready");
    //bot.user.setStatus(gameStatus);
    bot.user.setStatus('adsfadsfsdfdsfdsafsfsdafds');
});
var currentMsg;//a way to store the current message so methods outside of bot.on can use it.

bot.on('message', (message)=>{
    currentMsg = message;
    console.log(message.guild.id);
    if(!servers[message.guild.id]){
        servers[message.guild.id] = {
            currentPage:null,
        };
        //getRedditJSON("https://reddit.com/hot.json", message.guild.id);
    }
    var guildId = message.guild.id;
    var msgCaseSense = message.content;
    var argCaseSense = msgCaseSense.split(" ");
    var msg = message.content.toLowerCase();
    var arg = msg.split(" ");
    var server = servers[guildId];
    //parse invaldid tabs
    if(arg[0] == suf + "a"){
        message.delete();
    }
    if(arg[0] == suf){
        if(arg.length == 1 || arg[1] == "help"){
            sendEmbed(4216564, "Help", helpMsg);
        }
        else if(arg[1] == "s" || arg[1] == "set"
        || arg[1] == "g" || arg[1] == "get"){
            if(arg[2]){
                if(arg[3] && (arg[2] == "frontpage" || arg[2] == "front")){
                    console.log("1");
                    var url = "https://reddit.com/" + arg[3] + ".json";
                    getRedditJSON(url, guildId);
                    setTimeout(function(){
                        sendEmbed(4650299, "Attempting", "Attempting to get: " + url);
                    }, 1000);
                }
                else if(arg[2] =="front" || arg[2] == "frontPage"){
                    console.log("2");
                    getRedditJSON("https://reddit.com/.json", guildId);
                    setTimeout(function(){
                        sendEmbed(4650299, "Attempting", "Attempting to get: https://reddit.com/.json");
                    }, 1000);
                }
                else if(arg[2] && arg[3]){
                    console.log("3");
                    var url = "https://reddit.com/r/" + arg[2] + "/" + arg[3] + ".json";
                    sendEmbed(4650299, "Attempting", "Attempting to get: " + url);
                    getRedditJSON(url, guildId);
                    setTimeout(function(){

                    }, 1000);
                }
                else if(arg[2]){
                    console.log("4");
                    var url = "https://reddit.com/r/" + arg[2] + "/hot.json";
                    getRedditJSON(url, guildId);
                    setTimeout(function(){
                        sendEmbed(4650299, "Attempting", "Attempting to get: " + url);
                    }, 1000);
                }
            }
            else{
                sendEmbed(12393521, ":exclamation:Error:exclamation:",
                "Invalid parameters for get/set");
            }
        }

        else if(arg[1] == "watch"){
            watching[message.channel.guildId].channels[message.channel.id].push(arg[2]);
            console.log(watching[message.channel.guildId].channels[message.channel.id]);
            //message.channel.id gets channel id
            //message
        }
        
        else if(arg[1] == "tts"){
            message.channel.sendMessage(msg.substring(7, msg.length), {tts: true});
        }

        else if(arg[1] == "next" || arg[1] == "prev" || arg[1] == "previous"){
            if(server.currentPage != null){
                if(server.currentPage.hasOwnProperty("data")){
                    var selectedPage = server.currentPage.data;
                    var curUrl = server.currentUrl;
                    //curUrl = "https://www.reddit.com/?count=2666&before=t3_6uyicn";
                    if(curUrl.includes("?count=")){
                        var numStart = curUrl.indexOf("?count=") + 7;
                        var numEnd = curUrl.indexOf("&", numStart);
                        var count = Number(curUrl.substring(numStart, numEnd));
                        curUrl = curUrl.substring(0, curUrl.indexOf("?count="));
                        if(arg[1] == "next"){
                            if(selectedPage.after == null){
                                sendEmbed(12393521, "Error", "There is no next page");
                            }
                            else{
                                count += 25;
                                var url2 = curUrl + "?count=" + count + "&after=" + selectedPage.after;
                                getRedditJSON(url2, guildId);
                                setTimeout(function(){
                                    sendEmbed(4650299, "Attempting", "Attempting to get: " + url2);
                                }, 1000);
                            }
                        }
                        //not properley working
                        else if(arg[1] == "prev" || arg[1] == "previous"){
                            if(selectedPage.before == null){
                                sendEmbed(12393521, "Error", "There is no previous page");
                            }
                            else{
                                count -= 24;
                                var url3 = curUrl + "?count=" + count + "&before=" + selectedPage.before;
                                getRedditJSON(url3, guildId);
                                setTimeout(function(){
                                    sendEmbed(4650299, "Attempting", "Attempting to get: " + url3);
                                }, 1000);
                            }
                        }

                    }
                    else{
                        if(arg[1] == "next"){
                            var url2 = curUrl + "?count=25&after=" + selectedPage.after;
                            getRedditJSON(url2, guildId);
                            setTimeout(function(){
                                sendEmbed(4650299, "Attempting", "Attempting to get: " + url2);
                            }, 1000);
                        }
                        else if(arg[1] == "prev" || arg[1] == "previous"){
                            if(selectedPage.before == null){
                                sendEmbed(12393521, "Error", "There is no previous page");

                            }
                            else{
                                var url3 = curUrl + "?count=25&before=" + selectedPage.before;
                                getRedditJSON(url3, guildId);
                                setTimeout(function(){
                                    sendEmbed(4650299, "Attempting", "Attempting to get: " + url3);
                                }, 1000);
                            }

                        }
                    }
                }
                else{
                    sendEmbed(16774459, " ", "Invalid current page page");
                }

            }
            else{
                sendEmbed(16774459, " ", "There is no current pagee");
            }
        }

        else if(arg[1] == "random" || arg[1] == "rand" || arg[1] == "r"){
            if(server.currentPage != null){
                if(server.currentPage.hasOwnProperty("data")){
                    var selectedPage = server.currentPage.data;
                    if(selectedPage.children){
                        message.channel.sendMessage(selectedPage.children[getRndInteger(0,
                        selectedPage.children.length -1)].data.url);
                    }
                }
            }
            else{
                sendEmbed(16774459, " ", "There is no current page");
            }
        }

        else if(arg[1] == "list" || arg[1] == "l"){
            if(server.currentPage){
                sendEmbed(4216564,"",createList(guildId));
            }
            else{
                sendEmbed(12393521, ":exclamation:Error:exclamation:",
                "There is no page, get one with \"" + suf + " g" + "[subreddit]\"");
            }
        }


        else if(!isNaN(arg[1])){
            if(server.currentPage){
                var selectedPage = server.currentPage.data;
                var i = Math.round(parseFloat(arg[1])) - 1;
                if(selectedPage.children.length - 1 >= i){
                    message.channel.sendMessage(selectedPage.children[i].data.url);
                }
                else{
                    sendEmbed(12393521, ":exclamation:Error:exclamation:", "Invalid number");
                }
            }
            else{
                sendEmbed(12393521, ":exclamation:Error:exclamation:",
                "There is no page, get one with \"" + suf + " g" + "[subreddit]\"");
            }
        }
        else{
            sendEmbed(12393521, ":exclamation:Error:exclamation:", "Invalid command");
        }
    }


    function sendEmbed(col, titl, desc){
        message.channel.send({embed:{
            color: col,
            author:{
                name: bot.user.username,
                icon_url: bot.user.avatarURL,
            },
            title: titl,
            description: desc,
        }});
    }
});
//list titles of all posts on currentPage
function createList(id){
    var maxLength = 2048;
    var page = servers[id].currentPage.data;
    var list;
    var added;
    var maxLengthTitle = Math.floor(2048/page.children.length);
    var numbering = 0;
    var i = 0;
    for(i = 0; i < page.children.length; i++){
        //console.log(page.children[i].data.title);
        numbering+= 1;
        added = numbering + ". " + page.children[i].data.title + "\n";
        if(added.length > maxLengthTitle){
            added = numbering + ". " + page.children[i].data.title;
            added = added.substring(0, maxLengthTitle - 5) + "...\n";
        }
        list += added;
    }
    return list;
}
//give url, will set the currentPage to the JSON object of the url.
function getRedditJSON(urll, id){
    var page;
    var request = require('request');
    console.log("starting request: " + urll);
    request(urll, function (error, response, body) {
        console.log("finished request");
        //add way to catch errors

        if (!error && response.statusCode == 200) {
            page = JSON.parse(body);
            setTimeout(function(){
                if(body.length <= 135){ //fix when searching ex
                    console.log(page.message);
                    //if the url has nothing
                    sendEmbed(12393521, "Error", "Invalid urll", currentMsg);
                }
                else{
                    servers[id].currentPage = page;
                    servers[id].currentUrl = urll;
                }
            }, 3000);

        }
        else{
            //if unsuccsessful
            sendEmbed(12393521, "Error", "Invalid url", currentMsg);
            console.log("Error:" + error);
        }
    })
}

function sendEmbed(col, titl, desc, msgObj){
        msgObj.channel.send({embed:{
            color: col,
            author:{
                name: bot.user.username,
                icon_url: bot.user.avatarURL,
            },
            title: titl,
            description: desc,
        }});
    }

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

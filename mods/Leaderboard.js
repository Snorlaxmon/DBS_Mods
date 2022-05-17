module.exports = {
    name: "Leaderboard",
    author: ["PlayboyPrime#3839"],
    version: "1.0.0",
    changelog: "Release",
    isEvent: false,
    isResponse: true,
    isMod: true,
    isAddon: false,
    section: "User Data",
    html: function (data) {
        return `
            <div class="form-group">
                <label>Data field *</label>
                <input class="form-control needed-field" id="df" name="df"></input>
                </div>
            </div>

            <div class="form-group">
                <label>Sort type *</label>
                <select class="form-control" name="sorttype">
                    <option value="ascending" selected>Ascending</option>
                    <option value="descending">Descending</option>
                </select>
            </div>
            <hr>
            <div class="form-group">
                <label>Variable Name *</label>
                <input onchange="document.getElementById('varlabel').innerHTML = '$\{' + document.getElementById('vartype').value + 'Vars.' + document.getElementById('varname').value + '\}'" class="form-control needed-field" id="varname" name="varname"></input>
                <h6 id="varlabel"></h6>
            </div>
            
            <div class="form-group">
                <label>Variable Type *</label>
                <select onchange="document.getElementById('varlabel').innerHTML = '$\{' + document.getElementById('vartype').value + 'Vars.' + document.getElementById('varname').value + '\}'" class="form-control" id="vartype" name="vartype">
                    <option value="temp" selected>Temp Variable</option>
                    <option value="server">Server Variable</option>
                    <option value="global">Global Variable</option>
                </select>
            </div>
        `;
    },
    init: function (DBS) {
        if (!DBS.BetterMods) return console.log(`\x1b[36m [${this.name}.JS] \x1b[0m\x1b[31mBetterMods.js is not loaded. BetterMods.js is required to use this mod. \x1b[0m`);
        console.log("Loaded Leaderboard");
    },
    mod: async function (DBS, message, action, args, command, index) {
        const fs = require("fs")
        const { resolve } = require('path');
        const ud = JSON.parse(fs.readFileSync(resolve(__dirname, "../BotData/user/user.json"), 'utf8'));

        const df = DBS.BetterMods.parseAction(action.df, message)
        var array = []

        var msg = ""
        var place = 1

        Object.entries(ud.users).forEach(user =>{
            array.push(user)
        })

        const ascending = (a,b) => a[1].xp - b[1].xp;
        const descending = (a,b) => b[1].xp - a[1].xp;

        if(action.sorttype == "ascending"){
            array.sort(ascending);
        } else array.sort(descending)
        
        array.forEach(user => {
            user.forEach(value => {
                if(value[df]){
                    msg = msg + place + ". <@" + user[0] + ">: " + value[df].toString() + " " + df + "\n"
                    place++
                }
            })
        })

        DBS.BetterMods.saveVar(action.vartype, action.varname, msg, message.guild)

        DBS.callNextAction(command, message, args, index + 1);
    }
};

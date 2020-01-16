var fs = require('fs');
var fyghtJSON = require('../build/contracts/FighterOwnership.json');

let abi = fyghtJSON.abi;
let abiFile = "ui/js/fyght_abi.js"
let content = "var fyghtABI = " + JSON.stringify(abi) + ";"

fs.writeFile(abiFile, content, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

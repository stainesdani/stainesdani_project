// we are printing all the details of a match in this function from the given link.

// node core modules
let fs = require("fs");
let path = require("path");  // module for joining path to a file

// npm 
let request = require("request");
let cheerio = require("cheerio");   // parsing

let xlsx = require("xlsx");   // module for excel

// url for individual match
// let url = "https://www.espncricinfo.com/series/8048/scorecard/1181768/mumbai-indians-vs-chennai-super-kings-final-indian-premier-league-2019";

// html parsing , extract data
// to manipluate excel 

// request module will request for page from cricinfo server

// we want to call this function from allMatch.js for each fullLink.
// we export this function from this file using
// module.exports.childFn = scrapAMatch;

function scrapAMatch(url){
    // async function
    request(url, cb);
}

console.log("Before");
function cb(err, header, body) {

    if (err == null && header.statusCode == 200) {
        console.log("Recieved resp");
        // console.log(body);
        processMatch(body);
        // fs.writeFileSync("file.html",body);
    } else if (header.statusCode == 404) {
        console.log("404 wrong url");
    } else {
        console.log(err);
        console.log(header.statusCode);
    }
}
console.log("After");

// 
function processMatch(htmlFile){
    // parse the file using cheerio
    // extracts the data
    // send the data to a function that will add data to a excel file

    console.log("################### Match ########################");

    let ch = cheerio.load(htmlFile); 

    // innings
    let bothInnings = ch(".card.content-block.match-scorecard-table .Collapsible");
    
    // to write the tables of two innings into a file
    // fs.writeFileSync("FileInnings.html", bothInnings);

    // iterate over each innings
    for(let i = 0; i<bothInnings.length; i++){
        console.log(`--------------- Inning - ${i+1}-------------------------------`);
        // for team name
        let teamNameElement = ch(bothInnings[i]).find(".header-title.label");
        let teamName = teamNameElement.text().split("Innings")[0].trim();
        
        // when you use index, wrap the entire element in ch() in order to use functions of ch()
        // eg, ch(element[0]).find("className or selector")
        // ch(element[0]).text(), etc.
        
        console.log(teamName);

        // for player name in innings in that team
        // let playerNameElement = ch(bothInnings[i]).find(".batsman-cell");
        // console.log(playerNameElement.text().split("\n"));
        
        // to remove batsman rows from batsman table
        // all rows including the description rows 
        let allRows = ch(bothInnings[i]).find(".table.batsman tbody tr");

        // iterate over all the rows
        for(let j = 0; j<allRows.length; j++){
            // to get rows of Batsman
            // let isBatsmanElement = ch(ch(allRows[j]).find("td")[0]).hasClass("batsman-cell");
            let isBatsman = ch(ch(allRows[j]).find("td")[0]).hasClass("batsman-cell");
            
            // filter the batsman rows using hasClass("batsman-cell")
            if(isBatsman == true){
                // playername
                let playerName = ch(ch(allRows[j]).find("td")[0]).text();
                
                // runs
                let runs = ch(ch(allRows[j]).find("td")[2]).text();
                
                // balls
                let balls = ch(ch(allRows[j]).find("td")[3]).text();
                
                // 4s
                let fours = ch(ch(allRows[j]).find("td")[5]).text();
                
                // 6s
                let sixes = ch(ch(allRows[j]).find("td")[6]).text();
                
                // strike rate
                let sr = ch(ch(allRows[j]).find("td")[7]).text();


                console.log(`${teamName} ${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr );
            }

        }   
        console.log("----------------------------------------------");
        
        // console.log(allRows.length);
        
        // for(let j = 0; j<playerNameElement.length; j++){
            // let playerName = playerNameElement.text();
            // console.log(playerName);
        // }

    }
    console.log("###########################################");
    // required extract 
    // team ,player Name, runs, balls,sr,opponent
}

// from allMatch.js only the function scrapAMatch is called.
// scrapAMatch calls the function request followed by cb
//cb calls the function processMatch
// after processMatch is completed
// the following lines do not run

// ---------------------------------------------------------------------

// excelReader()
function excelReader(filePath, playerName){

    // check if the file for the playerName is present in the path = playerFile
    if(!fs.existsSync(filePath)){
        return null;
    }

    // excel file -- workbook
    let wb = xlsx.readFile(filePath);
    
    // get the data from sheet from a workbook
    // in the excel workbook, there are sheets
    // the sheet name is the player name
    // excelData stores the data from the playerName sheet
    let excelData = wb.Sheets[playerName];

    // now convert the excel format to json (array of objects) 
    // to add new object (match details) of player into the file
    let jsonFormat = xlsx.utils.sheet_to_json(excelData);

    return jsonFormat;

    // processPlayer function will add new object to the
    // jsonFormat and,
    // excelWriter will then convert new json file (with added object) 
    // to excel file

}
// ------------------------------------------------------------

// excelWriter()

function excelWriter(filePath, json, playerName){
    // a new workbook is created
    let newWB = xlsx.utils.book_new();

    // a new sheet in the workbook is created
    // the json file is converted to excel format
    let newWS = xlsx.utils.json_to_sheet(json);

    // the newWS (sheet) is then appended to the workbook 
    // the name of the workbook is kept as playerName
    xlsx.utils.book_append_sheet(newWB, newWS, playerName);

    // the workbook (newWB) is created at the filePath
    xlsx.writeFile(newWB, filePath);
}

// ---------------------------------------------------------------------

// to add data to file system
// uses excelReader and excelWriter function
function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr){
    // will save the data to file system
    
    // player data for each match is stored as a object {}
    // for each player, an array of objects is stored.

    let obj_Match = {
        runs, balls, fours, sixes, sr, teamName
    }; 

    let teamPath = teamName;

    // check if the directory of the team name (eg, MI) is present in file system
    
    // if the directory is present --- check if the file for the player name is present
        // if the file for the player is present
            // store the objects (data) in json
            // add the new object (match details) in the json
            // call excelWriter()
        // if the file for the player is not present
            // create a new file for the player
                // json = []
            // add the new object (match details) in the json
            // call excelWriter()
    
    // if the directory is not present --- the file for player also will not be present 
        // so create a new directory and a new file for the player 
    
    // if directory is not present make a new directory
    if(!fs.existsSync(teamPath)){
        fs.mkdirSync(teamPath);
    }

    // Make the path for the file of playerName, eg. RSharma
    let playerFile = path.join(teamPath, playerName) + ".xlsx";

    // excel function to read
    // to check if function is present
    let fileData = excelReader(playerFile, playerName);
    let json = fileData;

    // if the file for a particular playerName is present in the path playerFile
        // fileData will store the array of objects
            // add the new object(match details) to the array of objects
                // excelWrite()
    // if the file for the playerName is not present in the path playerFile
        // fileData will store null
            // make a new array 
                // add the new object(match details) to the array
                    // excelWrite()

    // Now, if the file for the playerName is not present in the path playerFile

    if(fileData == null){
        json = [];
    }

    json.push(obj_Match);

    // write the array of objects into the excel file
    // using excelWriter()

    // excelWritere(path, arrayOfObjects, playerName);
    excelWriter(playerFile, json, playerName);
}



console.log("###########################################");
module.exports.childFn = scrapAMatch;
// module.exports.val = 1;

// sends request to allMatch page
// loops and calls match.js (sends the url)

let fs = require("fs");
// npm 
let request = require("request");
let cheerio = require("cheerio");

// to import a function from another js file
// let match = require("./match.js");
let match = require("./match.js");
console.log(match);

// url for allMatch page
// let url = "https://www.espncricinfo.com/scores/series/8048/season/2019/indian-premier-league?view=results";

// html parsing , extract data
// to manipluate excel 

// request module will request for page from cricinfo server
function allMatchHandler(url){
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

// cheerio to parse the html file
function processMatch(htmlFile){
    // parse the file using cheerio
    // extracts the data
    // function call to match.js
    let ch = cheerio.load(htmlFile);

    // let allCards = ch(".col-md-8.col-16");

    // for(let i = 0; i<allCards.length; i++){
    //     let link = ch(allCards[i]).find("a[data-hover = 'Scorecard']").attr("href");
    //     console.log(link);
    // }

    let allAElements = ch("a[data-hover = 'Scorecard']");
    console.log(allAElements.length);

    for(let i = 0; i<allAElements.length; i++){
        let link = ch(allAElements[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com" + link;
        // console.log(fullLink);
        match.childFn(fullLink);
    }

}

module.exports.allMatchHandler = allMatchHandler;

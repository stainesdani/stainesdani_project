let fs = require("fs");

// npm modules

let request = require("request");
let cheerio = require("cheerio");

// to import a function from another js file
// from allMatch.js to import processMatch
let allMatch = require("./allMatch.js");

let url = "https://www.espncricinfo.com/series/_/id/8048/season/2019/indian-premier-league";

// requset module will request for the page from cricinfo

request(url, cb);

console.log("Before reading");

function cb(err, header, body){

    if(err == null && header.statusCode == 200){
        console.log("Received resp");
        // function call
        // processAllMatch(body);
        parseHtml(body);
    }
    else if(header.statusCode == 404){
        console.log("404 wrong url");
    }
    else{
        console.log(err);
        console.log(header.statusCode);
    }
}

console.log("After reading");

// cheerio to parse the html file 
function parseHtml(htmlFile){
    // parse the file using cheerio
    // extracts the data
    // function call to allMatch.js

    let ch = cheerio.load(htmlFile);

    let aTag_viewAllMatch = ch("a[data-hover='View All Results']");
    let linkToViewAllMatch = aTag_viewAllMatch.attr("href");
    let fullLinkToViewAllMatch = "https://www.espncricinfo.com" + linkToViewAllMatch;
    // function call to allMatch.js
    allMatch.allMatchHandler(fullLinkToViewAllMatch);
}

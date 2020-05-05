
var exec = require('child_process').exec,
child;
child = exec("node ./server/crawler/crawler.js https://www.yna.co.kr/sports/all", function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});
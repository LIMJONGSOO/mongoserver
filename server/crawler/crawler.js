const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get(process.argv[2]);
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    let ogDatas = '';
    const $ = cheerio.load(html.data);
    const $bodyList = $("meta");

    $bodyList.each(function(i, elem) {
        if(String($(this).attr('property')) === 'og:title') {
            ogDatas += '<og>title:' + String($(this).attr('content'));
        } else if(String($(this).attr('property')) === 'og:description') {
            ogDatas += '<og>description:' + String($(this).attr('content'));
        } else if(String($(this).attr('property')) === 'og:image') {
            ogDatas += '<og>image:' + String($(this).attr('content'));
        }
    });

    return ogDatas;
  })
  .then(res => log(res));
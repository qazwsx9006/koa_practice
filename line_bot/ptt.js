const BASE_URL = 'https://www.ptt.cc';
const cheerio = require("cheerio");
const request_promise = require('request-promise');
const jar = request_promise.jar();
const cookie = request_promise.cookie('over18=1');
jar.setCookie(cookie, 'https://www.ptt.cc');
const request = request_promise.defaults({ jar: jar });

async function getArticles(board){
  board = formatBoard(board)
  let target_link = `${BASE_URL}/bbs/${board}/index.html`;
  try{
    var html_body = await request.get(target_link)
  }catch(e){
    return undefined;
  }
  let $ = cheerio.load(html_body);
  let prev_url = $('#action-bar-container > div > div.btn-group.btn-group-paging > a:nth-child(2)').attr('href');
  let articles = []

  $('#main-container > div.r-list-container.bbs-screen > div').each(function (i, element) {
    let $elem = $(element);
    if($elem.hasClass('r-list-sep')) return false;

    let url = $elem.children('div.title').children('a').attr('href');
    if (!url) {
      console.log('no article url found, skip!');
      return;
    }

    let push = $elem.children('div.nrec').text();
    if (push === '') {
      push = 0;
    } else if (push === '爆') {
      push = 100;
    } else if (push[0] === 'X') {
      push = -(+push.substr(1, 1));
    } else {
      push = +push;
    }

    let row = {
      title: $elem.children('div.title').children('a').text().trim(),
      date: $elem.children('div.meta').children('div.date').text().trim(),
      author: $elem.children('div.meta').children('div.author').text().trim(),
      push: push,
      url: BASE_URL + url,
    };

    if (row.title === '') {
      console.log('title empty, skip!');
      return;
    }
    row.date_time = Date.parse(new Date().getFullYear() + '/' + row.date);

    articles.push(row);
  });

  // return Promise.resolve({articles: articles, prev_url: prev_url})
  return {articles: articles, prev_url: prev_url}
}

function formatBoard(board){
  switch(board){
    case '八卦':
      return 'Gossiping';
      break;
    case '省錢':
      return 'Lifeismoney';
      break;
    case '笨':
      return 'StupidClown';
      break;
    case '笑話':
      return 'joke';
      break;
    default:
      return board
  }
}

module.exports = getArticles;

// async function tryPtt(){
//   r = await getArticles('gossiping');
//   console.log(r)
// }
// tryPtt();

// r = getArticles('gossiping');
// r.then(function(e){
//   console.log(e)
// })

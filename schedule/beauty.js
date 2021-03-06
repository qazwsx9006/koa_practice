const BASE_URL = 'https://www.ptt.cc';
const cheerio = require("cheerio");
const request_promise = require('request-promise');
const jar = request_promise.jar();
const cookie = request_promise.cookie('over18=1');
jar.setCookie(cookie, 'https://www.ptt.cc');
const request = request_promise.defaults({ jar: jar });
const request_image = require('request');

const fs = require('fs');
const db = require('../models');
const Photo = db.Photo;

const gm = require('gm');
const imageMagick = gm.subClass({imageMagick: true});

async function getBeauties(target_url){
  console.log(target_url);
  try{
    var html_body = await request.get(target_url)
  }catch(e){
    return undefined;
  }
  let $ = cheerio.load(html_body);
  let prev_url = $('#action-bar-container > div > div.btn-group.btn-group-paging > a:nth-child(2)').attr('href');
  let articles = []
  // 判斷是否要繼續往前一頁抓資料
  let d = getYesterdaysDate();
  let target_date = formatPttDate(d);
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

    if(push < 30 || isNaN(push)) return ;

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
    if(parseInt(row.date.replace("/", "")) < target_date){
      prev_url = undefined;
    }
    if (parseInt(row.date.replace("/", "")) != target_date){
      return
    }
    row.date_time = Date.parse(new Date().getFullYear() + '/' + row.date);

    articles.push(row);
  });

  // return Promise.resolve({articles: articles, prev_url: prev_url})
  console.log('prev_url', prev_url)
  return {articles: articles, prev_url: prev_url}
}


async function getArticle(target_url){
  try{
    var html_body = await request.get(target_url)
  }catch(e){
    return undefined;
  }
  let $ = cheerio.load(html_body);
  let image_urls = []
  $('a').each((i,elem) => {
    let $elem = $(elem);
    let href = $elem.attr('href');
    let match = href.match(/(^https?\:\/\/.*\.(?:jpg|png|gif|jpeg)$)/i);
    if(match){
      image_urls.push(match[0]);
    };
  })

  return image_urls;
}

async function downloadBeauty(target_url, loop_count){
  var ptt_beauty = await getBeauties(target_url);
  let articles = ptt_beauty.articles;
  let d = getYesterdaysDate();
  let folder_name = `./public/images/${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`;
  createFolder(folder_name)

  if(!loop_count){
    loop_count = 0;
  }
// articles 也要用 callback next方式完成
  articlesImages(articles, loop_count, folder_name, (loop_count) => {
    if(ptt_beauty.prev_url){
      downloadBeauty(`${BASE_URL}${ptt_beauty.prev_url}`, loop_count)
    }else{
      console.log('finished')
    };
  })

}

async function articlesImages(articles, loop_count, folder_name, __callback){
  if(articles.length < 1){
    __callback(loop_count);
    return
  }
  let target_folder = `${folder_name}/${loop_count}`
  let article = articles.pop();

  let image_urls = await getArticle(article.url)
  if(image_urls.length < 1){
    articlesImages(articles, loop_count, folder_name, __callback)
  }else{
    createFolder(target_folder, (folder) => {
      fs.writeFileSync(`${folder}/_info.txt`, JSON.stringify(article, null, 2))
    });
    downloadImage(image_urls, target_folder, (e) => {
      loop_count += 1
      articlesImages(articles, loop_count, folder_name, __callback)
    })
  };
}

function downloadImage(image_urls, target_folder, _callback){
  let image_url = image_urls.pop();
  let filename = image_url.substring(image_url.lastIndexOf('/')+1).replace(/((\?|#).*)?$/,'');
  let db_path = target_folder.replace("./public/","");

  request_image.get({url: image_url, encoding: 'binary'}, (err,res) => {
    if(res.statusCode){
      fs.writeFileSync(`${target_folder}/${filename}`, res.body, 'binary')
      imageMagick(`${target_folder}/${filename}`)
      .resize(240,240, '>')
      .write(`${target_folder}/preview_${filename}`, (e) => {
        if (!err){
          Photo.create({
              name: filename,
              path: `${db_path}/${filename}`,
              previewPath: `${db_path}/preview_${filename}`,
              label: 'ptt_beauty'
          }).then((e) => {
            if(image_urls.length > 0){
              downloadImage(image_urls, target_folder, _callback);
            }else{
              _callback();
            }
          })
        }
      });
      // console.log(`download: ${target_folder}/${filename}`)
    }else{
      // console.log(`failed download: ${target_folder}/${filename}`)
    };
  })
}

function createFolder(path, __callback){
  fs.stat(path, function (err, stats){
    if (err) {
      // Directory doesn't exist or something.
      console.log('Folder doesn\'t exist, so I made the folder :' + path);
      let r = fs.mkdirSync(path, 0755)
      if(__callback){
        __callback(path);
      }
      return r
    }
    if (!stats.isDirectory()) {
      // This isn't a directory!
      console.log('temp is not a directory!');
      // callback(new Error('temp is not a directory!'));
    } else {
      console.log('Does exist');
    }
  });
}

function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate()-1);
    return date;
}

function formatPttDate(_date){
  let month = _date.getMonth()+1;
  let date = _date.getDate();
  if(date <= 9){
    date = '0'+date
  }
  return parseInt(`${month}${date}`)
}

// let default_url = `${BASE_URL}/bbs/beauty/index.html`
// downloadBeauty(default_url);

module.exports = downloadBeauty;
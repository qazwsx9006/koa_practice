const BASE_URL = 'https://www.ptt.cc';
const request_image = require('request');

const fs = require('fs');
const db = require('../models');
const Photo = db.Photo;

const gm = require('gm');
const imageMagick = gm.subClass({imageMagick: true});

const imgs = require('../1101_fb_beauty.json');

function getBeauties(file_path){
  let d = getYesterdaysDate();
  let folder_name = `./public/images_fb/${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`;
  createFolder(folder_name)


  var imgs_arr = []
  for(file_name in imgs){
    let _imgs = imgs[file_name]
    for(i in _imgs){
      img = _imgs[i]
      imgs_arr.push({file_name: file_name, img_url: img})
    }
  }

  downloadImage(imgs_arr, folder_name, (e) => {
    console.log('finished')
  })

}
function downloadImage(imgs_arr, target_folder, _callback){
  let img_obj = imgs_arr.pop();
  let image_url = img_obj['img_url']
  let filename = img_obj['file_name']
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
              label: 'fb_beauty'
          }).then((e) => {
            if(imgs_arr.length > 0){
              downloadImage(imgs_arr, target_folder, _callback);
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

// module.exports = downloadBeauty;
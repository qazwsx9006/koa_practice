const request_promise = require('request-promise');
const fs = require('fs');
const http = require('https');
const path = require('path');
const ntp_bus_routes_url = 'http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-002503-001'
const ntp_bus_info_url = 'http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-002502-001'

const gunzip = require('gunzip-file')
const tp_bus_routes_url = 'https://tcgbusfs.blob.core.windows.net/blobbus/GetRoute.gz'
const tp_bus_info_url = 'https://tcgbusfs.blob.core.windows.net/blobbus/GetStop.gz'

async function fetchNewTaipeiBus(){
  var ntp_bus_routes_result = await getNTPFullData(ntp_bus_routes_url);
  fs.writeFile(path.resolve(__dirname, 'busStopNtp.json'), JSON.stringify(ntp_bus_routes_result), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });

  var bus_infos = await getNTPFullData(ntp_bus_info_url);
  fs.writeFile(path.resolve(__dirname, 'busRouteNtp.json'), JSON.stringify(bus_infos), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
}

async function getNTPFullData(url){
  let data = [];
  let skip = 0;
  let limit = 2000;
  var ntp_bus_routes = await request_promise.get(`${url}?offset=${skip}&limit=${limit}`);
  var ntp_bus_routes_get = JSON.parse(ntp_bus_routes)
  while(ntp_bus_routes_get.success){
    console.log(skip)
    data = data.concat(ntp_bus_routes_get.result.records)
    skip += limit;
    ntp_bus_routes = await request_promise.get(`${url}?offset=${skip}&limit=${limit}`);
    ntp_bus_routes_get = JSON.parse(ntp_bus_routes);
  }
  return data
}
// getNTPFullData(ntp_bus_routes_url);
fetchNewTaipeiBus();


async function fetchTaipeiBus(tmp_arr){
  if(tmp_arr.length < 1) return ;
  let tmp_item = tmp_arr.pop();
  let tmp_name = tmp_item.name;
  let tmp_url = tmp_item.url;
  let pt = path.resolve(__dirname, `${tmp_name}.gz`)
  var file = fs.createWriteStream(pt);
  var request = http.get(tmp_url, function(response) {
    response.pipe(file).on('finish', (e) => {
      gunzip(pt, path.resolve(__dirname, `${tmp_name}.json`), () => {
        console.log('gunzip done!');
        fetchTaipeiBus(tmp_arr)
      })
    });
  });

}
let tmp_arr = [{url: tp_bus_info_url, name: 'GetStop'},{url: tp_bus_routes_url, name: 'GetRoute'}]
fetchTaipeiBus(tmp_arr);
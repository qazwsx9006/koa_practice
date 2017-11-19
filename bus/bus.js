const cheerio = require("cheerio");
const request_promise = require('request-promise');
const tp_bus_route = require('./GetRoute.json');
const ntp_bus_route = require('./busRouteNtp.json');
const tp_bus_stop = require('./GetStop.json');
const ntp_bus_stop = require('./busStopNtp.json');

const bus_time_tp_url = 'http://www.e-bus.taipei.gov.tw/newmap/Js/RouteInfo'
const bus_time_ntp_url = 'http://routes.5284.com.tw/ntpcebus/Js/RouteInfo'

Array.prototype.groupBy = function(prop) {
  return this.reduce(function(groups, item) {
    var val = item[prop];
    groups[val] = groups[val] || {};
    groups[val][item.goBack] = groups[val][item.goBack] || []
    groups[val][item.goBack].push(item);
    groups[val][item.goBack].sort((a, b)=>{
      return parseInt(a['seqNo']) - parseInt(b['seqNo']);
    })
    return groups;
  }, {});
}

function getBusStop(busId){
  var ntp_bus_stops = ntp_bus_stop.groupBy('routeId')
  var tp_bus_stops = tp_bus_stop.BusInfo.groupBy('routeId')
  let result = tp_bus_stops[busId];
  if(!result){
    result = ntp_bus_stops[busId]
  }
  return result
}
// getBusStop(10874)

// Id :站牌代碼
// routeId:所屬路線代碼(主路線ID)
// nameZh:中文名稱
// nameEn:英文名稱
// seqNo:於路線上的順序
// pgp:上下車站別（-1：可下車 ,0：可上下車, 1：可上車）
// goBack:去返程（0：去程/ 1：返程 / 2：未知）
// longitude:經度
// latitude:緯度
// address:地址 stopLocationId:站位ID
// showLon:顯示用經度
// showLat:顯示用緯度
// vector:向量(0~359，預設為空白)


function getBusRoute(busName){
  var ntp_bus_routes = ntp_bus_route
  var tp_bus_routes = tp_bus_route.BusInfo

  let r = tp_bus_routes.find((elem, index, array) => {
    return elem['nameZh'] == busName;
  })
  if(!r){
    r = ntp_bus_routes.find((elem, index, array) => {
      return elem['nameZh'] == busName;
    })
  }
  return r;
}
// getBusRoute('277')

// Id:路線代碼
// providerId:業者代碼
// providerName:業者中文名稱
// nameZh:中文名稱
// nameEn:英文名稱
// pathAttributeId:所屬附屬路線ID
// pathAttributeName:所屬附屬路線中文名
// pathAttributeEname :所屬附屬路線英文名稱
// buildPeriod:建置時間，分為
// 1：1 期
// 2：2 期
// 3：3 期
// 9：非動態資料
// 10：北縣
// departureZh: '去程第 1 站' 起站中文名稱
// departureEn:'去程第 1 站' 起站英文名稱
// destinationZh:'回程第 1 站' 訖站中文名稱
// destinationEn:'回程第 1 站' 訖站英文名稱
// realSequence:核定總班次
// distance 總往返里程(公里/全程)
// goFirstBusTime:站牌顯示時使用，去程第一班發車時間(hhmm)
// backFirstBusTime:站牌顯示時使用，回程第一班發車時間(hhmm)
// goLastBusTime:站牌顯示時使用，去程最後一班發車時間(hhmm)
// backLastBusTime 站牌顯示時使用，回程最後一班發車時間(hhmm)
// peakHeadway:站牌顯示時使用，尖峰時段發車間隔(hhmm OR mm)
// offPeakHeadway :站牌顯示時使用，離峰時段發車間隔(hhmm OR mm)
// busTimeDesc:平日頭末班描述
// holidayGoFirstBusTime:假日站牌顯示時使用，去程第一班發車時間(HHmm)
// holidayBackFirstBusTime:假日站牌顯示時使用，回程第一班發車時間(HHmm)
// holidayGoLastBusTime:假日站牌顯示時使用，去程最後一班發車時間(HHmm)
// holidayBackLastBusTime:假日站牌顯示時使用，回程最後一班發車時間(HHmm)
// holidayBusTimeDesc:假日頭末班描述
// headwayDesc:平日發車間距描述
// holidayPeakHeadway:假日站牌顯示時使用，尖峰時段發車間隔(mmmm OR mm)
// holidayOffPeakHeadway:假日站牌顯示時使用，離峰時段發車間隔(mmmm OR mm)
// holidayHeadwayDesc:假日發車間距描述
// segmentBufferZh:分段緩衝區(中文)
// segmentBufferEn:分段緩衝區(英文)
// ticketPriceDescriptionZh:票價描述(中文)
// ticketPriceDescriptionEn:票價描述(英文)

async function askBus(busName, goBack){
  goBack = goBack || 0;
  let bus = getBusRoute(busName);
  let bus_stop = getBusStop(bus.Id);
  let bus_target_route = bus_stop[goBack.toString()];
  let bus_time_url = bus_time_tp_url;
  if(parseInt(bus.buildPeriod) == 10){
    bus_time_url = bus_time_ntp_url;
  }
  let bus_times = await request_promise.get(`${bus_time_url}?rid=${bus.Id}&sec=${goBack}`);
  bus_times = JSON.parse(bus_times)
  let bus_stop_times = []
  for(i in bus_stop[goBack]){
    if(i == 'groupBy'){
      continue;
    }
    let stop = bus_stop[goBack][i]
    let stop_t = bus_times['Etas'][i]
    if(stop_t.eta > 200){
      bus_stop_times.push(`${stop.nameZh}: 未發車`)
    }else{
      bus_stop_times.push(`${stop.nameZh}: ${stop_t.eta}分鐘`)
    }
  }
  let title = `${bus.departureZh} -> ${bus.destinationZh}`
  if(goBack == 1){
    title = `${bus.destinationZh} -> ${bus.departureZh}`
  }
  // console.log(`[${title}]\n${bus_stop_times.join("\n")}`)
  return {title: title, bus_stop_times: bus_stop_times}
}

// askBus('277', 0)
module.exports = askBus;
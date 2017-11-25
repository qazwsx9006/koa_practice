const request = require("request-promise");
const apiUrl = 'http://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=rdec-key-123-45678-011121314&locationName=';
const querystring = require('querystring');

async function getWeather(placeName){
  let target_url = `${apiUrl}${querystring.escape(placeName)}`
  body = await request.get(target_url)
  let info = JSON.parse(body)
  let weather_infos = (info.records.location[0].weatherElement)
  let weather_format = [];
  for(var index in weather_infos){
    let elem = weather_infos[index];
    for( var _i in elem.time){
      let _elem = elem.time[_i]

    if(!weather_format[_i]) weather_format[_i] = _elem.startTime + ' ~ '+ _elem.endTime;
      weather_format[_i] += ` ${convertUnit(elem.elementName, _elem.parameter)}`;
    }
  }
  return weather_format;
}

function convertUnit(elemName, parameter){
  if(!parameter)return;
  switch(elemName){
    case 'Wx':
      return `${parameter.parameterName}`;
      break;
    case 'PoP':
      return `降雨機率：${parameter.parameterName}%`;
      break;
    case 'MinT':
      return `最低溫：${parameter.parameterName}°C`;
      break;
    case 'CI':
      return `${parameter.parameterName}`;
      break;
    case 'MaxT':
      return `最低溫：${parameter.parameterName}°C`;
      break;
    default:
      return ""
  }
}

module.exports = getWeather;
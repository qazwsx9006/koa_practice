const request = require("request-promise");
const cheerio = require("cheerio");
const config = require('../config/config');
const astrologyDomatn = config.AstrologyUrl;

async function getAstrology(astrology){
  astrology = convertAstrology(astrology)
  let target_url = `${astrologyDomatn}${astrology}`
  let body = await request.get(target_url);
  let $ = cheerio.load(body, {
    ignoreWhitespace: true
  });
  let $main_content = $('#profile .user-zodiac');
  let title = $main_content.children('h2').text().trim().replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ');
  let short_info = $main_content.children('h3').text().trim().replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ');
  let daily_info = $main_content.children('.article').text().trim().replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ');
  return `${title}\n${short_info}\n${daily_info}`;
}

function convertAstrology(astrology){
  switch(astrology.toLowerCase()){
      case '白羊':
      case '牡羊':
      case 'aries':
        return 'Aries'
        break;
      case '獅子':
      case 'leo':
        return 'Leo'
        break;
      case '射手':
      case 'sagittarius':
        return 'Sagittarius'
        break;
      case '水瓶':
      case 'aquarius':
        return 'Aquarius'
        break;
      case '雙子':
      case 'gemini':
        return 'Gemini'
        break;
      case '天秤':
      case 'libra':
        return 'Libra'
        break;
      case '金牛':
      case 'taurus':
        return 'Taurus'
        break;
      case '處女':
      case 'virgo':
        return 'Virgo'
        break;
      case '摩羯':
      case 'capricorn':
        return 'Capricorn'
        break;
      case '巨蟹':
      case 'cancer':
        return 'Cancer'
        break;
      case '天蠍':
      case 'scorpio':
        return 'Scorpio'
        break;
      case '雙魚':
      case 'pisces':
        return 'Pisces'
        break;
      default:
        return 'Aries';
  }
}

module.exports = getAstrology;
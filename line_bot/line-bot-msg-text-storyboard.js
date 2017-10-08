module.exports = {
  Hi:{
    regexp: /^(Hi|嗨|哈囉)$/i,
    reply: {
      type: 'text',
      msg: ['Hello $USER_NAME$~','嗨 $USER_NAME$!', '哈囉']
    }
  },
  callMe:{
    regexp: /^MingyuBot$/i,
    reply: {
      type: 'text',
      msg: "Hi 我是 MingyuBot, 我的指令目前有\n1. Hi,\n2. MingyuBot\n3. Mingyu bye"
    }

  },
  leave:{
    regexp: /^Mingyu bye/i,
    reply: {
      type: 'text',
      msg: "不要叫我走ＱＱ"
    },
    room: {
      reply: {
        type: 'text',
        msg: "ㄅㄅ"
      },
      leave_action: true
    },
    group: {
      reply: {
        type: 'text',
        msg: "可...可惡"
      },
      leave_action: true
    }
  },
  weather:{
    regexp: /^M天氣(宜蘭縣|桃園市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|臺東縣|花蓮縣|澎湖縣|基隆市|新竹市|嘉義市|臺北市|高雄市|新北市|臺中市|臺南市|連江縣|金門縣)?/,
    weather_action: true
  }
}
module.exports = {
  Hi:{
    regexp: /^(Hi|嗨|哈囉|Hello)$/i,
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
  eat:{
    regexp: /^M([早午晚]{1}餐|吃飯|宵夜|食物)/,
    reply: {
      type: 'text',
      msg: ['炸雞','漢堡','煎餃','切仔麵','拉麵','關東煮','水餃','便當','三明治','美式早午餐','西式排餐', '肉包', 'Pizza', '丼飯', '隨便啦！']
    }
  },
  weather:{
    regexp: /^M天氣(宜蘭縣|桃園市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|[臺台]{1}東縣|花蓮縣|澎湖縣|基隆市|新竹市|嘉義市|[臺台]{1}北市|高雄市|新北市|[臺台]{1}中市|[臺台]{1}南市|連江縣|金門縣)?/,
    weather_action: true
  },
  caculator:{
    regexp: /^([\s\d\(\)\*\+\/]{3,})\=?$/,
    caculator_action: true
  }
}
module.exports = {
  Hi:{
    regexp: /^(Hi|嗨|哈囉|Hello)$/i,
    reply: {
      type: 'text',
      text: ['Hello $USER_NAME$~','嗨 $USER_NAME$!', '哈囉']
    }
  },
  callMe:{
    regexp: /^MingyuBot$/i,
    reply: {
      type: 'text',
      text: "Hi 我是 MingyuBot, 我的指令目前有\n1. Hi,\n2. MingyuBot\n3. Mingyu bye\n4. M天氣\n5, M吃飯\n6. M運勢"
    }

  },
  leave:{
    regexp: /^Mingyu bye/i,
    reply: {
      type: 'text',
      text: "不要叫我走ＱＱ"
    },
    room: {
      reply: {
        type: 'text',
        text: "ㄅㄅ"
      },
      leave_action: true
    },
    group: {
      reply: {
        type: 'text',
        text: "可...可惡"
      },
      leave_action: true
    }
  },
  eat:{
    regexp: /^M([早午晚]{1}餐|吃飯|宵夜|食物)/,
    reply: {
      type: 'text',
      text: ['炸雞','漢堡','煎餃','切仔麵','拉麵','關東煮','水餃','便當','三明治','美式早午餐','西式排餐', '肉包', 'Pizza', '丼飯', '隨便啦！']
    }
  },
  weather:{
    regexp: /^M天氣(宜蘭縣|桃園市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|[臺台]{1}東縣|花蓮縣|澎湖縣|基隆市|新竹市|嘉義市|[臺台]{1}北市|高雄市|新北市|[臺台]{1}中市|[臺台]{1}南市|連江縣|金門縣)?/,
    weather_action: true
  },
  caculator:{
    regexp: /^([\.\s\d\(\)\*\+\-\/]{3,})\=?$/,
    caculator_action: true
  },
  thx:{
    regexp: /^(THX|Thank[s]+|謝{2,})/i,
    reply: {
      type: 'sticker',
      packageId: 1,
      stickerId: 14
    }
  },
  lucky:{
    regexp: /^M(運勢)/i,
    reply: {
      type: 'sticker',
      packageId: 1,
      stickerId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 401, 402, 403, 404, 405, 406]
    }
  },
  test_t_btns:{
    regexp: /^M按鈕/,
    reply:{
      type: 'template',
      altText: '按鈕 template',
      template: {
        type: 'buttons',
        title: 'Menu',
        text: '請選擇',
        actions: [
          {
            type: 'postback',
            label: '買鞋子',
            data: 'action=buy&itemid=123'
          },
          {
            type: 'postback',
            label: '買衣服',
            data: 'action=buy&itemid=999'
          },
          {
            type: 'uri',
            label: '推薦貼圖巨人雞腳',
            data: 'https://store.line.me/stickershop/product/1510246/zh-Hant'
          }
        ]
      }
    }
  }
}


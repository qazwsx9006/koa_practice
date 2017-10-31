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
  astrology:{
    regexp: /^M(白羊|牡羊|獅子|射手|水瓶|雙子|天秤|金牛|處女|摩羯|巨蟹|天蠍|雙魚|aries|leo|sagittarius|aquarius|gemini|libra|taurus|virgo|capricorn|cancer|scorpio|pisces){1}座?/i,
    astrology_action: true
  },
  ptt:{
    regexp: /^PTT\s{0,}([\u4e00-\u9fa5_a-z0-9]+)/i,
    ptt_action: true
  },
  test_t_btns:{
    regexp: /^M按鈕/,
    reply:{
      type: 'template',
      altText: 'Mingyu商店',
      template: {
        type: 'buttons',
        title: 'Mingyu 商店',
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
            uri: 'https://store.line.me/stickershop/product/1510246/zh-Hant'
          }
        ]
      }
    }
  },
  test_datetime_picker:{
    regexp: /^M日期/,
    reply:{
      type: 'template',
      altText: 'Mingyu日期',
      template: {
        type: 'buttons',
        title: 'Mingyu 日期',
        text: '請選擇',
        actions: [
          {
            type: 'datetimepicker',
            label: 'picker',
            data: 'schdeule=2017&notify=true',
            mode: 'datetime',
            initial: '2017-10-28T06:15',
            max: '2017-12-18T14:15',
            min: '2017-10-01T06:15'
          }
        ]
      }
    }
  },
  test_t_confirm:{
    regexp: /^M是否/,
    reply:{
      type: 'template',
      altText: '我帥不帥',
      template: {
        type: 'confirm',
        text: '我帥不帥，告訴我吧！',
        actions: [
          {
            type: "message",
            label: "Yes",
            text: "是"
          },
          {
            type: "message",
            label: "No",
            text: "否"
          },
        ]
      }
    }
  },
  test_location:{
    regexp: /^M位置/i,
    reply: {
      type: 'location',
      title: 'my location!!',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203
    }
  },

  learn_word:{
    regexp: /^MY\s*;([^;]+);(.+)/i,
    group: {
      learn_word_action: true
    },
    room: {
      learn_word_action: true
    }
  },
  ptt_beauty:{
    regexp: /^M表特$/i,
    ptt_beauty_actions: true
  },
  dcard:{
    regexp: /^M西施$/i,
    dcard_actions: true
  },
  test_gods:{
    regexp: /^M神人/,
    reply:{
      type: 'template',
      altText: '神人們介紹',
      template: {
        type: 'buttons',
        title: '神人們介紹',
        text: '你想認識哪位神人呢？',
        actions: [
          {
            type: 'message',
            label: 'Boss',
            text: 'Boss'
          },
          {
            type: 'message',
            label: '林賢中出',
            text: '中出'
          },
          {
            type: 'message',
            label: '悄悄神',
            text: '靜悄悄'
          }
        ]
      }
    }
  }
}


module.exports = {
  Hi:{
    regexp: /^(Hi|嗨|哈囉)$/i,
    reply: {
      type: 'text',
      msg: ['Hello','嗨', '哈囉']
    }
  },
  callMe:{
    regexp: /^MingyuBot$/i,
    reply: {
      type: 'text',
      msg: "Hi 我是 MingyuBot, 我的指令目前有\n 1. Hi, 2. MingyuBot 3. Mingyu bye"
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
  }
}
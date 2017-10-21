const line = require('@line/bot-sdk');
const config = require('../config/config');
const client = new line.Client(config.Line);
const db = require('../models');
const User = db.User;

// story
const storyboard = require('./line-bot-msg-text-storyboard');
const sticker_storyboard = require('./line-bot-sticker-storyboard');

// weather
const weather_info = require('./weather');
// astrology
const astrology_fetch = require('./astrology');
// ptt
const ptt_articles = require('./ptt');
// learn_word
const learn_word = require('./learn_word');

class LineAction {
  constructor(event) {
    // event example (https://devdocs.line.me/en/#webhook-event-object)
    // {
    //   "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
    //   "type": "message",
    //   "timestamp": 1462629479859,
    //   "source": {
    //     "type": "user",
    //     "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
    //   },
    //   "message": {
    //     "id": "325708",
    //     "type": "text",
    //     "text": "Hello, world"
    //   }
    // }
    if (!event) {
      throw new Error("no event pass.");
    }

    if(event.source.userId){
      // record userid
      this.recordUserInfo(event.source.userId);
    }
    this.event = event;
  }

  eventTypeAction() {
    let event = this.event;
    let event_type = event.type;

    switch(event_type){
      case 'message':
        var message = event.message;
        // 文字訊息
        if(message.type === 'text'){
          this.textMessage(event)
        }else if(message.type === 'image'){

        }else if(message.type === 'video'){

        }else if(message.type === 'audio'){

        }else if(message.type === 'file'){

        }else if(message.type === 'location'){

        }else if(message.type === 'sticker'){
          // 基本貼圖對應表 https://devdocs.line.me/files/sticker_list.pdf
          this.stickerMessage(event)
        }
        break;
      case 'follow':
        console.log(JSON.stringify(event));
        console.log("==========> event type: follow trigger");
        break;
      case 'unfollow':
        console.log(JSON.stringify(event));
        console.log("==========> event type: unfollow trigger");
        break;
      case 'join':
        console.log(JSON.stringify(event));
        console.log("==========> event type: join trigger");
        break;
      case 'leave':
        console.log(JSON.stringify(event));
        console.log("==========> event type: leave trigger");
        break;
      case 'postback':
        console.log(JSON.stringify(event));

        client.replyMessage(this.event.replyToken, {
          type: 'text',
          text: '缺貨中'
        });

        console.log("==========> event type: postback trigger");
        break;
      case 'beacon':
        console.log(JSON.stringify(event));
        console.log("==========> event type: beacon trigger");
        break;
      default:
        throw new Error("illegal event type.");
    }

  }


  // 收到 貼圖回應
  async stickerMessage(){
    let event = this.event;
    let message = event.message;
    let packageId = message.packageId.toString();
    let stickerId = message.stickerId.toString();
    let source_type = event.source.type;

    let actions = sticker_storyboard[packageId][stickerId];
    if(actions && actions.reply) this.replyMessage(actions.reply);
  }

  // 預計拆出來
  async textMessage(){
    let event = this.event;
    let message = event.message;
    let msg_txt = message.text.trim();
    let source_type = event.source.type;
    var cmd_msg = false;
    for(var key in storyboard) {
      let actions = storyboard[key];
      if(msg_txt.match(actions.regexp)){
        cmd_msg = true;
        // room
        if(source_type === 'room' && actions.room){
          if(actions.room.learn_word_action){
            let r_id = event.source.roomId;
            let keyword = msg_txt.match(actions.regexp)[1].trim();
            let reply = msg_txt.match(actions.regexp)[2].trim();
            this.myLearnWord(r_id, keyword, reply, 'room')
            break;
          }
          await this.replyMessage(actions.room.reply)
          if(actions.room.leave_action) client.leaveRoom(event.source.roomId);
          break;
        }

        // group
        if(source_type === 'group' && actions.group){
          if(actions.group.learn_word_action){
            let g_id = event.source.groupId;
            let keyword = msg_txt.match(actions.regexp)[1].trim();
            let reply = msg_txt.match(actions.regexp)[2].trim();
            this.myLearnWord(g_id, keyword, reply, 'group')
            break;
          }
          await this.replyMessage(actions.group.reply)
          if(actions.group.leave_action) client.leaveGroup(event.source.groupId);
          break;
        }


        if(actions.reply) this.replyMessage(actions.reply);

        // weather
        if(actions.weather_action){
          let location = msg_txt.match(actions.regexp)[1];
          if(location){
            this.replyWeather(location)
          }else{
            client.replyMessage(this.event.replyToken, {
              type: 'text',
              text: '格式不符 => M天氣臺北市 , M天氣新北市....'
            });
          }
        }
        // weather

        // caculator
        if(actions.caculator_action){
          let expression = msg_txt.match(actions.regexp)[1].trim();

          try{
            let answer = eval(expression);
            client.replyMessage(this.event.replyToken, {
              type: 'text',
              text: `${expression} = ${answer}`
            });
          } catch(e){
            client.replyMessage(this.event.replyToken, {
              type: 'text',
              text: '運算格式有問題喔！'
            });
          }
          if(expression){
          }
        }
        // caculator

        // astrology
        if(actions.astrology_action){
          let astrology = msg_txt.match(actions.regexp)[1].trim();
          if(astrology){
            this.replyAstrology(astrology)
          }else{
            client.replyMessage(this.event.replyToken, {
              type: 'text',
              text: '格式不符 => M牡羊....'
            });
          }

        }
        // astrology

        // ptt
        if(actions.ptt_action){
          let board = msg_txt.match(actions.regexp)[1].trim();
          if(board){
            this.replyPtt(board)
          }else{
            client.replyMessage(this.event.replyToken, {
              type: 'text',
              text: `找不到 ${board} 相關資訊`
            });
          }

        }
        // ptt

        // 表特
        if(actions.ptt_beauty_actions){
          client.replyMessage(this.event.replyToken, {
            type: 'image',
            originalContentUrl: 'https://mingyu.bonimages.tw/images/20171021/0/nLT8tyk.jpg',
            previewImageUrl: 'https://mingyu.bonimages.tw/images/20171021/0/nLT8tyk.jpg'
          });

        }
        // 表特

        break;
      }
    }

    if(!cmd_msg && source_type === 'room'){
      let r_id = event.source.roomId;
      this.replyLearnWord(r_id, msg_txt.trim(), 'room')
    }
    if(!cmd_msg && source_type === 'group'){
      let g_id = event.source.groupId;
      this.replyLearnWord(g_id, msg_txt.trim(), 'group')
    }
  }


  async replyMessage(reply){
    reply = Object.assign({}, reply);
    // text message
    if(reply.text && Array.isArray(reply.text)){
      let text =  reply.text[Math.floor(Math.random() * reply.text.length)];
      reply.text = await this.replaceKeyword(text);
    }

    // sticker message
    if(reply.packageId && Array.isArray(reply.packageId)){
      reply.packageId = reply.packageId[Math.floor(Math.random() * reply.packageId.length)];
    }
    if(reply.stickerId && Array.isArray(reply.stickerId)){
      reply.stickerId = reply.stickerId[Math.floor(Math.random() * reply.stickerId.length)];
    }

    client.replyMessage(this.event.replyToken, reply);
  }

  async replaceKeyword(text){
    var text = text;

    if(text.indexOf('$USER_NAME$') >= 0 ){
      let profile = await this.getProfile(this.event);
      // profile = {
      //   userId: 'xxxxx',
      //   displayName: 'mingyu',
      //   pictureUrl: 'http://wwww.www',
      //   statusMessage: 'status xxx'
      // }
      let name = profile.displayName || '';
      if(name.length > 0){
        this.updateUserName(this.event.source.userId, name)
      }

      text = text.replace(/\$USER_NAME\$/g, name)
    }


    return text;
  }

  // get profile
  async getProfile(){
    let source = this.event.source;
    if(!source.userId) return null;
    try{
      // 須加好友才可以取的profile
      return await client.getProfile(source.userId);
    } catch(e){
      console.log('getProfile Error');
      return {}
    }
  }

  // 預計拆出來

  //mysql record

  async recordUserInfo(userId){
    return await User
      .findOrCreate({where: {userId: userId}})
      .spread((user, created) => {
        return user
        // return user.get({
        //   plain: true
        // })
      })
  }

  async updateUserName(userId, name){
    let user = await this.recordUserInfo(userId)
    return await user.update({name: name})
  }
  //

  // weather

  // test getWeather
  async replyWeather(placeName){
    placeName = placeName.replace('台', '臺')
    let w_info = await weather_info(placeName);
    client.replyMessage(this.event.replyToken, {
      type: 'text',
      text: w_info.join("\n")
    });
  }

  // astrology
  async replyAstrology(astrology){
    let astrology_info = await astrology_fetch(astrology);
    client.replyMessage(this.event.replyToken, {
      type: 'text',
      text: astrology_info
    });
  }

  // ptt
  async replyPtt(board){
    let board_infos = await ptt_articles(board);
    if(!board_infos){
      client.replyMessage(this.event.replyToken, {
        type: 'text',
        text: `找不到PTT ${board} 相關資訊`
      });
      return
    }
    let articles = board_infos.articles
    let articles_string = articles.map(function(elem){
                            return `${elem.push} ${elem.title}\n${elem.date} ${elem.author}\n${elem.url}`
                          }).join("\n\n")
    client.replyMessage(this.event.replyToken, {
      type: 'text',
      text: articles_string
    });
  }


  // learn_word
  async myLearnWord(c_id, keyword, reply, source_type){
    let learnWord;
    if(source_type === 'group'){
      learnWord = await learn_word.learnWordGroup(c_id, keyword, reply);
    }else if(source_type === 'room'){
      learnWord = await learn_word.learnWordRoom(c_id, keyword, reply);
    }
    client.replyMessage(this.event.replyToken, {
      type: 'text',
      text: `好喔，[${learnWord.keyword} => ${learnWord.reply}] 我記住了`
    });
  }

  async replyLearnWord(c_id, keyword, source_type){
    let learnWord;
    if(source_type === 'group'){
      learnWord = await learn_word.getLearnWordReplyGroup(c_id, keyword);
    }else if(source_type === 'room'){
      learnWord = await learn_word.getLearnWordReplyRoom(c_id, keyword);
    }
    if(!learnWord) return;
    client.replyMessage(this.event.replyToken, {
      type: 'text',
      text: learnWord.reply
    });
  }

}

module.exports = LineAction;

//  async function recordUserInfo(userId){
//     return await User
//       .findOrCreate({where: {userId: userId}})
//       .spread((user, created) => {
//         return user
//         // return user.get({
//         //   plain: true
//         // })
//       })
//   }

//   async function tt(){
//     r = await recordUserInfo('abc');
//     // r = await User.findById(3)
//     console.log(r);
//     n = await r.update({name: 'my'})
//     console.log(n);
//   }
// tt();
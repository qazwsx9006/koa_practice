const line = require('@line/bot-sdk');
const config = require('../config/config');
const client = new line.Client(config.Line);
const db = require('../models');
const User = db.User;

// story
const storyboard = require('./line-bot-msg-text-storyboard');

// weather
const weather = require('./weather');

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

        }
        break;
      case 'follow':
        console.log("==========> event type: follow trigger");
        break;
      case 'unfollow':
        console.log("==========> event type: unfollow trigger");
        break;
      case 'join':
        console.log("==========> event type: join trigger");
        break;
      case 'leave':
        console.log("==========> event type: leave trigger");
        break;
      case 'postback':
        console.log("==========> event type: postback trigger");
        break;
      case 'beacon':
        console.log("==========> event type: beacon trigger");
        break;
      default:
        throw new Error("illegal event type.");
    }

  }


  // 預計拆出來
  textMessage(){
    let event = this.event;
    let message = event.message;
    let msg_txt = message.text.trim();
    let source_type = event.source.type;
    for(var key in storyboard) {
      let actions = storyboard[key];
      if(msg_txt.match(actions.regexp)){

        // room
        if(source_type === 'room' && actions.room){
          this.replyMessage(actions.room.reply)
          if(actions.room.leave_action) client.leaveRoom(event.source.roomId);
          break;
        }

        // group
        if(source_type === 'group' && actions.group){
          this.replyMessage(actions.group.reply)
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

        break;
      }
    }
  }


  async replyMessage(reply){
    let text = Array.isArray(reply.msg) ? reply.msg[Math.floor(Math.random() * reply.msg.length)] : reply.msg ;
    let new_text = await this.replaceKeyword(text);

    client.replyMessage(this.event.replyToken, {
      type: reply.type,
      text: new_text
    });
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
    let w_info = await this.getWeather(placeName);
    client.replyMessage(this.event.replyToken, {
      type: 'text',
      text: w_info.join("\n")
    });
  }

  async getWeather(placeName){
    return await weather(placeName);
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
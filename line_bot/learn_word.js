const db = require('./models');
const User = db.User;
const LearnWord = db.LearnWord;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function learnWord(g_id, keyword, reply){
  let learn_word = await LearnWord.findOrCreate({
                      where:{
                        groupId: g_id,
                        keyword: keyword
                      }
                    }).spread((learn_word, created) => {
                      return learn_word
                    });
  learn_word.update({reply: reply});
  return learn_word.get({plain: true})
}

async function getLearnWordReply(g_id, keyword){

  let record = await LearnWord.findOne({
                  where:{
                    groupId: g_id,
                    keyword: keyword
                  }
                })
  return record ? record.get({plain: true}) : null
}
// // 可為null => NULL , 但如果傳送 undefined 則會造成比對不到錯誤。Mysql轉換成NULL
// let r = learnWord(null, 'hey', 'be2').then((r) => {console.log(r)});

// getLearnWordReply(null, 'hey').then((a) => console.log('a', a.reply))
// // LearnWord.destroy({where:{}});

module.exports = {
  learnWord: learnWord,
  getLearnWordReply: getLearnWordReply
};
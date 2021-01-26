const fs = require('fs');
const _ = require('lodash');
const factory = require('./index');
const { convertAudio } = require('./util');
const opt = { appkey: '08f1b8f992d16f7cbcf352d9a2dbecbe', appid: '5dd3aca4', scene: 'main_box', timeout: 10000 };
const act = factory.create(opt);

const id = '7b0bd8a1e1541aa812be6507da55707a';
const voicePath = '/Users/yj431/Downloads/code2.mp3';
const stream = fs.createReadStream(voicePath);



const preces = (rs) => {
  const rt = { match: false };
  if(_.get(rs, 'code') === '0') {
    rt.match = [];
    for(const d of _.get(rs, 'data')) {
      const { intent, sub } = d;
      const item = {};
      if(sub === 'nlp') {
        const { text, rc, semantic } = intent;
        item.text = text;
        if(rc === 0) {
          item.slots = [];
          for(const s of semantic) {
            const { slots } = s;
            item.slots.push(...slots.map(s => _.pick(s, 'name', 'normValue', 'value')));
          }
        } else {

        }
        rt.match.push(item);
      }
    }
  }
  return rt;
}

const rs1 = {
 "data": [
     {
         "sub": "nlp",
         "auth_id": "1402d37870b44313d2746f1179bbb48b",
         "intent": {
             "answer": {
                 "text": "这是一条来自IntentRequest意图的 answer",
                 "type": "T"
             },
             "category": "OS7662350192.aladin",
             "data": {
                 "result": null
             },
             "intentType": "custom",
             "rc": 0,
             "semantic": [
                 {
                     "entrypoint": "ent",
                     "hazard": false,
                     "intent": "order",
                     "score": 1,
                     "slots": [
                         {
                             "begin": 4,
                             "end": 7,
                             "name": "ingood",
                             "normValue": "矿泉水",
                             "value": "矿泉水"
                         }
                     ],
                     "template": "{helpme}来个{ingood}"
                 }
             ],
             "semanticType": 0,
             "service": "OS7662350192.aladin",
             "sessionIsEnd": false,
             "shouldEndSession": true,
             "sid": "ara012cefca@dx0001113ae45b000100",
             "state": null,
             "text": "给我来个矿泉水",
             "uuid": "ara012cefca@dx0001113ae45b000100",
             "vendor": "OS7662350192",
             "version": "5.0",
             "voice_answer": [
                 {
                     "content": "这是一条来自IntentRequest意图的 answer",
                     "type": "TTS"
                 }
             ]
         },
         "result_id": 1
     }
 ],
 "sid": "ara012cefca@dx0001113ae45b000100",
 "code": "0",
 "desc": "success"
};



console.log(JSON.stringify(preces(rs1))); 

// (async () => {
//   // mp3 音频流转换成wav音频流
//   const wavStream = await convertAudio(stream);
//   // 输入 wav音频流 识别
//   const rs = await act.audio(id, wavStream);
//   console.log(rs);
// })();
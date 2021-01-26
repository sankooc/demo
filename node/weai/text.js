

 {
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
}

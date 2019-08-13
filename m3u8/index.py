import os
import hashlib
import resolve
import conv
import json

TMP = './logs'

curl = 'https://wuji.zhulong-zuida.com/20190708/1253_77380dd8/800k/hls/index.m3u8'


# tsurl = 'https://wuji.zhulong-zuida.com/20190708/1253_77380dd8/800k/hls/e530eedb37f000680.ts'

m = hashlib.md5()
m.update(curl.encode("utf-8"))
mjson = m.hexdigest()
list = None
saveFile = '{}/{}.json'.format(TMP, mjson)
if os.path.exists(mjson):
  with open(saveFile) as f:
    dic = json.loads(f.read())
    list = dic['items']
else:
  list = resolve.downM3u8(url=curl, target = './logs', name = '测试', tmp = './logs')
  res = json.dumps({ 'items': list })
  with open(saveFile,'w') as f:
    f.write(res)
print(list)


# conv.download(vname = '测试', url = tsurl, headers = {}, output = './logs/rac.ts');

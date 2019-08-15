import os
import hashlib
import resolve
import conv
import json
import ffmpeg
TMP = 'logs'
curl = 'https://wuji.zhulong-zuida.com/20190708/1253_77380dd8/800k/hls/index.m3u8'
refer = 'http://www.wodedy.net/js/player/mp4.html'


def chunk(vlist, size = 100):
  ll = len(vlist)
  rs = []
  inx = 0
  while True:
    lt = inx + size
    lk = vlist[inx: min(ll, lt)]
    rs.append(lk)
    if lt > ll:
      break
    inx += size
  return rs

m = hashlib.md5()
m.update(curl.encode("utf-8"))
mjson = m.hexdigest()
vlist = None
saveFile = '{}/{}.json'.format(TMP, mjson)
if os.path.exists(saveFile):
  with open(saveFile) as f:
    dic = json.loads(f.read())
    vlist = dic['items']
else:
  vlist = resolve.downM3u8(url=curl, name = 'dmt', tmp = './logs')
  res = json.dumps({ 'items': vlist })
  with open(saveFile,'w') as f:
    f.write(res)
conv.start(refer, vlist)

pst = chunk(vlist)
cinx = 0
mp4s = []
for p in pst:
  ppath = './target/tmp%02d.mp4' %cinx
  ps = list(map(lambda x: x['target'], p))
  ffmpeg.ffmpeg_concat_ts_to_mkv(ps, ppath)
  mp4s.append(ppath)
  cinx += 1

ffmpeg.ffmpeg_concat_mp4_to_mp4(mp4s, 'output.mp4')
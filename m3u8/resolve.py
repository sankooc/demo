# -*- coding:utf-8- -*-
import m3u8
import os

def view (obj):
  print ('\n'.join(['%s:%s' % item for item in obj.__dict__.items()]))
def downM3u8(url, name, tmp):
  m3u8_obj = m3u8.load(url)
  inx = 0
  list = []
  for segment in m3u8_obj.segments:
    _url = segment.base_uri + segment.uri
    _duration = segment.duration
    _target = '%s/%s-%03d.ts' %(tmp, name, inx) 
    inx += 1
    d = { "url": _url, "duration": _duration, "target": _target }
    list.append(d)
  return list
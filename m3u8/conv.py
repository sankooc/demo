import json
import re
import os
import sys
import time
import requests
import threading
from urllib import request, parse, error


def download(vname, url, headers, output):
  print(vname, output)
  if os.path.exists(output):
    return
  _output = output + '.downloading'
  esize = 0
  mode = 'wb'
  if os.path.exists(_output) is True:
    esize = os.path.getsize(_output)
    headers['Range'] = 'bytes=%d-' %esize 
    mode = 'ab'
  r = requests.get(url, stream=True, timeout=30, headers=headers)
  scode = r.status_code
  total = int(r.headers["Content-Length"])
  if scode is 416:
    if esize > 0:
      os.rename(_output, output)
    return
  if (scode is 200) or (scode is 206):
    if total > 0:
      with open(_output, mode) as fd:
        for chunk in r.iter_content(chunk_size=1280):
            fd.write(chunk)
    os.rename(_output, output)


# def _rounding(m, d):
#   videos = d['videos']
#   print(d['main'])
#   cp = datapath + '/' + d['vid']
#   ts = []
#   for index in range(len(videos)):
#     video = videos[index]
#     vpath = cp + '/v' + str(index)
#     if os.path.exists(vpath) is False:
#       os.makedirs(vpath)
#     url = video['url']
#     type = video['type']
#     if type == 'mp4':
#       output = vpath + '/video.mp4'
#       headers = {}
#       headers['Referer'] = 'http://www.wodedy.net/js/player/mp4.html'
#       headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
#       vname = d['vid'] + '#' + str(index)
#       t = threading.Thread(target=download,args=(m, vname, url, headers, output))
#       t.start()
#       ts.append(t)
#   for t in ts:
#     t.join()
  
    
  
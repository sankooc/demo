import json
import re
import os
import sys
import time
import requests
import threading
from urllib import request, parse, error
from queue import Queue
import threading
from urllib import request
import time

queue = Queue()
tsList = []

def download(url, headers, output):
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


def polling(refer):
  tname = threading.current_thread().name
  while True:
    size = queue.qsize()
    if size == 0:
      break
    else:
      item = queue.get()
      # time.sleep(2)
      url = item['url']
      target = item['target']
      if os.path.exists(target):
        continue
      print('thread %s: download %s' % (tname, url))
      headers = {}
      headers['Referer'] = refer
      headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
      download(url = url, headers = headers, output = target)
def start(url, items = []):
  for item in items:
    queue.put(item)
  for _ in range(2):
    t = threading.Thread(target=polling, args=(url,)) 
    t.start()
    time.sleep(1)
    tsList.append(t)
  for t in tsList:
    t.join()
    
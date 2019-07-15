import json
import re
import os
import sys
import time
import requests
import threading
from urllib import request, parse, error

metapath = '/Users/sankooc/repo/forn/data.json';
datapath = '/Users/sankooc/forndata'
def get_terminal_size():
    """Get (width, height) of the current terminal."""
    try:
        import fcntl, termios, struct # fcntl module only available on Unix
        return struct.unpack('hh', fcntl.ioctl(1, termios.TIOCGWINSZ, '1234'))
    except:
        return (40, 80)

class PiecesProgressBar:
    def __init__(self, name, total_size, total_pieces=1):
        self.name = name
        self.displayed = False
        self.total_size = total_size
        self.total_pieces = total_pieces
        self.current_piece = 1
        self.received = 0
        self.last = time.time()
        self.last_size = 0
        self.speed = 0
    def update(self):
        self.displayed = True
        pet = round(self.received * 100 / self.total_size)
        bar = ('[' + self.name + '{0:>5}% {1:.2f}/{2:.2f}MB {3:.2f}KB/s]').format(pet, (self.received/ 1024 ** 2), (self.total_size/ 1024 ** 2), (self.speed/ 1024 ** 2))
        return bar
    def set_received(self, n):
        self.received = n

    def update_received(self, n):
        self.received += n
        if n > 0:
          time_diff = time.time() - self.last
          self.speed = n / time_diff
          self.last = time.time()
        self.update()

    def update_piece(self, n):
        self.current_piece = n

    def done(self):
        if self.displayed:
            self.displayed = False
class Monitor:
  def __init__(self):
    self.tasks = []
  def add(self, task):
    self.tasks.append(task)
  def update(self):
    str = ''
    for task in self.tasks:
      if task.displayed is True:
        str += task.update()
    sys.stdout.write('\r' + str)
    sys.stdout.flush()

def parseVid(main):
  reg = r"show"
  rc = re.search(r'\/show\/(\w+)\.', main)
  return rc.group(1)
  
# with open(metapath,'r') as f:
#     data = json.load(f)
#     for d in data:
#       vid = parseVid(d['main'])
#       d['vid'] = vid
#     file = open(metapath,'w',encoding='utf-8')
#     json.dump(data, file)


def _down(d):
  main = d['main']
  cp = datapath + '/' + d['vid']
  img = d['img']
  tmp_headers={}
  tmp_headers['Referer'] = main
  req = request.Request(img, headers=tmp_headers)
  response = request.urlopen(req)
  size = response.headers['content-length']
  buffer = response.read(int(size))
  output = open(cp + '/icon.jpg', 'wb')
  output.write(buffer)

def download(m, vname, url, headers, output):
  if os.path.exists(output):
    # print('out')
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
  # if r.headers['Content-Type'] != accept:
  #   return
  if scode is 416:
    if esize > 0:
      os.rename(_output, output)
    # print('416')
    return
  if (scode is 200) or (scode is 206):
    if total > 0:
      bar = PiecesProgressBar(vname, total + esize, total + esize)
      m.add(bar)
      bar.set_received(esize)
      with open(_output, mode) as fd:
        for chunk in r.iter_content(chunk_size=1280):
            fd.write(chunk)
            bar.update_received(1280)
      bar.done()
    os.rename(_output, output)
  # else:
    # print('216')
def down():
  with open(metapath,'r') as f:
    data = json.load(f)
    inx = 1
    for d in data:
      _down(d)
      print(inx)
      inx += 1
def _rounding(m, d):
  videos = d['videos']
  print(d['main'])
  cp = datapath + '/' + d['vid']
  ts = []
  for index in range(len(videos)):
    video = videos[index]
    vpath = cp + '/v' + str(index)
    if os.path.exists(vpath) is False:
      os.makedirs(vpath)
    url = video['url']
    type = video['type']
    if type == 'mp4':
      output = vpath + '/video.mp4'
      headers = {}
      headers['Referer'] = 'http://www.wodedy.net/js/player/mp4.html'
      headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
      vname = d['vid'] + '#' + str(index)
      # download(m, vname, url, headers, output);
      t = threading.Thread(target=download,args=(m, vname, url, headers, output))
      t.start()
      ts.append(t)
  for t in ts:
    t.join()
  print('finishhing')
  
def rounding():
  m = Monitor()
  def fun_timer():
    m.update()
    threading.Timer(2, fun_timer).start()
  with open(metapath,'r') as f:
    data = json.load(f)
    fun_timer()
    for d in data:
      # if d['vid'] == '2267':
      _rounding(m, d)
rounding()
      
    
  
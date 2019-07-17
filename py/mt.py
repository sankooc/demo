from queue import Queue
import threading
import requests
import os

queue = Queue()
tsList = []
userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
def _download(url, target):
  tmpFile = target + '.download'
  if os.path.exists(target) is False:
    if os.path.exists(tmpFile):
      pass
    else:
      req = requests.get(url, stream=True)
      with open(target, 'wb') as fd:
        for chunk in req.iter_content(chunk_size=1024):
            fd.write(chunk)
def download():
  tname = threading.current_thread().name
  print(tname)
  size = queue.qsize()
  if size == 0:
    pass
  else:
    item = queue.get()
    url = item['url']
    target = item['target']
    print('do one things: ' + url) // target
    threading.Timer(20, download).start()
def start(items = []):
  for item in items:
    queue.put(item)
  for _ in range(5):
    t = threading.Thread(target=download)
    t.start()
    tsList.append(t)
  for t in tsList:
    t.join()
# def urlopen_with_retry(*args, **kwargs):
#     retry_time = 3
#     for i in range(retry_time):
#         try:
#           return request.urlopen(*args, **kwargs)
#         except socket.timeout as e:
#             if i + 1 == retry_time:
#                 raise e
#         # try to tackle youku CDN fails
#         except error.HTTPError as http_error:
#             logging.debug('HTTP Error with code{}'.format(http_error.code))
#             if i + 1 == retry_time:
#                 raise http_error
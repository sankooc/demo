from queue import Queue
import threading
from urllib import request

queue = Queue()
tsList = []

def _download(url, target):
  pass
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
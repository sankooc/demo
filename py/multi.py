# -*- coding:utf-8- -*-
import akal 
import os, sys
import m3u8
import requests
from urllib import request, parse, error


# fake_headers = {
#     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',  # noqa
#     'Accept-Charset': 'UTF-8,*;q=0.5',
#     'Accept-Encoding': 'gzip,deflate,sdch',
#     'Accept-Language': 'en-US,en;q=0.8',
#     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0',  # noqa
# }

# def urlopen_with_retry(*args, **kwargs):
#     retry_time = 3
#     for i in range(retry_time):
#         try:
#             if insecure:
#                 # ignore ssl errors
#                 ctx = ssl.create_default_context()
#                 ctx.check_hostname = False
#                 ctx.verify_mode = ssl.CERT_NONE
#                 return request.urlopen(*args, context=ctx, **kwargs)
#             else:
#                 return request.urlopen(*args, **kwargs)
#         except socket.timeout as e:
#             logging.debug('request attempt %s timeout' % str(i + 1))
#             if i + 1 == retry_time:
#                 raise e
#         # try to tackle youku CDN fails
#         except error.HTTPError as http_error:
#             logging.debug('HTTP Error with code{}'.format(http_error.code))
#             if i + 1 == retry_time:
#                 raise http_error
# def ungzip(data):
#     """Decompresses data for Content-Encoding: gzip.
#     """
#     from io import BytesIO
#     import gzip
#     buffer = BytesIO(data)
#     f = gzip.GzipFile(fileobj=buffer)
#     return f.read()
# def undeflate(data):
#     """Decompresses data for Content-Encoding: deflate.
#     (the zlib compression is used.)
#     """
#     import zlib
#     decompressobj = zlib.decompressobj(-zlib.MAX_WBITS)
#     return decompressobj.decompress(data)+decompressobj.flush()

# def get_content(url, headers={}, decoded=True):
#     req = request.Request(url, headers=headers)

#     response = urlopen_with_retry(req)
#     data = response.read()

#     content_encoding = response.getheader('Content-Encoding')
#     if content_encoding == 'gzip':
#         data = ungzip(data)
#     elif content_encoding == 'deflate':
#         data = undeflate(data)

#     # Decode the response body
#     if decoded:
#         charset = match1(response.getheader('Content-Type', ''), r'charset=([\w-]+)'
#         )
#         if charset is not None:
#             data = data.decode(charset, 'ignore')
#         else:
#             data = data.decode('utf-8', 'ignore')
#     return data

def view (obj):
  print ('\n'.join(['%s:%s' % item for item in obj.__dict__.items()]))
def downM3u8(url, name, target, tmp):
  if os.path.exists(target) is False:
    os.makedirs(target)
  if os.path.exists(tmp) is False:
    os.makedirs(tmp)
  m3u8_obj = m3u8.load(url)
  inx = 0
  list = []
  for segment in m3u8_obj.segments:
    _url = segment.base_uri + segment.uri
    _duration = segment.duration
    _target = '%s/%s-%03d.ts' %(tmp, name, inx) 
    inx += 1
    d = {"url": _url, "duration": _duration, "target": _target}
    list.append(d)
  akal.inQueue(list)
if __name__ == '__main__':
  curl = "https://bili.meijuzuida.com/20190630/19822_44a4b369/800k/hls/index.m3u8"
  target = '/Users/yj431/nrht'
  tmp = '/Users/yj431/temp'
  downM3u8(curl, 'noch', target, tmp)
    # print(segment.iframe_stream_info
  # resp = requests.get(curl)
  # content = resp.text
  # m3u8_list = content.split('\n')
  # urls = []
  # # print(you_get.processor.ffmpeg)
  # inx = 0
  # for line in m3u8_list:
  #     line = line.strip()
  #     if line and not line.startswith('#'):
  #         if line.startswith('http'):
  #             urls.append(line)
  #         else:
  #             seg_url = parse.urljoin(curl, line)
  #             urls.append(seg_url)
  # print(len(urls))
  # title = '测试'
  # ext = 'ts'
  # output_dir = '.'
  # parts = []
  # lengs = len(urls)
  # bar = you_get.common.PiecesProgressBar(0, lengs)
  # bar.update()
  # # print(urls)
  # for i, url in enumerate(urls):
  #   filename = '%s[%02d].%s' % (title, i, ext)
  #   filepath = os.path.join(output_dir, filename)
  #   parts.append(filepath)
  #   bar.update_piece(i + 1)
  #   you_get.common.url_save(url, filepath, bar, refer=None, is_part=True, faker=False)
  # bar.done()

  # output_filename = you_get.common.get_output_filename(urls, title, ext, output_dir, merge=True)
  # output_filepath = os.path.join(output_dir, output_filename)
  # print(output_filename)
  # print(output_filepath)
  # try:
  #   from you_get.processor.ffmpeg import ffmpeg_concat_ts_to_mkv
  #   ffmpeg_concat_ts_to_mkv(parts, '/Users/sankooc/rct.mkv')
  #   print('Merged into %s' % output_filename)
  # except:
  #     raise
  # else:
    # for part in parts:
        # os.remove(part)
# !/usr/bin/env python3
import os, sys
from urllib import request, parse, error
from itertools import zip_longest
_srcdir = '%s/src/' % os.path.dirname(os.path.realpath(__file__))
_filepath = os.path.dirname(sys.argv[0])
sys.path.insert(1, os.path.join(_filepath, _srcdir))



def chunk(list, size = 100):
  ll = len(list)
  rs = []
  inx = 0
  while True:
    lt = inx + size
    lk = list[inx: min(ll, lt)]
    rs.append(lk)
    if lt > ll:
      break
    inx += size
  return rs
if __name__ == '__main__':
  curl = 'https://wuji.zhulong-zuida.com/20190708/1253_77380dd8/800k/hls/index.m3u8'
  # content = you_get.common.get_content(curl)
  # print(content)
  m3u8_list = content.split('\n')
  urls = []
  for line in m3u8_list:
      line = line.strip()
      if line and not line.startswith('#'):
          if line.startswith('http'):
              urls.append(line)
          else:
              seg_url = parse.urljoin(curl, line)
              urls.append(seg_url)
  title = '测试'
  ext = 'ts'
  output_dir = '.'
  parts = []
  lengs = len(urls)
  bar = you_get.common.PiecesProgressBar(0, lengs)
  bar.update()
  # print(urls)
  for i, url in enumerate(urls):
    filename = '%s[%02d].%s' % (title, i, ext)
    filepath = os.path.join(output_dir, filename)
    parts.append(filepath)
    bar.update_piece(i + 1)
    you_get.common.url_save(url, filepath, bar, refer=None, is_part=True, faker=False)
  bar.done()
  pst = chunk(parts)
  # print(pst)
  # output_filename = you_get.common.get_output_filename(urls, title, ext, output_dir, merge=True)
  # output_filepath = os.path.join(output_dir, output_filename)
  
  # print(output_filename)
  # print(output_filepath)
  # print(parts)
  try:
    from you_get.processor.ffmpeg import ffmpeg_concat_ts_to_mkv
    cinx = 0
    for ps in pst:
      ppath = './rct%02d.mkv' %cinx
      ffmpeg_concat_ts_to_mkv(ps, ppath)
      cinx += 1
  except:
      raise
  # else:
    # for part in parts:
        # os.remove(part)


        # // ffmpeg -i "concat:./rct00.mkv|./rct01.mkv|./rct02.mkv|./rct03.mkv|./rct04.mkv|./rct05.mkv|./rct06.mkv" -codec copy ./output.mkv
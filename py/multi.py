# -*- coding:utf-8- -*-
import mt 
import os, sys
import m3u8
import requests
from urllib import request, parse, error

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
  return list
if __name__ == '__main__':
  curl = "https://bili.meijuzuida.com/20190630/19822_44a4b369/800k/hls/index.m3u8"
  target = '/Users/yj431/nrht'
  tmp = '/Users/yj431/temp'
  # mt.inQueue()
  list = downM3u8(curl, 'noch', target, tmp)
  mt.start(list)
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
#!/usr/bin/env python

import os
import subprocess
import sys
from subprocess import DEVNULL


def parameterize(string):
    return "'%s'" % string.replace("'", r"'\''")

def get_usable_ffmpeg(cmd):
    try:
        p = subprocess.Popen([cmd, '-version'], stdin=DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = p.communicate()
        vers = str(out, 'utf-8').split('\n')[0].split()
        assert (vers[0] == 'ffmpeg' and vers[2][0] > '0') or (vers[0] == 'avconv')
        try:
            v = vers[2][1:] if vers[2][0] == 'n' else vers[2]
            version = [int(i) for i in v.split('.')]
        except:
            version = [1, 0]
        return cmd, 'ffprobe', version
    except:
        return None

FFMPEG, FFPROBE, FFMPEG_VERSION = get_usable_ffmpeg('ffmpeg') or get_usable_ffmpeg('avconv') or (None, None, None)
# if logging.getLogger().isEnabledFor(logging.DEBUG):
#     LOGLEVEL = ['-loglevel', 'info']
#     STDIN = None
# else:
#     LOGLEVEL = ['-loglevel', 'quiet']
#     STDIN = DEVNULL
LOGLEVEL = ['-loglevel', 'info']
STDIN = None

def generate_concat_list(files, output):
    concat_list_path = output + '.txt'
    concat_list_dir = os.path.dirname(concat_list_path)
    with open(concat_list_path, 'w', encoding='utf-8') as concat_list:
        for file in files:
            if os.path.isfile(file):
                relpath = os.path.relpath(file, start=concat_list_dir)
                concat_list.write('file %s\n' % parameterize(relpath))
    return concat_list_path

def ffmpeg_concat_ts_to_mkv(files, output='output.mkv'):
    params = [FFMPEG] + LOGLEVEL + ['-isync', '-y', '-i']
    params.append('concat:')
    for file in files:
        if os.path.isfile(file):
            params[-1] += file + '|'
    params += ['-f', 'matroska', '-c', 'copy', output]
    try:
        if subprocess.call(params, stdin=STDIN) == 0:
            return True
        else:
            return False
    except:
        return False


def ffmpeg_concat_mp4_to_mp4(files, output='output.mp4'):
    print('Merging video parts... ', end="", flush=True)
    if FFMPEG == 'ffmpeg' and (FFMPEG_VERSION[0] >= 2 or (FFMPEG_VERSION[0] == 1 and FFMPEG_VERSION[1] >= 1)):
        concat_list = generate_concat_list(files, output)
        params = [FFMPEG] + LOGLEVEL + ['-y', '-f', 'concat', '-safe', '-1',
                                        '-i', concat_list, '-c', 'copy',
                                        '-bsf:a', 'aac_adtstoasc', output]
        subprocess.check_call(params, stdin=STDIN)
        os.remove(output + '.txt')
        return True

    for file in files:
        if os.path.isfile(file):
            params = [FFMPEG] + LOGLEVEL + ['-y', '-i']
            params.append(file)
            params += ['-c', 'copy', '-f', 'mpegts', '-bsf:v', 'h264_mp4toannexb']
            params.append(file + '.ts')

            subprocess.call(params, stdin=STDIN)

    params = [FFMPEG] + LOGLEVEL + ['-y', '-i']
    params.append('concat:')
    for file in files:
        f = file + '.ts'
        if os.path.isfile(f):
            params[-1] += f + '|'
    if FFMPEG == 'avconv':
        params += ['-c', 'copy', output]
    else:
        params += ['-c', 'copy', '-absf', 'aac_adtstoasc', output]

    subprocess.check_call(params, stdin=STDIN)
    for file in files:
        os.remove(file + '.ts')
    return True


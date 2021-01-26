import cv2
import time
import numpy as np
import curses

# pixel后面4位都是空格，代表像素值比较大的
# 近似白色背景
pixels = " .,-'`:!1+*%    "


def get_images(video_name, size):
    '''
    视频帧分解
    图像转灰度图，再缩放
    :param video_name:
    :param size:
    :return: 灰度图列表
    '''
    img_list = []
    cap = cv2.VideoCapture(video_name)
    while cap.isOpened():
        ret, frame = cap.read()
        if ret:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            img = cv2.resize(gray, size, interpolation=cv2.INTER_AREA)
            img_list.append(img)
        else:
            break
    cap.release()
    return img_list


def img_2_char(img):
    '''
    灰度图像映射成字符[0,255] -> [0,16]
    用[0,16]索引值取字符
    :param img:
    :return:  字符数组
    '''
    ret = []
    p = img / 255
    indexes = (p * (len(pixels) - 1)).astype(np.int)
    height, width = img.shape
    for row in range(height):
        line = ""
        for col in range(width):
            index = indexes[row][col]
            line += pixels[index] + " "
        ret.append(line)
    return ret


def video_2_char(img_list):
    '''
    图像列表 转换成 字符图列表
    :param img_list:
    :return:
    '''
    video_char = []
    for img in img_list:
        pic = img_2_char(img)
        video_char.append(pic)

    return video_char


def play_video(video_char):
    width, height = len(video_char[0][0]), len(video_char[0])
    stdscr = curses.initscr()
    curses.start_color()
    try:
        stdscr.resize(height, width * 2)
        for pic_i in range(len(video_char)):
            for line_i in range(height):
                # 将pic_i的第i行写入第i列。(line_i, 0)表示从第i行的开头开始写入。最后一个参数设置字符为白色
                stdscr.addstr(line_i, 0, video_char[pic_i][line_i], curses.COLOR_WHITE)
            stdscr.refresh()  # 写入后需要refresh才会立即更新界面
            time.sleep(1 / 24)
    finally:
        curses.endwin()


if __name__ == "__main__":
    imgs = get_images('c:\\video\\kun.mp4', (64, 40))
    video_chars = video_2_char(imgs)
    play_video(video_chars)
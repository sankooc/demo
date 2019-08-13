import tensorflow as tf
import numpy as np




# tf.reset_default_graph()

w1 = tf.get_variable("w1", shape=(2, 1))

saver = tf.train.Saver()

# dir_path = os.path.dirname(os.path.realpath(__file__))
# sum_path=os.path.join(dir_path,'./saves/model.ckpt') #不要使用斜杠
with tf.Session() as sess:
  saver.restore(sess, './saves/model.ckpt')
  print("v1 : %s" % w1.eval())
  x = tf.constant([[0.7, 0.5]])
  y = tf.matmul(x, w1)
  print(sess.run(y))
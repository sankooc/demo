from __future__ import print_function
import sys
# sys.path.append('~/work/models/slim/')
import tensorflow as tf
import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

tf.app.flags.DEFINE_integer('num_classes', 5, 'The number of classes.')
tf.app.flags.DEFINE_string('infile', '/Users/yj431/logs/tec.txt', 'Image file, one image per line.')
tf.app.flags.DEFINE_boolean('tfrecord',False, 'Input file is formatted as TFRecord.')
tf.app.flags.DEFINE_string('outfile', None, 'Output file for prediction probabilities.')
tf.app.flags.DEFINE_string('model_name', 'inception_v3', 'The name of the architecture to evaluate.')
tf.app.flags.DEFINE_string('preprocessing_name', None, 'The name of the preprocessing to use. If left as `None`, then the model_name flag is used.')
tf.app.flags.DEFINE_string('checkpoint_path', '/Users/yj431/temp/train_logs/','The directory where the model was written to or an absolute path to a checkpoint file.')
tf.app.flags.DEFINE_integer('eval_image_size', None, 'Eval image size.')
FLAGS = tf.app.flags.FLAGS

import numpy as np
import os

from datasets import imagenet
from nets import inception
from nets import resnet_v1
from nets import inception_utils
from nets import resnet_utils
from preprocessing import inception_preprocessing
from nets import nets_factory
from preprocessing import preprocessing_factory

slim = tf.contrib.slim

model_name_to_variables = {'inception_v3':'InceptionV3','inception_v4':'InceptionV4','resnet_v1_50':'resnet_v1_50','resnet_v1_152':'resnet_v1_152'}

preprocessing_name = FLAGS.preprocessing_name or FLAGS.model_name
eval_image_size = FLAGS.eval_image_size

fls = [s.strip() for s in open(FLAGS.infile)]

model_variables = model_name_to_variables.get(FLAGS.model_name)

if model_variables is None:
  tf.logging.error("Unknown model_name provided `%s`." % FLAGS.model_name)
  sys.exit(-1)

if tf.io.gfile.isdir(FLAGS.checkpoint_path):
  checkpoint_path = tf.train.latest_checkpoint(FLAGS.checkpoint_path)
else:
  checkpoint_path = FLAGS.checkpoint_path

image_string = tf.compat.v1.placeholder(tf.string)

image = tf.image.decode_jpeg(image_string, channels=3, try_recover_truncated=True, acceptable_fraction=0.3) ## To process corrupted image files

image_preprocessing_fn = preprocessing_factory.get_preprocessing(preprocessing_name, is_training=False)

network_fn = nets_factory.get_network_fn(FLAGS.model_name, FLAGS.num_classes, is_training=False)

if FLAGS.eval_image_size is None:
  eval_image_size = network_fn.default_image_size

print(eval_image_size);

processed_image = image_preprocessing_fn(image, eval_image_size, eval_image_size)

processed_images  = tf.expand_dims(processed_image, 0)

logits, _ = network_fn(processed_images)

probabilities = tf.nn.softmax(logits)

init_fn = slim.assign_from_checkpoint_fn(checkpoint_path, slim.get_model_variables(model_variables))



sess = tf.compat.v1.Session()
init_fn(sess)

fout = sys.stdout
if FLAGS.outfile is not None:
  fout = open(FLAGS.outfile, 'w')
h = ['image']
h.extend(['class%s' % i for i in range(FLAGS.num_classes)])
h.append('predicted_class')
print('\t'.join(h), file=fout)

for fl in fls:
  image_name = None
  try:
    x = tf.gfile.FastGFile(fl, 'rb').read()
    image_name = os.path.basename(fl)
    probs = sess.run(probabilities, feed_dict={image_string:x})
  except Exception as e:
    tf.logging.warn('Cannot process image file %s' % fl)
    continue
  probs = probs[0, 0:]
  a = [image_name]
  a.extend(probs)
  a.append(np.argmax(probs))
  print('\t'.join([str(e) for e in a]), file=fout)
  print('*'*30)

sess.close()
fout.close()

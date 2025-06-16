
# -*- coding:UTF-8 -*-

'''
CNN Model (updated for TensorFlow 2.x)
'''
import time
import numpy as np
import tensorflow.compat.v1 as tf
import dataset

# Disable eager execution for TF1.x compatibility
tf.disable_v2_behavior()

MODEL_SEVE_PATH = '../model/model.ckpt'
Label = {0:'Fall',1:'Stand',2:'Walk',3:'Jog',4:'Jump',5:'up_stair',6:'down_stair',
         7:'stand2sit',8:'sitting',9:'sit2stand',10:'CSI',11:'CSO',12:'LYI'}

# Hyperparameters
CLASS_LIST = [0,2,3,4,5,6,7,9]
CLASS_NUM = len(CLASS_LIST)
LEARNING_RATE = 0.001
TRAIN_STEP = 10000
BATCH_SIZE = 50

def wights_variable(shape):
    wights = tf.truncated_normal(shape=shape,stddev=0.1)
    return tf.Variable(wights,dtype=tf.float32)

def biases_variable(shape):
    bias = tf.constant(0.1,shape=shape)
    return tf.Variable(bias,dtype=tf.float32)

def conv2d(x,kernel):
    return tf.nn.conv2d(x,kernel,strides=[1,1,1,1],padding='SAME')

def max_pooling_2x2(x):
    return tf.nn.max_pool(x,ksize=[1,2,2,1],strides=[1,2,2,1],padding='SAME')

def lrn(x):
    return tf.nn.lrn(x,4,1.0,0.001,0.75)

def fall_net(x):
    with tf.name_scope('reshape'):
        x = tf.reshape(x,[-1,20,20,3])
        x = x / 255.0 * 2 - 1

    with tf.name_scope('conv1'):
        conv1_kernel = wights_variable([5,5,3,32])
        conv1_bias = biases_variable([32])
        conv1_conv = conv2d(x,conv1_kernel)+conv1_bias
        conv1_value = tf.nn.relu(conv1_conv)

    with tf.name_scope('max_pooling_1'):
        mp1 = max_pooling_2x2(conv1_value)

    with tf.name_scope('conv2'):
        conv2_kernel = wights_variable([5,5,32,64])
        conv2_bias = biases_variable([64])
        conv2_conv = conv2d(mp1,conv2_kernel)+conv2_bias
        conv2_value = tf.nn.relu(conv2_conv)

    with tf.name_scope('max_pooling_2'):
        mp2 = max_pooling_2x2(conv2_value)

    with tf.name_scope('fc1'):
        fc1_wights = wights_variable([5*5*64,512])
        fc1_biases = biases_variable([512])
        fc1_input = tf.reshape(mp2,[-1,5*5*64])
        fc1_output = tf.nn.relu(tf.matmul(fc1_input,fc1_wights)+fc1_biases)

    with tf.name_scope('drop_out'):
        keep_prob = tf.placeholder(dtype=tf.float32)
        drop_out = tf.nn.dropout(fc1_output,keep_prob)

    with tf.name_scope('fc2'):
        fc2_wights = wights_variable([512,CLASS_NUM])
        fc2_biases = biases_variable([CLASS_NUM])
        fc2_output = tf.matmul(drop_out,fc2_wights)+fc2_biases

    return fc2_output,keep_prob

def train_model():
    with tf.name_scope('input_dataset'):
        x = tf.placeholder(tf.float32,[None,1200])
        y = tf.placeholder(tf.float32,[None,CLASS_NUM])
    y_,keep_prob = fall_net(x)

    with tf.name_scope('loss'):
        cross_entropy = tf.nn.softmax_cross_entropy_with_logits(labels=y,logits=y_)
        loss = tf.reduce_mean(cross_entropy)
        tf.summary.scalar("loss", loss)

    with tf.name_scope('optimizer'):
        train = tf.train.AdamOptimizer(LEARNING_RATE).minimize(loss)

    with tf.name_scope('accuracy'):
        correct_prediction = tf.equal(tf.argmax(y_,1),tf.argmax(y,1))
        correct_prediction = tf.cast(correct_prediction,tf.float32)
        accuracy = tf.reduce_mean(correct_prediction)
        tf.summary.scalar("accuracy", accuracy)

    data = dataset.DataSet('../data/dataset',CLASS_LIST)
    saver = tf.train.Saver()
    merged = tf.summary.merge_all()

    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())
        train_writer = tf.summary.FileWriter("../log/", sess.graph)

        for step in range(1, TRAIN_STEP+1):
            batch_x, batch_y = data.next_batch(BATCH_SIZE)
            if step%100==0:
                train_accuracy = accuracy.eval(feed_dict={x: batch_x, y: batch_y, keep_prob: 1.0})
                print('Training step %d, Accuracy: %f' % (step, train_accuracy))
                summ = sess.run(merged, feed_dict={x: batch_x, y: batch_y,keep_prob: 1.0})
                train_writer.add_summary(summ, global_step=step)

            sess.run(train, feed_dict={x: batch_x, y: batch_y, keep_prob: 0.5})

        train_writer.close()
        save_path = saver.save(sess, MODEL_SEVE_PATH)
        print("Model saved to: %s" % (save_path))

def test_model():
    data = dataset.DataSet('../data/dataset', CLASS_LIST, True)
    test_x, test_y = data.get_test_data()

    tf.reset_default_graph()
    with tf.name_scope('input'):
        x = tf.placeholder(tf.float32,[None,1200])
        y = tf.placeholder(tf.float32,[None,CLASS_NUM])
    y_,keep_prob = fall_net(x)

    with tf.name_scope('accuracy'):
        correct_prediction = tf.equal(tf.argmax(y_,1),tf.argmax(y,1))
        correct_prediction = tf.cast(correct_prediction,tf.float32)
        accuracy = tf.reduce_mean(correct_prediction)

    saver = tf.train.Saver()
    with tf.Session() as sess:
        saver.restore(sess, MODEL_SEVE_PATH)
        p_y = np.argmax(sess.run(y_,feed_dict={x: test_x,keep_prob: 1.0}),1)
        print("Accuracy: %f" % accuracy.eval(feed_dict={x: test_x, y: test_y, keep_prob: 1.0}))

    g_truth = np.argmax(test_y,1)
    avg_sensitivity = 0
    avg_specificity = 0

    for i in range(CLASS_NUM):
        accuracy_,sensitivity,specificity = evaluate(p_y,g_truth,i)
        print('class:%10s,accuracy =%05f,sensitivity =%05f,specificity =%05f'%(Label[CLASS_LIST[i]],accuracy_,sensitivity,specificity))
        avg_sensitivity += sensitivity
        avg_specificity += specificity

    avg_sensitivity /= CLASS_NUM
    avg_specificity /= CLASS_NUM
    print('avg_sensitivity=%05f,avg_specificity=%05f'%(avg_sensitivity,avg_specificity))

def evaluate(p,g,class_):
    fall_index = []
    data_size = g.size
    for i in range(data_size):
        if g[i] == class_:
            fall_index.append(i)
    fall_num = len(fall_index)

    TP = 0
    FN = 0
    for i in range(fall_num):
        index = fall_index[i]
        if p[index] == g[index]:
            TP+=1
        else:
            FN+=1
    sensitivity = TP/(TP+FN+1e-6)

    FP = 0
    TN = 0
    for i in range(data_size):
        if g[i] != class_:
            if p[i] == class_:
                FP+=1
            else:
                TN+=1

    specificity = TN/(FP+TN+1e-6)
    accuracy = (TP+TN)/(FP+TN+TP+FN+1e-6)
    return accuracy,sensitivity,specificity

def demo_run(data):
    if data.shape != (1,1200):
        print('Invalid data shape:', data.shape)
        return None

if __name__=='__main__':
    train_model()
    test_model()

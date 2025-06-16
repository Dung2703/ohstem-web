# # -*- coding:UTF-8 -*-

# '''
# 用于处理日常行为数据。
# 根据下载下来的数据文件，日常行为的数据文件解析和提取与跌到数据文件处理存在不同之处。
# 需要实现的功能：
# 1.通过调用data_graph里面的adl_line_chart方法查看需要截取的数据范围，
# 获取需要截取的数据。
# 2.日常行为数据传感器采集频率为200hz，而跌倒数据采集频率为100hz，
# 所以需要进步提取数据，并将提取的数据保存至新的csv文件中。
# 3.向用户询问，一份csv文件需要提取几份数据。通过调用data_graph中
# adl_chart_for_extract_multi_data方法来获取需要截取的每段数据begin值，
# 通过begin来进行数据保存。
# '''
# import os
# import pandas as pd
# import data_graph as dp

# ADL_DATA_SAVE_FILE = "../data/raw_data/ADL/SCH/SCH_data.csv"
# INDEX_FILE = '../data/raw_data/ADL/SCH/indexfile.csv'

# # 1-23
# #path = '/home/tony/fall_research/fall_data/SisFall_dataset/SisFall_dataset/SA23'
# # 1-15
# path = '/home/tony/fall_research/fall_data/SisFall_dataset/SisFall_dataset/SE15'

# Label = {'STD':1,'WAL':2,'JOG':3,'JUM':4,'STU':5,'STN':6,'SCH':7,'SIT':8,'CHU':9,'CSI':10,'CSO':11,'LYI':12,'FOL':0,'FKL':0,'BSC':0,'SDL':0}

# def extract_data(annotated_file,begin,end,label,save_data_file=ADL_DATA_SAVE_FILE):
#     """
#     提取数据，根据参数，截取定长数据来存储到new_data_file中.
#     截取的数据长度=end+1-begin
#     :param annotated_file: 需要提取的csv数据文件
#     :param begin: 数据的起始段
#     :param end: 数据的终止段
#     :param label: 数据分类类型
#     :param save_data_file: 攫取的数据存储文件
#     :return: 返回存储好的文件
#     """
#     try:
#         annotated_data = pd.read_csv(annotated_file)
#     except IOError:
#         print(annotated_file,"文件无法打开或不存在！")
#         return annotated_file
#     else:
#         print(annotated_file,"成功读取")

#     acc_extract_data = annotated_data.iloc[begin:end, 6:9].values
#     #print(annotated_data.iloc[:, 6:9].values.reshape(-1,))
#     acc_max = max(annotated_data.iloc[:, 6:9].values.reshape(-1,))
#     acc_min = min(annotated_data.iloc[:, 6:9].values.reshape(-1,))
#     acc_up = 0
#     if acc_min<0:
#         acc_up = -acc_min
#     acc_scale = (acc_max-acc_min)/255 +1

#     gyro_extract_data = annotated_data.iloc[begin:end, 3:6].values

#     gyro_max = max(annotated_data.iloc[:, 3:6].values.reshape(-1,))
#     gyro_min = min(annotated_data.iloc[:, 3:6].values.reshape(-1,))
#     gyro_up = 0
#     if gyro_min < 0:
#         gyro_up = -gyro_min
#     gyro_scale = (gyro_max - gyro_min) / 255 + 1


#     with open(save_data_file, "a+") as data_file:
#         data_file.seek(0,os.SEEK_SET)
#         if data_file.read()=="":
#             data_file.write("label")
#             for i in range(1200):
#                 data_file.write(","+str(i+1))
#             data_file.write("\n")

#         data_file.seek(0, os.SEEK_END)
#         #在数据每一行中，第一位代表数据标签。0代表跌倒数据,非0代表日常活动数据
#         data_file.write(str(Label[label]))

#         for data in acc_extract_data:
#             line_data = ","+str(int((data[0]+acc_up)/acc_scale))+","+str(int((data[1]+acc_up)/acc_scale))+","+str(int((data[2]+acc_up)/acc_scale))
#             data_file.write(line_data)

#         for data in gyro_extract_data:
#             line_data = ","+str(int((data[0]+gyro_up)/gyro_scale))+","+str(int((data[1]+gyro_up)/gyro_scale))+","+str(int((data[2]+gyro_up)/gyro_scale))
#             data_file.write(line_data)
#         #传感器有加速度和陀螺仪，所以提取完陀螺仪后自动完成换行，方便提取新的一行数据
#         data_file.write("\n")
#     print("从",annotated_file,"文件中提取",str((end-begin)/2),"份数据。\n已保存至",save_data_file)
#     datafile = pd.read_csv(save_data_file)
#     #position值表示save_data_file中excel存储数据位置的标号
#     position = len(datafile.label)+1
#     with open(INDEX_FILE, "a+") as index_file:
#         index_file.seek(0,os.SEEK_SET)
#         if index_file.read()=="":
#             index_file.write("Name")
#             index_file.write(","+"position")
#             index_file.write("\n")
#         index_file.seek(0,os.SEEK_END)
#         index_file_data = annotated_file+","+str(position)
#         index_file.write(index_file_data)
#         index_file.write("\n")
#     print("已将文件处理完成加入索引！")

#     return save_data_file

# def main():
#     count = 0
#     for i in os.listdir(path):
#         file = path + '/' + i
#         flag = 0
#         if os.path.isfile(INDEX_FILE):
#             infile = pd.read_csv(INDEX_FILE)
#             rownum = len(infile.Name)
#             for j in range(0,rownum):
#                 if(file == infile.Name[j]):
#                     flag = 1
#         if flag != 1:
#             if os.path.isfile(file):
#                 if (('D07' in i) or ('D08' in i) or ('D09' in i) or ('D10' in i)) and ('csv' in i):
#                     print('开始截取',i,'文件')
#                     #dp.fall_line_chart(file)
#                     #begin = input('起始：')
#                     data,num = dp.adl_line_chart(file)
#                     begin = int(data[num-1])
#                     if(begin == None):
#                         print("起始点获取错误，文件可能不存在！")
#                         break
#                     #pdFile = pd.read_csv(file)
#                     #begin_num = int(begin)+200
#                     #labelName = pdFile.label[begin_num]

#                     extract_data(file, int(begin), int(begin) + 200,'SCH')
#                     count=count+1

#     print("截取完成！")

#     # #测试程序
#     # f = pd.read_csv(ADL_DATA_SAVE_FILE)
#     # print(f.head())
#     # print(f.shape)

# if __name__ == "__main__":
#     main()

#     #print(a.all())

# ADL_handle.py (hop nhat tat ca file da chuan hoa thanh tap train/test)
# -*- coding:UTF-8 -*-

import os
import numpy as np
import pandas as pd
from transform import transform_sensor_data
import sklearn
from sklearn.model_selection import train_test_split
LABEL_MAP = {
    'fall': 0,
    'walk': 2,
    'jog': 3,
    'jump': 4,
    'upstair': 5,
    'downstair': 6,
    'stand2sit': 7,
    'sit2stand': 9
}

DATA_DIR = "../data/dataset"
MERGED_FILE = "../data/merged_dataset/merged_dataset.csv"


def merge_all_csv_and_transform():
    header_written = False
    with open(MERGED_FILE, "w") as out_file:
        for label_name, label_value in LABEL_MAP.items():
            file_path = os.path.join(DATA_DIR, f"{label_value}_{label_name}_data.csv")
            if not os.path.exists(file_path):
                print(f"Bỏ qua vì không thấy file: {file_path}")
                continue

            print(f"Đang xử lý: {file_path}")
            df = pd.read_csv(file_path, header=None)
            for idx, row in df.iterrows():
                if row[0] == 'label':
                    continue
                try:
                    values = row.values.astype(np.float32)
                    label = int(values[0])
                    sensor_data = values[1:]
                    transform = transform_sensor_data(sensor_data, idx)
                    flat_data = transform.flatten().tolist()
                    if not header_written:
                        out_file.write("label," + ",".join([str(i+1) for i in range(len(flat_data))]) + "\n")
                        header_written = True
                    out_file.write(str(label) + "," + ",".join(map(str, flat_data)) + "\n")
                except Exception as e:
                    print(f"Lỗi ở dòng {idx} trong file {file_path}: {e}")
def split_train_test(input_csv="../data/merged_dataset/merged_dataset.csv", test_ratio=0.2):
    df = pd.read_csv(input_csv)
    y = df.iloc[:, 0]
    X = df.iloc[:, 1:]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_ratio, stratify=y, random_state=42)

    train_df = pd.concat([y_train.reset_index(drop=True), X_train.reset_index(drop=True)], axis=1)
    test_df = pd.concat([y_test.reset_index(drop=True), X_test.reset_index(drop=True)], axis=1)

    train_df.to_csv("../data/train_data/train.csv", index=False)
    test_df.to_csv("../data/test_data/test.csv", index=False)
    print("✅ Đã tạo train.csv và test.csv")
if __name__ == '__main__':
    merge_all_csv_and_transform()
    split_train_test()

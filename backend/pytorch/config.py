config = {
    'seed': 507,
    'valid_ratio': 0.20,
    'n_epochs': 100,
    'batch_size': 16,
    'learning_rate': 1e-3,
    'early_stop': 10,
    'query_iteration': 20,
    'large_model_path': './trainingModels/LargeModel.ckpt',
    'small_model_path': './trainingModels/SmallModel.ckpt',
    'query_size': 20,
    'pool_size': 300
}

datasetConfig = {
    # 'train_data_miss_path':r'./dataquality/data/data_train_miss.csv', #original data
    # 'test_data_miss_path':r'./dataquality/data/data_test_miss.csv', #original data
    'train_data_path':r'./pytorch/data/train_data.csv', 
    'test_data_path':r'./pytorch/data/test_data.csv', 
    'train_data_miss_path':r'./dataquality/data/train_data_miss.csv', #upload data
    'test_data_miss_path':r'./dataquality/data/test_data_miss.csv', #upload data
    'data_info_path':r'./dataquality/data/data_info.csv', #store label_name, num_feature, class_amount
    # 'label_name':'Class',
    # 'num_feature':16, # original data 128
    # 'class_amount':7,

}

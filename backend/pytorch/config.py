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
    'train_data_miss_path':r'./dataquality/data/data_train_miss.csv',
    'test_data_miss_path':r'./dataquality/data/data_test_miss.csv',
    'train_data_path':r'./pytorch/data/data_train.csv',
    'test_data_path':r'./pytorch/data/data_test.csv',
    'label_name':'Gas Class',
    'num_feature':128, 
    # 'train_data_path':r'./pytorch/data/preprocessed_beans_train.csv',
    # 'test_data_path':r'./pytorch/data/preprocessed_beans_test.csv',
    # 'label_name':'Class',
    # 'num_feature':16, 
}

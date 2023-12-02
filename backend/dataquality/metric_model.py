import numpy as np
import pandas as pd
from catboost import CatBoostClassifier
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
# from mlxtend.classifier import StackingClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
from sklearn.ensemble import StackingClassifier


# # change the path by yourself
# X_train_complete = pd.read_csv('./Gas_Dataset/X_train_top30.csv')
# y_train_complete = pd.read_csv('./Gas_Dataset/y_train_top30.csv')
# X_test_complete = pd.read_csv('./Gas_Dataset/X_test_top30.csv')
# y_test_complete = pd.read_csv('./Gas_Dataset/y_test_top30.csv')
# y_train_complete['Gas Class'] = y_train_complete['Gas Class'].apply(lambda x: x - 1)
# y_test_complete['Gas Class'] = y_test_complete['Gas Class'].apply(lambda x: x - 1)

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
def generate_stack_prediction(X_train, y_train, X_test, y_test):
    # clf1 = GaussianNB()  # 弱分類器
    clf1 = CatBoostClassifier(iterations=100, depth=6, learning_rate=0.1, loss_function='MultiClass', verbose=False, random_state=42)
    clf2 = XGBClassifier(objective='multi:softmax', num_class=6, random_state=42)
    clf3 = RandomForestClassifier(n_estimators=100, random_state=42)

    # Stacking 集成, 結合cv可以用到全部訓練資料
    sclf = StackingClassifier(estimators=[('catboost', clf1), ('xgboost', clf2), ('randomforest', clf3)],
                            cv=3,
                            stack_method="predict_proba", #概率值作为meta-classfier(Lr)的输入
                            passthrough=False, #除了概率以外也把原始特徵當作最終Lr模型輸入
                            final_estimator=LogisticRegression(random_state=42))

    print("\nfitting...\n")
    sclf.fit(X_train, y_train)

    print("\nPredicting...\n")
    predict_results = sclf.predict(X_test)

    round_decimal_place = 6
    return {
        'Accuracy': round(accuracy_score(y_test, predict_results), round_decimal_place),
        'Precision': round(precision_score(y_test, predict_results, average = 'weighted'), round_decimal_place),
        'Recall': round(recall_score(y_test, predict_results, average = 'weighted'), round_decimal_place),
        'F1': round(f1_score(y_test, predict_results, average = 'weighted'), round_decimal_place),
    }
    
# result = generate_stack_prediction(X_train_complete, y_train_complete, X_test_complete, y_test_complete)
# print(result)
    

#todo: compare with iterative imputer
#todo: criterion

import inspect  
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from lightgbm import LGBMClassifier, LGBMRegressor
from sklearn.preprocessing import OneHotEncoder
import category_encoders as ce
from copy import deepcopy

class MissForest():
    """
    Parameters:
    =============
    clf : estimator object, default=LGBMClassifier.
    This object is assumed to implement the scikit-learn estimator api.

    rgr : estimator object, default=LGBMRegressor.
    This object is assumed to implement the scikit-learn estimator api.

    max_iter : int, default=10
    Determines the number of iteration.

    initial_guess : string, callable or None, default='mean'
    option: 'mean', 'median'

    n_estimators : int, default=100
    Determines the number of random forest trees.

    cat_cols : list,
    A list that specified which columns should not be auto encoded. These columns will not be encoded by the mapping.
    """
    
    def __init__(self, clf = None, rgr = None, init_guess : str = 'mean', max_iter : int = 10, n_estimators : int = 100, cat_cols: list = None):
        self.classifier = clf
        self.regressor = rgr
        self.initial_guess = init_guess
        self.max_iter = max_iter
        self.n_estimators = n_estimators
        self.cat_cols = cat_cols
        if self.classifier == "RandomForestClassifier":
            self.classifier = RandomForestClassifier(n_estimators=self.n_estimators)
        if self.regressor == "RandomForestRegressor":
            self.regressor = RandomForestRegressor(n_estimators=self.n_estimators)
        if self.classifier == None or "LGBMClassifier":
            self.classifier = LGBMClassifier(n_estimators=self.n_estimators, verbosity=-1)
        if self.regressor == None or "LGBMRegressor":
            self.regressor = LGBMRegressor(n_estimators=self.n_estimators, verbosity=-1)


    def get_missing_cols_rows(self, df : pd.DataFrame):
        """
        Get the columns and rows that contain missing values, and the observed rows.

        Parameters
        =============
        df :  n * p matrix, the dataset to be imputed.

        Return:
        =============
        mis_rows : dictionary, {features : missing rows}.

        mis_cols : indexes, columns that have missing values.
        
        obs_rows : dictionary, {features : observed rows}.
        """
        mis_rows = {}
        obs_rows = {}
        for col in df.columns:
            feat_val = df[col]
            # Find missing value index
            missing = feat_val.isnull()
            mis_index = feat_val[missing].index
            obs_index = feat_val[missing==0].index
            # Missing entry of certain feature
            mis_rows[col] = mis_index
            # Observed entry of certain feature
            obs_rows[col] = obs_index
        
        #Sort the features based on the number of missing values.
        sorted_mis_cols = df.isnull().sum().sort_values() > 0
        mis_cols = df.columns[sorted_mis_cols]
        

        return mis_rows, obs_rows, mis_cols
    
    def cat_map_and_revmap(self, df):
        """
        Encoding of categorical features.

        Parameters
        ===========
        df: n * p matrix, the dataset to be imputed.

        Return
        ===========
        mappings : dictionary. key : categorical features. value : encodings.

        r_mappings : dictionary. key : encodings. value : categorical features.
        """
        vtype = np.vectorize(type)

        mappings = {}
        r_mappings = {}
        for col in df.columns:
            feature_without_na = df[col].dropna()
            feature_without_na_type = vtype(feature_without_na)
            is_all_str = all(feature_without_na_type == str)
            if is_all_str:
                unique_vals = df[col].dropna().unique()
                nunique_vals = range(df[col].dropna().nunique())

                # label the category into int values.
                mappings[col] = {k: v for k, v in zip(unique_vals, nunique_vals)}
                r_mappings[col] = {v: k for k, v in mappings[col].items()}
        return mappings, r_mappings

    def init_impute(self, df):
        """
        Parameters
        ===========
        df: n * p matrix, the dataset to be imputed.

        Return:
        =========
        df: n * p matrix, the imputed dataset.
        """
        for col in df.columns:
            try:
                # mean or median when continuous
                if self.initial_guess == 'mean':
                    impute_vals = df[col].mean()
                else:
                    impute_vals = df[col].median()
            except TypeError:
                # mode as impute value when categorical.
                impute_vals = df[col].mode().values[0]
            df[col].fillna(impute_vals, inplace=True)
        return df

    def fit_transform(self, df, verbose:bool = False):
        """
        Train the model, and impute each feature iteratively.

        Parameters
        ===========
        df : n * p matrix, the dataset to be imputed.

        verbose : bool, default=False
        To print training process or not.

        Return:
        =========
        df_imp : n * p matrix, the imputed dataset.
        
        """
        mis_row, obs_row, mis_col = self.get_missing_cols_rows(df)
        mapping, r_mapping= self.cat_map_and_revmap(df)
        df_imp = self.init_impute(df)
        for col in mapping:
            # If specified, then stop encoding for that column.
            if col in self.cat_cols:
                continue
            df_imp[col].replace(mapping[col], inplace=True)
            df_imp[col] = df_imp[col].astype(int)

        for i in range(self.max_iter):
            if(verbose):
                print(f"Iteration: {i+1}/{self.max_iter}")
            for col in mis_col:
                # Determine estimator by data type
                if col in mapping:
                    print(f"Category: {col} ")
                    estimator = deepcopy(self.classifier)
                else:
                    print(f"Continuous: {col} ")
                    estimator = deepcopy(self.regressor)
                if(verbose):
                    print(f"Using {estimator}")
                x_obs = df_imp.drop(col, axis=1).loc[obs_row[col]]
                y_obs = df_imp[col].loc[obs_row[col]]
                # entries that contain missing values
                mis_index = mis_row[col]
                x_mis = df_imp.drop(col, axis=1).loc[mis_index]
                estimator.fit(x_obs, y_obs)
                y_pred = estimator.predict(x_mis)
                y_pred = pd.Series(y_pred)
                y_pred.index = mis_row[col]
                df_imp.loc[mis_index, col] = y_pred

        for col in r_mapping:
            if col in self.cat_cols:
                continue
            df_imp[col].replace(r_mapping[col], inplace=True)

        return df_imp
            



# if __name__ == "__main__":
#     df = pd.read_csv("../Example/data/original.csv")
#     imputer = MissForest()
#     df_imputed = imputer.fit_transform(df)
#     df_imputed.to_csv("Imputed.csv")
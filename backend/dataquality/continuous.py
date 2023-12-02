import pandas as pd
import numpy as np
import scipy.integrate as integrate
from scipy.integrate import dblquad
from dataclasses import dataclass
from scipy.linalg import det
import numpy as np
import seaborn as sns
import matplotlib.pylab as plt
from sklearn.metrics import r2_score
import scipy.stats as stats
from statsmodels.stats.outliers_influence import variance_inflation_factor


@dataclass
class continuous:
    # entropy_return = None
    dependent_var: str = None

    def _gaussion(self, x, data_list):
        mean = np.mean(data_list)
        std = np.std(data_list) 
        return 1/(np.sqrt(2*np.pi)*std)*np.exp(-1/2*((x-mean)/std)**2)

    def _pearson_corr_coefficient(self, data_list_1, data_list_2):
        mu_x = np.mean(data_list_1)
        mu_y = np.mean(data_list_2) 
        std_x = np.std(data_list_1)
        std_y = np.std(data_list_2)
        # cov_x_y = sum((a - mu_x) * (b - mu_y) for (a,b) in zip(data_list_1,data_list_2)) / len(data_list_1)
        return sum((a - mu_x) * (b - mu_y) for (a,b) in zip(data_list_1,data_list_2)) / len(data_list_1)/(std_x*std_y), mu_x, mu_y, std_x, std_y

    
    def _joint_gaussion(self, x, y, data_list_1, data_list_2):
        rho, mu_x, mu_y, std_x, std_y  = self._pearson_corr_coefficient(data_list_1, data_list_2)
        x_diff = x-mu_x
        y_diff = y-mu_y
        S = (x_diff/std_x)**2 + (y_diff/std_y)**2 - 2*rho*x_diff*y_diff/(std_x* std_y)
        return 1/(2*np.pi*std_x*std_y*np.sqrt(1 - rho**2))*np.exp(-S/(2*(1-rho**2)))
        
    def entropy(self, data_list):
        # result, _ = integrate.quad(lambda x: self._gaussion(x, data_list)*np.log(1/self._gaussion(x, data_list)), -30,30)
        return 1/2*np.log(2*np.pi*np.e*np.std(data_list)**2)

    def relative_entropy(self, data_list_1, data_list_2):
        std_1 = np.std(data_list_1)
        std_2 = np.std(data_list_2)
        # result, _ = integrate.quad(lambda x: self._gaussion(x, data_list_1)* np.log(self._gaussion(x, data_list_1)/self._gaussion(x, data_list_2)), -30,30)
        return 1/2*(np.log(std_2**2/std_1**2) + std_1**2/std_2**2 + (np.mean(data_list_1)-np.mean(data_list_2))**2/std_2**2 -1)

    def js_divergence(self, data_list_1, data_list_2):
        M = [(x + y) / 2 for x, y in zip(data_list_1, data_list_2)]
        return 1/2*(self.relative_entropy(data_list_1, M)+ self.relative_entropy(data_list_2, M)), self.relative_entropy(data_list_1, data_list_2), self.relative_entropy(data_list_2, data_list_1)

    def joint_entropy_2(self, data_list_1, data_list_2):
        ''' 
        entropy under both consideration
        '''

        if list(data_list_1) == list(data_list_2):
            return self.entropy(data_list_1)
        f = lambda x, y: -self._joint_gaussion(x, y, data_list_1, data_list_2)*np.log(self._joint_gaussion(x, y, data_list_1, data_list_2))
        val, _ = integrate.dblquad(f, -20, 20, -20, 20)
        return val
        # n = 2
        # cov_matrix = np.cov(data_list_1, data_list_2)
        # return (1/2)*(n*np.log(2*np.pi) + n + np.log(det(cov_matrix)))

    def multi_collinearity(self, df):
        vif = pd.DataFrame()
        vif["attribute name"] = df.columns 
        df_filled = df.fillna(0)
        # vif['VIF'] = [variance_inflation_factor(df_filled.values, i) for i in range(df_filled.shape[1])]
        vif['VIF'] = [round(variance_inflation_factor(df_filled.values, i), 4) for i in range(df_filled.shape[1])]
        vif = vif.sort_values(by='VIF', ascending=False)
        return vif
        
    def missing_rate(self, df):
        missing_rates = df.isnull().mean().reset_index()

        # rename columns
        missing_rates.columns = ['attribute name', 'missing rate(%)']
        missing_rates['missing rate(%)'] = missing_rates['missing rate(%)'] * 100
        
        return missing_rates
    

    def basic_info(self, col_list):
        # mean, var, corr_matrix, Q1-Q3 of each column
        min = np.mean(col_list)
        max = np.max(col_list)
        avg = np.mean(col_list)
        q1 = np.percentile(col_list, 25)
        q3 = np.percentile(col_list, 75)
        std = np.std(col_list)   
        skewness = stats.skew(col_list)
        kurtosis = stats.kurtosis(col_list)
        return min, max, avg, q1, q3, std, skewness, kurtosis


    def compare_base(self, df, method = "zero"):
        "when need to compare with missing data, consider drop all missing value or take the case as 0"
        if method == 'drop':
            return df.copy().dropna()
        elif method == "zero":  
            return df.copy().fillna(0,inplace=True)

    def pair_plot(self, df_before, df_after):
        da, db = df_after.copy(), df_before.copy()
        da['imputed'] = True
        db['imputed'] = False
        combined_df = pd.concat([db, da], ignore_index=True)
        sns.set(style='ticks')
        sns.pairplot(combined_df, kind='reg', hue='imputed', diag_kind='hist', diag_kws={'alpha': 0.5}, plot_kws={'scatter_kws': {'alpha': 0.3}})
        plt.show()

    def simpStability(self, table):
        entropy_percentage_diff = table.iloc[3][1:]
        abs_list = [abs(x) for x in entropy_percentage_diff.to_list()]
        mean = sum(abs_list) / len(abs_list)
        scalared_mean = 10-mean*10
        
        return round(scalared_mean,2)
        
        
    def percentage_difference(self, a, b):
        return (b-a)/a
    
    def comparison(self, df_before, df_after, method='all'):
        """
        Compare some metrics to show difference percentage of imputed before/after
        """
        # entropy_pair_list = []
        # js_divergence_list = []
        df_entropy = {}
        js_divergence = {}
        df_basic_before = {}
        df_basic_after = {}

        print('\n*** Missing Rate ***')
        missing_rate_df = self.missing_rate(df_before)
        missing_rate_df['missing rate(%)'] = missing_rate_df['missing rate(%)'].apply(lambda x: round(x, 2))

        # impute the dataframe with missing records with 0 to continue the execution
        df_before.fillna(0, inplace=True)

        
        # create index colun for df_entropy
        en_index_col = pd.Series(['entropy_before', 'entropy_after', 'difference', 'percentage_difference'], name='Entropy')
        js_index_col = pd.Series(['js-divergence', 'KL(1||2)', 'KL(2||1)'], name='JS-Divergence')
        basic_before_col = pd.Series(['min', 'max', 'avg', 'q1', 'q3', 'std', 'skewness', 'kurtosis'], name = 'Before')
        basic_after_col = pd.Series(['min', 'max', 'avg', 'q1', 'q3', 'std', 'skewness', 'kurtosis'], name = 'After')

            # insert the new column at the leftmost position
        # for entropy
        for col in df_before.columns:
            entropy_before, entropy_after = self.entropy(df_before[col]), self.entropy(df_after[col])
            min_before, max_before, avg_before, q1_before, q3_before, std_before, skewness_before, kurtosis_before = self.basic_info(df_before[col])
            min_after, max_after, avg_after, q1_after, q3_after, std_after, skewness_after, kurtosis_after = self.basic_info(df_after[col])
            
            df_entropy.update({col:[entropy_before, entropy_after, abs(entropy_before-entropy_after), self.percentage_difference(entropy_before, entropy_after)]})
            
            
            js, kl_12, kl_21 = self.js_divergence(df_before[col], df_after[col])
            js_divergence.update({col: [js, kl_12, kl_21]})
            df_basic_before.update({col:[min_before, max_before, avg_before, q1_before, q3_before, std_before, skewness_before, kurtosis_before]})
            df_basic_after.update({col:[min_after, max_after, avg_after, q1_after, q3_after, std_after, skewness_after, kurtosis_after]})

        df_entropy = pd.DataFrame(df_entropy).applymap(lambda x: round(x, 4))#, index=['entropy_before', 'entropy_after', 'difference', 'percentage_difference'])
        df_entropy.insert(0, 'Entropy', en_index_col)


        js_divergence = pd.DataFrame(js_divergence).applymap(lambda x: round(x, 4))
        js_divergence.insert(0, 'JS-Divergence', js_index_col)

        df_basic_before = pd.DataFrame(df_basic_before).applymap(lambda x: round(x, 4))
        df_basic_after = pd.DataFrame(df_basic_after).applymap(lambda x: round(x, 4))
        df_basic_before.insert(0, 'Basic Info Before', basic_before_col)
        df_basic_after.insert(0, 'Basic Info After', basic_after_col)


        print('\n*** Entropy ***')

        
        print('\n*** Simplified Stability ***')
        simpEntropy = self.simpStability(df_entropy)
        
        print('\n*** JS-Divergence ***')
        js_divergence = js_divergence
        
        
        print('\n*** Basic Info ***')
        df_basic_before = df_basic_before
        df_basic_after = df_basic_after
        

        print('\n*** Covarience ***')
        # # 繪製heatmap
        # plt.figure(figsize=(8, 8))
        # cov_mat = df_before.cov()
        # ax = sns.heatmap(cov_mat, annot=True, cmap='coolwarm')
        # plt.title('Covariance Matrix Before')
        # plt.show()

        # plt.figure(figsize=(8, 8))
        # cov_mat_2 = df_after.cov()
        # ax = sns.heatmap(cov_mat_2, annot=True, cmap='coolwarm')
        # plt.title('Covariance Matrix After')
        # plt.show()
        
        print('\n*** Multi-Collinearity ***')
        print('\n--- Before ---')
        df_vif_before = self.multi_collinearity(df_before)
        print('\n--- After ---')
        df_vif_after = self.multi_collinearity(df_after)
        
        # print('\n*** Pairplot ***')
        # self.pair_plot(df_before, df_after)
        
        
        return_dict = {
            'missingRateTable': missing_rate_df.to_dict(orient='records'),
            'missingRateColumnName': missing_rate_df.columns.to_list(),
            'entropyTable': df_entropy.to_dict(orient='records'),
            'entropyColumnName': df_entropy.columns.to_list(),
            'simplifiedStablilty': simpEntropy,
            'jsDivergenceTable': js_divergence.to_dict(orient='records'),
            'jsDivergenceColumnName': js_divergence.columns.to_list(),
            'basicInfoBeforeTable': df_basic_before.to_dict(orient='records'),
            'basicInfoBeforeColumnName': df_basic_before.columns.to_list(), 
            'basicInfoAfterTable': df_basic_after.to_dict(orient='records'), 
            'basicInfoAfterColumnName': df_basic_after.columns.to_list(), 
            'vifBeforeTable': df_vif_before.to_dict(orient='records'),
            'vifBeforeColumnName': df_vif_before.columns.to_list(), 
            'vifAfterTable': df_vif_after.to_dict(orient='records'),
            'vifAfterColumnName': df_vif_after.columns.to_list(), 
        }

        return return_dict
''' example input:
    con = continuous()
    return_dict = con.comparison(df_mis, df_imp)

'''

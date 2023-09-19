'''
Each query strategy below returns a list of len=query_size with indices of
samples that are to be queried.
- query_size (int): number of samples to be queried for labels (default=20)

'''

import random
import numpy as np
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torch.utils.data.sampler import SubsetRandomSampler

def init_query(query_size=20):
    seed = 44 #隨意選都可
    return list(range(seed, seed + query_size))
    #return list(range(query_size)) #直接給train_df的前面20筆，因為在random_split時已經reset_index過了

def random_query(data_loader, query_size=20):
    sample_idx = []
    # Because the data has already been shuffled inside the data loader,
    # we can simply return the `query_size` first samples from it
    for batch in data_loader:
        _, _, idx = batch
        sample_idx.extend(idx.tolist())
        if len(sample_idx) >= query_size:
            break
    return sample_idx[0:query_size]

def least_confidence_query(model, device, data_loader, query_size=20):
    confidences = []
    indices = []
    model.eval()
    with torch.no_grad():
        for batch in data_loader:
            data, _, idx = batch
            logits = model(data.to(device))
            probabilities = F.softmax(logits, dim=1)

            # Keep only the top class confidence for each sample
            most_probable = torch.max(probabilities, dim=1)[0] #取得最大概率的類別的值
            confidences.extend(most_probable.cpu().tolist())
            indices.extend(idx.tolist())

    conf = np.asarray(confidences)
    ind = np.asarray(indices)
    sorted_pool = np.argsort(conf)
    # Return the indices corresponding to the lowest `query_size` confidences
    return ind[sorted_pool][0:query_size]

def margin_query(model, device, data_loader, query_size=20):
    margins = []
    indices = []
    model.eval()
    with torch.no_grad():
        for batch in data_loader:
            data, _, idx = batch
            logits = model(data.to(device))
            probabilities = F.softmax(logits, dim=1)

            # Select the top two class confidences for each sample
            toptwo = torch.topk(probabilities, 2, dim=1)[0]
            # Compute the margins = differences between the two top confidences
            differences = toptwo[:,0]-toptwo[:,1]
            margins.extend(torch.abs(differences).cpu().tolist())
            indices.extend(idx.tolist())

    margin = np.asarray(margins)
    index = np.asarray(indices)
    sorted_pool = np.argsort(margin)
    # Return the indices corresponding to the lowest `query_size` margins
    return index[sorted_pool][0:query_size]


def query_the_oracle(model, device, dataset, query_size=20, query_strategy='random',
                      pool_size=0, batch_size=32, num_workers=0):

    unlabeled_idx = np.nonzero(dataset.unlabeled_mask)[0]
    # Select a pool of samples to query from
    if pool_size > 0:
        pool_idx = random.sample(range(1, len(unlabeled_idx)), pool_size)
        pool_loader = DataLoader(dataset, batch_size=batch_size, num_workers=num_workers,
                                              sampler=SubsetRandomSampler(unlabeled_idx[pool_idx]))
    else:
        pool_loader = DataLoader(dataset, batch_size=batch_size, num_workers=num_workers,
                                              sampler=SubsetRandomSampler(unlabeled_idx))
    if query_strategy == 'init':
        sample_idx = init_query(query_size)
    elif query_strategy == 'margin':
        sample_idx = margin_query(model, device, pool_loader, query_size)
    elif query_strategy == 'least_confidence':
        sample_idx = least_confidence_query(model, device, pool_loader, query_size)
    else:
        sample_idx = random_query(pool_loader, query_size)
    # 更新哪些unlabeled 被標注
    for sample in sample_idx:
        dataset.update_label_from_idx(sample)

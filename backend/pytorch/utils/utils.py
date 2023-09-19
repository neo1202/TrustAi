def makeModelDir():
    import os

    if not os.path.isdir('./models'):
        os.mkdir('./models')

    return

def connectDevice():
    import torch

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print('Using device:', device)

    return device


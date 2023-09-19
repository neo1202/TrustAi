import torch
import torch.nn as nn

class ComplexModel(nn.Module):
    def __init__(self):
        super(ComplexModel, self).__init__()

        self.linear1 = nn.Linear(16, 216)
        self.act1 = nn.LeakyReLU()
        self.linear2 = nn.Linear(216, 128)
        self.act2 = nn.ReLU()
        self.linear3 = nn.Linear(128, 42)
        self.act3 = nn.ReLU()
        self.linear4 = nn.Linear(42, 7)

        self.dropout = nn.Dropout(0.1)
        self.bn1 = nn.BatchNorm1d(216)
        self.bn2 = nn.BatchNorm1d(84)

    def forward(self, x):
        x = self.act1(self.linear1(x))
        #x = self.bn1(x)
        x = self.dropout(x)
        x = self.act2(self.linear2(x))
        #x = self.bn2(x)
        x = self.dropout(x)
        x = self.act3(self.linear3(x))
        x = self.linear4(x)
        return x

class SimpleModel(nn.Module):
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.linear1 = torch.nn.Linear(16, 42)
        self.linear2 = torch.nn.Linear(42, 7)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.linear1(x)
        x = self.relu(x)
        x = self.linear2(x)
        return x
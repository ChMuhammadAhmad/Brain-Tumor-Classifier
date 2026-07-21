import torch.nn as nn

# CNN Class Architecture

class CNN(nn.Module):
    def __init__(self):
        super (CNN, self).__init__()

        self.conv_layers = nn.Sequential(
            # 1st Layer
            nn.Conv2d(3, 64, kernel_size = 3, padding = 1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            # 2nd Layer
            nn.Conv2d(64, 128, kernel_size = 3, padding = 1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            # 3rd Layer
            nn.Conv2d(128, 256, kernel_size = 3, padding = 1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
        )

        self.fc_layers = nn.Sequential(
            # 1st Layer
            nn.Linear(8*8*256, 128),
            nn.ReLU(),

            # 2nd Layer
            nn.Linear(128, 64),
            nn.ReLU(),

            # 3rd Layer
            nn.Linear(64, 32),
            nn.ReLU(),

            # Output Layer
            nn.Linear(32, 4)
        )

    def forward(self, x):

        x = self.conv_layers(x)
        x = x.view(x.size(0), -1)
        x = self.fc_layers(x)

        return x
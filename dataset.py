from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from torchvision.transforms import transforms

# Getting Train Transforms 

def get_train_transforms():
    return transforms.Compose(
        [
            transforms.Resize((64, 64)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(10),
            transforms.RandomAffine(0),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ]
    )

# Getting Test Transforms

def get_test_transforms():
    return transforms.Compose(
        [
            transforms.Resize((64, 64)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ]
    )

# Getting DataLoaders

def get_data(train_path, test_path, batch_size):

    train_set = ImageFolder(root = train_path, transform = get_train_transforms())
    test_set = ImageFolder(root = test_path, transform = get_test_transforms())

    train_loader = DataLoader(train_set, batch_size = batch_size, shuffle = True, num_workers = 2, pin_memory = True)
    test_loader = DataLoader(test_set, batch_size = batch_size, num_workers = 2, pin_memory = True)

    return {
        "train_loader":train_loader,
        "test_loader":test_loader
    }
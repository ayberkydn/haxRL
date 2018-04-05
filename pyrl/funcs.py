import scipy
import matplotlib.pyplot as plt

def preprocess_state(state):
    assert len(state.shape) == 3
    cropped = state.mean(axis=2, keepdims=True)[40:-20]
    normalized = cropped / 255
    return scipy.misc.imresize(normalized[:,:,0], [84, 84])


def show(image):
    plt.imshow(image)
    plt.show()
    

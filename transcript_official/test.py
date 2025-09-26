import os
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="together",
    api_key=os.environ["HF_TOKEN"],
)

# output is a PIL.Image object
image = client.text_to_image(
    "A fantasy forest with glowing mushrooms",
    model="black-forest-labs/FLUX.1-dev",
)
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("api_key")
genai.configure(api_key=api_key)

print("Listing available models and their supported methods:")
for m in genai.list_models():
    # Only print models that can generate content (includes images, text)
    if "generateContent" in m.supported_generation_methods:
        print(f"Model: {m.name}")
        print(f"  Description: {m.description}")
        print(f"  Supported methods: {m.supported_generation_methods}")
        print(f"  Input features: {m.input_token_limit} tokens, {m.top_k} Top-K, {m.top_p} Top-P")
        print(f"  Output features: {m.output_token_limit} tokens")
        # Check if the model is capable of handling image inputs or outputs
        if 'IMAGE' in m.supported_generation_methods: # This might not be precise for output-only image gen
            print("  *** Potentially an image generation model ***")
        if m.name.startswith('models/gemini'):
            if 'image/png':
                 print("  *** This Gemini model can output images (image/png) ***")
        print("-" * 30)
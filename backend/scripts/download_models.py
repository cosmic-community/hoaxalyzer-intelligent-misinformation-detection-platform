import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from transformers import AutoTokenizer, AutoModelForSequenceClassification

def download_models():
    """Download and cache IndoBERT models."""
    print("Downloading IndoBERT models...")
    
    model_name = "indobenchmark/indobert-base-p1"
    
    try:
        print(f"Downloading tokenizer for {model_name}...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        print(f"Downloading model for {model_name}...")
        model = AutoModelForSequenceClassification.from_pretrained(
            model_name,
            num_labels=3
        )
        
        print("✓ Models downloaded successfully!")
        print(f"Models cached in: {os.path.expanduser('~/.cache/huggingface')}")
    except Exception as e:
        print(f"✗ Error downloading models: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    download_models()
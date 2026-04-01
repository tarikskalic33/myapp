import os
import json
import uuid
import re
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# Configuration for Clean Organization on D:
CORPUS_ROOT = r"D:\02_INTELLIGENCE\ResearchOS\corpus"
DB_PATH = r"D:\02_INTELLIGENCE\ResearchOS\database"
PROCESSED_ROOT = r"D:\02_INTELLIGENCE\ResearchOS\processed"

# Ensure directories exist
os.makedirs(DB_PATH, exist_ok=True)
os.makedirs(PROCESSED_ROOT, exist_ok=True)

# Initialize Qdrant Client in Local Native Mode (Docker-free)
client = QdrantClient(path=DB_PATH)

def get_goldmine_score(text):
    """Calculates the Goldmine Score based on user's requirements."""
    score = 50.0  # Base
    
    # Simple Heuristics for demo (will be refined with LLM synthesis)
    word_count = len(text.split())
    if word_count > 1000: score += 10
    
    headers = len(re.findall(r'^#', text, re.MULTILINE))
    if headers > 5: score += 10
    
    keywords = ["sovereign", "persistence", "compliance", "monetization", "SAGA", "SPSF"]
    for k in keywords:
        if k.lower() in text.lower():
            score += 2
            
    return min(100.0, score)

def process_file(file_path):
    print(f"Processing: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    file_name = os.path.basename(file_path)
    doc_id = str(uuid.uuid4())
    
    # Title extraction
    title_match = re.search(r'^#\s+(.*)$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else file_name
    
    # Semantic Chunking by Headings (Mock embedding for now)
    chunks = re.split(r'(?m)^(?=#+ )', content)
    processed_chunks = []
    
    for i, c in enumerate(chunks):
        if not c.strip(): continue
        processed_chunks.append({
            "chunk_id": f"{doc_id}-{i}",
            "text": c.strip(),
            "metadata": {
                "source": title,
                "section": i
            }
        })
    
    # Metadata for the Master Index
    metadata = {
        "doc_id": doc_id,
        "title": title,
        "path": file_path,
        "goldmine_score": get_goldmine_score(content),
        "timestamp": datetime.now().isoformat()
    }
    
    # Export Metadata and Chunks
    meta_path = os.path.join(PROCESSED_ROOT, "metadata", f"{doc_id}.json")
    chunks_path = os.path.join(PROCESSED_ROOT, "chunks", f"{doc_id}.json")
    
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    with open(chunks_path, "w", encoding="utf-8") as f:
        json.dump(processed_chunks, f, indent=2)
        
    print(f"Ingested: {title} | Score: {metadata['goldmine_score']}")

if __name__ == "__main__":
    from datetime import datetime
    
    # Search for files
    found_files = []
    for root, dirs, files in os.walk(CORPUS_ROOT):
        for file in files:
            if file.endswith(".md"):
                found_files.append(os.path.join(root, file))
    
    if not found_files:
        print("No files found in corpus. Add your research to D:\\ResearchOS\\corpus")
    else:
        for f in found_files:
            process_file(f)

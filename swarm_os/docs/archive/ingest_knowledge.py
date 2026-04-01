import os
import json
import math
import numpy as np
import datetime
from googleapiclient.discovery import build
from google.cloud import storage
import vertexai
from vertexai.language_models import TextEmbeddingModel

# --- CONFIGURATION ---
PROJECT_ID = "lifequestplatinum"
LOCATION = "europe-west1"
LOCAL_SOURCE_DIR = r"D:\03_WORK_PROJECTS\system_rebuild\sources"
DRIVE_FOLDER_ID = "YOUR_DRIVE_FOLDER_ID_HERE"
GCS_BUCKET = "lifequestplatinum_cloudbuild"
GCS_VAULT_PREFIX = "sovereign-vault/"
PHI = 1.618
SIMILARITY_THRESHOLD = 0.70
WEIGHT_FLOOR = 0.236  # Fibonacci retracement floor

# Initialize
vertexai.init(project=PROJECT_ID, location=LOCATION)
embedding_model = TextEmbeddingModel.from_pretrained("text-embedding-004")
storage_client = storage.Client(project=PROJECT_ID)

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def chunk_text(text, chunk_size=512, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    return chunks

def get_drive_files(folder_id):
    service = build('drive', 'v3')
    results = service.files().list(
        q=f"'{folder_id}' in parents and (mimeType='text/plain' or mimeType='application/pdf')",
        spaces='drive',
        fields='files(id, name)'
    ).execute()
    files = results.get('files', [])
    docs = []
    for f in files:
        try:
            request = service.files().get_media(fileId=f['id'])
            content = request.execute().decode('utf-8', errors='ignore')
            docs.append({"source": f['name'], "content": content})
            print(f"[DRIVE] Fetched: {f['name']}")
        except Exception as e:
            print(f"[WARN] Could not fetch {f['name']}: {e}")
    return docs

def log_audit(event_type, details):
    audit_file = os.path.join(".forge", "docs", "audit.jsonl")
    os.makedirs(os.path.dirname(audit_file), exist_ok=True)
    entry = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "type": event_type,
        "details": details
    }
    with open(audit_file, "a") as f:
        f.write(json.dumps(entry) + "\n")

def fibonacci_weight(parent_weight):
    new_weight = round(parent_weight / PHI, 3)
    return max(new_weight, WEIGHT_FLOOR)

def density_from_weight(w):
    if w > 0.90: return "CRITICAL"
    if w > 0.60: return "HIGH"
    return "NOMINAL"

def main():
    print("[SOVEREIGN] Booting Hippocampal Ingestion Engine...")

    # Load knowledge graph
    kg_path = os.path.join(".forge", "knowledge_graph.json")
    with open(kg_path, "r") as f:
        kg = json.load(f)

    # Handle both dict and list node formats
    raw_nodes = kg.get("nodes", {})
    if isinstance(raw_nodes, dict):
        nodes = [
            {
                "id": k,
                "x": v.get("visual_geometry", {}).get("x", 0),
                "y": v.get("visual_geometry", {}).get("y", 0),
                "z": v.get("visual_geometry", {}).get("z", 0),
                "w": v.get("weight", 0.8),
                "density": v.get("semantic_density", "NOMINAL")
            }
            for k, v in raw_nodes.items()
        ]
    else:
        nodes = raw_nodes

    edges = kg.get("edges", [])

    # Embed existing nodes as attractors
    print(f"[SOVEREIGN] Embedding {len(nodes)} existing manifold attractors...")
    node_embeddings = []
    for node in nodes:
        label = node["id"].replace("_", " ")
        try:
            emb = embedding_model.get_embeddings([label])[0].values
            node_embeddings.append({
                "id": node["id"],
                "vector": emb,
                "weight": node.get("w", 0.8)
            })
        except Exception as e:
            print(f"[WARN] Could not embed node {node['id']}: {e}")

    # Collect source texts
    texts = []

    # Local sources
    if os.path.exists(LOCAL_SOURCE_DIR):
        for fname in os.listdir(LOCAL_SOURCE_DIR):
            if fname.endswith(('.md', '.txt')):
                fpath = os.path.join(LOCAL_SOURCE_DIR, fname)
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                    texts.append({"source": fname, "content": f.read()})
                print(f"[LOCAL] Loaded: {fname}")
    else:
        print(f"[WARN] Local source dir not found: {LOCAL_SOURCE_DIR}")

    # Drive sources
    if DRIVE_FOLDER_ID != "YOUR_DRIVE_FOLDER_ID_HERE":
        try:
            drive_docs = get_drive_files(DRIVE_FOLDER_ID)
            texts.extend(drive_docs)
        except Exception as e:
            print(f"[WARN] Drive fetch failed: {e}")
    else:
        print("[INFO] DRIVE_FOLDER_ID not set - skipping Drive fetch")

    if not texts:
        print("[WARN] No source documents found. Add .md or .txt files to sources\ directory.")
        return

    # Process chunks
    new_nodes_added = 0
    for doc in texts:
        chunks = chunk_text(doc["content"])
        print(f"[SOVEREIGN] Processing {doc['source']} -> {len(chunks)} chunks")

        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc['source'][:20].replace(' ','_')}_c{i}"

            try:
                chunk_emb = embedding_model.get_embeddings([chunk])[0].values
            except Exception as e:
                print(f"[WARN] Embedding failed for chunk {i}: {e}")
                continue

            # Find nearest attractor
            best_match = None
            best_sim = -1
            for ne in node_embeddings:
                sim = cosine_similarity(chunk_emb, ne["vector"])
                if sim > best_sim:
                    best_sim = sim
                    best_match = ne

            # Only add if below similarity threshold (novel knowledge)
            if best_sim < SIMILARITY_THRESHOLD and best_match is not None:
                new_weight = fibonacci_weight(best_match["weight"])
                new_node = {
                    "id": chunk_id,
                    "x": round(float(np.random.uniform(-1, 1)), 3),
                    "y": round(float(np.random.uniform(-1, 1)), 3),
                    "z": round(float(np.random.uniform(-1, 1)), 3),
                    "w": new_weight,
                    "density": density_from_weight(new_weight),
                    "parent_attractor": best_match["id"]
                }
                nodes.append(new_node)
                edges.append({
                    "source": best_match["id"],
                    "target": chunk_id,
                    "weight": round(float(best_sim), 3)
                })
                node_embeddings.append({
                    "id": chunk_id,
                    "vector": chunk_emb,
                    "weight": new_weight
                })
                new_nodes_added += 1
                log_audit("KNOWLEDGE_INGESTED", {
                    "node_id": chunk_id,
                    "parent": best_match["id"],
                    "source": doc["source"],
                    "similarity": round(float(best_sim), 3),
                    "fibonacci_weight": new_weight
                })

    # Save updated graph
    kg["nodes"] = nodes
    kg["edges"] = edges
    tmp_path = kg_path + ".tmp"
    with open(tmp_path, "w") as f:
        json.dump(kg, f, indent=2)
    os.replace(tmp_path, kg_path)
    print(f"[SOVEREIGN] Manifold expanded: {new_nodes_added} new nodes via Fibonacci branching")
    print(f"[SOVEREIGN] Total nodes: {len(nodes)} | Total edges: {len(edges)}")

    # Push to GCS vault
    print("[SOVEREIGN] Syncing to GCS vault...")
    bucket = storage_client.bucket(GCS_BUCKET)
    blob = bucket.blob(f"{GCS_VAULT_PREFIX}knowledge_graph.json")
    blob.upload_from_filename(kg_path)
    log_audit("GCS_SYNC", {"file": "knowledge_graph.json", "nodes": len(nodes)})
    print("[SOVEREIGN] Sync complete. Hippocampal expansion successful.")

if __name__ == "__main__":
    main()

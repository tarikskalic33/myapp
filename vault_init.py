import os
import json
import uuid
import re
from datetime import datetime

# Root paths on D: drive for clean organization
VAULT_ROOT = r"D:\02_INTELLIGENCE\ResearchOS\obsidian_vault"
FOLDERS = [
    "00_Index",
    "01_Core_Concepts",
    "02_System_Maps",
    "03_Playbooks",
    "04_Use_Cases",
    "05_Open_Questions"
]

def init_vault():
    print(f"Initializing Obsidian Vault at {VAULT_ROOT}...")
    
    # Create folders
    for folder in FOLDERS:
        path = os.path.join(VAULT_ROOT, folder)
        os.makedirs(path, exist_ok=True)
    
    # Create Master Index
    index_content = f"""# Research Knowledge Engine Index

## Core Pillars
- [[01_Core_Concepts/SAGA_Governance|SAGA Governance]]
- [[01_Core_Concepts/SPSF_Persistence|SPSF Persistence]]
- [[01_Core_Concepts/Monetization_Wedges|Compliance Monetization]]
- [[02_System_Maps/Research_OS_Architecture|System Architecture]]

## System Metadata
- Created: {datetime.now().strftime('%Y-%m-%d')}
- Storage Root: `D:\\ResearchOS`
- Database: Qdrant (Local Native Mode)

## Recent Activity
- [[00_Index/Latest_Findings|Latest Findings]]
"""
    
    index_path = os.path.join(VAULT_ROOT, "00_Index", "Master_Index.md")
    if not os.path.exists(index_path):
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(index_content)
        print(f"Created Master Index at {index_path}")
    else:
        print("Master Index already exists.")

if __name__ == "__main__":
    init_vault()

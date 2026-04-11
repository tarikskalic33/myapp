"""
Sovereign OS — Google Drive Vault Sync
Uploads key state files to Drive folder: sovereign_os_memory
Folder ID: 1mJ2MnIuyYM80_SANuSA6A_4LLI3xp7V2

Auth priority:
  1. Application Default Credentials (gcloud ADC) — zero setup if already authed
  2. OAuth2 browser flow via credentials.json (fallback)

If ADC doesn't have Drive scope, run:
    gcloud auth application-default login --scopes https://www.googleapis.com/auth/drive

Usage:
    pip install google-auth google-auth-oauthlib google-api-python-client
    python gdrive_sync.py                # sync all vault files
    python gdrive_sync.py --verify       # list what's in Drive folder
    python gdrive_sync.py --download     # pull latest from Drive to .forge/
"""

import os, json, sys, argparse, io, hashlib
from pathlib import Path
from datetime import datetime, timezone

# ── CONSTANTS ──────────────────────────────────────────────────────────────────

FOLDER_ID   = "1mJ2MnIuyYM80_SANuSA6A_4LLI3xp7V2"   # sovereign_os_memory
CREDS_FILE  = Path(__file__).parent / "credentials.json"
TOKEN_FILE  = Path(__file__).parent / ".forge" / "gdrive_token.json"
SCOPES      = ["https://www.googleapis.com/auth/drive"]

FORGE_DIR   = Path(__file__).parent / ".forge"
ROOT_DIR    = Path(__file__).parent.parent

# Files to sync — relative to this script's directory
SYNC_FILES = [
    FORGE_DIR / "state.json",
    FORGE_DIR / "knowledge_graph.json",
    FORGE_DIR / "audit.jsonl",
    FORGE_DIR / "homeostasis_metrics.json",
    FORGE_DIR / "cognitive-profile.json",
    ROOT_DIR  / "HANDOFF_V8.md",
    Path(__file__).parent / "arc" / "checkpoints" / "macro_library.json",
]


# ── AUTH ───────────────────────────────────────────────────────────────────────

def get_service():
    """
    Build authenticated Drive service.
    Auth priority:
      1. Application Default Credentials (gcloud ADC) — zero setup
      2. OAuth2 browser flow via credentials.json (fallback)
    """
    try:
        import google.auth
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build
    except ImportError:
        print("[ERROR] Missing dependencies. Run:")
        print("  pip install google-auth google-auth-oauthlib google-api-python-client")
        sys.exit(1)

    # ── Strategy 1: Application Default Credentials ─────────────────────────
    try:
        creds, project = google.auth.default(scopes=SCOPES)
        if creds and creds.valid:
            print(f"[AUTH] Using ADC (project: {project or 'unknown'})")
            return build("drive", "v3", credentials=creds)
        # Try to refresh
        from google.auth.transport.requests import Request as Req
        creds.refresh(Req())
        print(f"[AUTH] ADC refreshed (project: {project or 'unknown'})")
        return build("drive", "v3", credentials=creds)
    except Exception as e:
        err = str(e).lower()
        if "scope" in err or "permission" in err or "unauthorized" in err or "insufficient" in err:
            print("[AUTH] ADC lacks Drive scope.")
            print("  Run setup_gdrive_auth.ps1 (or manually):")
            print('  gcloud auth application-default login --scopes "https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/cloud-platform"')
            print()
        # Fall through to OAuth flow

    # ── Strategy 2: OAuth2 browser flow ─────────────────────────────────────
    try:
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        print("[ERROR] google-auth-oauthlib not installed. Run:")
        print("  pip install google-auth-oauthlib")
        sys.exit(1)

    creds = None

    # Load cached token
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDS_FILE.exists():
                print("\n[ERROR] No valid auth found. Options:")
                print()
                print("  Option A — use existing gcloud auth (recommended):")
                print("    gcloud auth application-default login --scopes https://www.googleapis.com/auth/drive")
                print()
                print("  Option B — OAuth client (credentials.json):")
                print("    1. https://console.cloud.google.com/apis/credentials")
                print("    2. Create OAuth 2.0 Client ID (Desktop app)")
                print("    3. Save as: swarm_os/credentials.json")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
            print("[AUTH] OAuth2 browser flow complete")

        # Cache token
        TOKEN_FILE.parent.mkdir(exist_ok=True)
        TOKEN_FILE.write_text(creds.to_json())

    return build("drive", "v3", credentials=creds)


# ── OPERATIONS ─────────────────────────────────────────────────────────────────

def list_folder(service) -> dict:
    """Return {filename: file_id} for all files in FOLDER_ID."""
    results = service.files().list(
        q=f"'{FOLDER_ID}' in parents and trashed=false",
        fields="files(id, name, modifiedTime, size)",
        pageSize=100,
    ).execute()
    return {f["name"]: f for f in results.get("files", [])}


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def upload_file(service, local_path: Path, existing: dict) -> str:
    """Upload or update a file. Returns 'created' | 'updated' | 'skipped'."""
    from googleapiclient.http import MediaIoBaseUpload

    name    = local_path.name
    content = local_path.read_bytes()

    # Determine MIME type
    if name.endswith(".json") or name.endswith(".jsonl"):
        mime = "application/json"
    elif name.endswith(".md"):
        mime = "text/markdown"
    elif name.endswith(".py"):
        mime = "text/x-python"
    else:
        mime = "application/octet-stream"

    media = MediaIoBaseUpload(io.BytesIO(content), mimetype=mime, resumable=False)

    if name in existing:
        file_id = existing[name]["id"]
        service.files().update(
            fileId=file_id,
            media_body=media,
        ).execute()
        return "updated"
    else:
        file_meta = {"name": name, "parents": [FOLDER_ID]}
        service.files().create(
            body=file_meta,
            media_body=media,
            fields="id",
        ).execute()
        return "created"


def download_file(service, file_id: str, dest: Path) -> None:
    """Download a file from Drive to dest path."""
    from googleapiclient.http import MediaIoBaseDownload

    request = service.files().get_media(fileId=file_id)
    buf = io.BytesIO()
    downloader = MediaIoBaseDownload(buf, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(buf.getvalue())


# ── COMMANDS ───────────────────────────────────────────────────────────────────

def cmd_sync(service):
    print(f"[SYNC] Uploading vault to Drive folder: sovereign_os_memory")
    print(f"       Folder ID: {FOLDER_ID}\n")

    existing = list_folder(service)
    results  = []

    for path in SYNC_FILES:
        if not path.exists():
            print(f"  SKIP  {path.name}  (not found locally)")
            continue
        status = upload_file(service, path, existing)
        size   = path.stat().st_size
        print(f"  {status.upper():8s}  {path.name}  ({size:,} bytes)")
        results.append((path.name, status))

    # Write sync manifest to Drive
    manifest = {
        "synced_at": datetime.now(timezone.utc).isoformat(),
        "files": [{"name": n, "status": s} for n, s in results],
        "folder_id": FOLDER_ID,
    }
    manifest_path = FORGE_DIR / "gdrive_sync_manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2))
    upload_file(service, manifest_path, list_folder(service))

    print(f"\n[SYNC] Done. {len(results)} files synced.")
    print(f"       View: https://drive.google.com/drive/folders/{FOLDER_ID}")


def cmd_verify(service):
    print(f"[VERIFY] Contents of sovereign_os_memory ({FOLDER_ID}):\n")
    existing = list_folder(service)
    if not existing:
        print("  (empty)")
        return
    for name, meta in sorted(existing.items()):
        size = meta.get("size", "?")
        ts   = meta.get("modifiedTime", "?")[:19].replace("T", " ")
        print(f"  {name:40s}  {size:>10s} bytes  modified {ts}")
    print(f"\n  Total: {len(existing)} files")


def cmd_download(service):
    print(f"[DOWNLOAD] Pulling latest from Drive → .forge/\n")
    existing = list_folder(service)

    # Only pull state files (not code)
    PULL_NAMES = {"state.json", "knowledge_graph.json", "homeostasis_metrics.json",
                  "cognitive-profile.json", "macro_library.json"}

    for name, meta in existing.items():
        if name not in PULL_NAMES:
            continue
        if name == "macro_library.json":
            dest = Path(__file__).parent / "arc" / "checkpoints" / name
        else:
            dest = FORGE_DIR / name
        download_file(service, meta["id"], dest)
        print(f"  PULLED  {name}  → {dest}")

    print("\n[DOWNLOAD] Done.")


# ── MAIN ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sovereign OS — GDrive Vault Sync")
    parser.add_argument("--verify",   action="store_true", help="List files in Drive folder")
    parser.add_argument("--download", action="store_true", help="Pull latest from Drive to .forge/")
    args = parser.parse_args()

    service = get_service()

    if args.verify:
        cmd_verify(service)
    elif args.download:
        cmd_download(service)
    else:
        cmd_sync(service)

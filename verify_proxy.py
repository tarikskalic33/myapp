import requests
import json
import os

def verify_proxy():
    url = "http://localhost:8082/v1/messages"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": "freecc"
    }
    
    rules_path = r"d:\03_WORK_PROJECTS\system_rebuild\.agent\rules.md"
    state_path = r"d:\03_WORK_PROJECTS\system_rebuild\.forge\state.json"
    
    with open(rules_path, 'r', encoding='utf-8') as f:
        rules = f.read()
    with open(state_path, 'r', encoding='utf-8') as f:
        state = f.read()
        
    prompt = f"You are an autonomous agent with the following rules:\n{rules}\n\nCurrent project state:\n{state}\n\nTask: Tell me the current project objective based on these files."
    
    payload = {
        "model": "meta/llama-3.3-70b-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 300,
        "stream": True # Must be True for this server
    }
    
    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60, stream=True)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("\nAssistant Response (streaming):")
            full_text = ""
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    if decoded_line.startswith("data: "):
                        data_str = decoded_line[6:]
                        if data_str == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            # Handle different event types in Anthropic stream
                            if data.get("type") == "content_block_delta":
                                delta = data.get("delta", {})
                                if delta.get("type") == "text_delta":
                                    text = delta.get("text", "")
                                    print(text, end="", flush=True)
                                    full_text += text
                        except json.JSONDecodeError:
                            continue
            print("\n\nFull Text Received.")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    verify_proxy()

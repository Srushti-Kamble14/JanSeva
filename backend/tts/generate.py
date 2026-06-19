import edge_tts
import asyncio
import json
import sys
import os

json_file = sys.argv[1]

with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

text = data["text"]
voice = data["voice"]
output = data["output"]

os.makedirs(os.path.dirname(output), exist_ok=True)

async def main():
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output)
        print("Saved:", output)
    except Exception as e:
        print("ERROR:", str(e))

asyncio.run(main())
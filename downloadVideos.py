import requests
import os

module1 = range(347, 356)
module2 = range(356, 363)
module3 = range(363, 371)

authorization_header = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIrOTEwMDAwMTAwMDAxIiwicm9sZSI6InN0dWRlbnQiLCJleHAiOjE3NTY5NDMzNDgsInR5cGUiOiJhY2Nlc3MiLCJzaWQiOiJlM2E4NjI5ZjM1Mjk0Zjg2Yjg1ZmUxZDUxYTM3MGRiYiJ9.O5SSPA55GruTzJtL95s8Su7QaoRTVw5K7hl3tCOEIhQ"

api_url = "https://api.codemitra.org/v4/Course/TopicDownloadUrl"

def fetch_and_download(module_range, module_name):
    headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.5",
        "Authorization": authorization_header,
        "Connection": "keep-alive",
        "Host": "api.codemitra.org",
        "Origin": "https://www.codemitra.org",
        "Priority": "u=0",
        "Referer": "https://www.codemitra.org/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0"
    }

    # Create directory for the module if it doesn't exist
    module_dir = f"module{module_name}"
    os.makedirs(module_dir, exist_ok=True)

    print(f"Downloading videos for Module {module_name}:")
    for topic_id in module_range:
        response = requests.get(api_url, headers=headers, params={"topic_id": topic_id, "res": "hi"})
        if response.status_code >= 200 and response.status_code < 300:
            video_url = response.json().split(' ')[1][1:-2]
            video_response = requests.get(video_url, stream=True)
            if video_response.status_code == 200:
                video_filename = os.path.join(module_dir, f"topic_{topic_id}.mp4")
                with open(video_filename, "wb") as video_file:
                    for chunk in video_response.iter_content(chunk_size=1024):
                        video_file.write(chunk)
            else:
                print(f"Failed to download video for Topic ID {topic_id}: {video_response.status_code}")
        else:
            print(f"Topic ID {topic_id}: Failed with status code {response.status_code}")
            print(f"Response: {response.text}")
            exit()
    print("\n")

fetch_and_download(module1, "1")
fetch_and_download(module2, "2")
fetch_and_download(module3, "3")

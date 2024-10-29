import yt_dlp # type: ignore
import os
import sys
from urllib.parse import urlparse, parse_qs

sounds_dir = os.path.join(os.getcwd(), "..", "upload", "sounds")

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'noplaylist': True,  # Ne télécharge pas les playlists
}

def download_mp3(url):
    video_id = parse_qs(urlparse(url).query)['v'][0]
    ydl_opts['outtmpl'] = os.path.join(sounds_dir, f'{video_id}')

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            mp3_file_path = os.path.join(sounds_dir, f'{video_id}.mp3')
            if os.path.exists(mp3_file_path):  # Vérifie si le fichier mp3 existe déjà
                return f"Téléchargement terminé pour {url} sous le nom {mp3_file_path}"
            else:
                return f"Le fichier audio pour {url} n'a pas été trouvé dans le répertoire de sortie."
    except Exception as e:
        return f"Erreur lors du téléchargement de {url}: {str(e)}"

urls = sys.argv[1:]
results = [download_mp3(url) for url in urls]

for result in results:
    print(result)
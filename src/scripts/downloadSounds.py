import yt_dlp # type: ignore
import os
import sys
import json
from urllib.parse import urlparse, parse_qs

sounds_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../upload/sounds"))

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'noplaylist': True,  # Ne télécharge pas les playlists
    'quiet': True,  # Évite d'afficher les logs de téléchargement
}

def download_mp3(url):
    video_id = parse_qs(urlparse(url).query)['v'][0]
    ydl_opts['outtmpl'] = os.path.join(sounds_dir, f'{video_id}')

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            mp3_file_path = os.path.join(sounds_dir, f'{video_id}.mp3')
            if os.path.exists(mp3_file_path):  # Vérifie si le fichier mp3 existe déjà
                return {'sounds': video_id, 'status': 'success'}
    except Exception as e:
        return {'url': url, 'status': 'error', 'message': str(e)}

urls = sys.argv[1:]
results = [download_mp3(url) for url in urls]

# Filtrer les résultats pour récupérer uniquement les URLs réussies
successful_downloads = [result for result in results if result['status'] == 'success']

# Convertir en JSON et imprimer
print(json.dumps(successful_downloads))
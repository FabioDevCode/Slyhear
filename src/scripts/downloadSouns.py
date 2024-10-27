import yt_dlp # type: ignore
import os
from urllib.parse import urlparse, parse_qs

sounds_dir = os.path.join(os.getcwd(), "..", "upload", "sounds")


# URL de la vidéo YouTube à télécharger
urls = [
	"https://www.youtube.com/watch?v=V62xgYWKnJQ",
	"https://www.youtube.com/watch?v=SL_nGCX4SSs",
	"https://www.youtube.com/watch?v=_81rly0kZTQ",
	"https://www.youtube.com/watch?v=MX8eYdEOU5w"
]

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
    # Récupération de l'identifiant de la vidéo
    video_id = parse_qs(urlparse(url).query)['v'][0]

    # Mise à jour de outtmpl pour utiliser l'identifiant de la vidéo
    ydl_opts['outtmpl'] = os.path.join(sounds_dir, f'{video_id}')

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            # Renommer le fichier après le téléchargement pour ajouter l'extension .mp3
            mp3_file_path = os.path.join(sounds_dir, f'{video_id}.mp3')
            os.rename(os.path.join(sounds_dir, f'{video_id}.m4a'), mp3_file_path)
            print(f"Téléchargement terminé pour {url} sous le nom {mp3_file_path}")
    except Exception as e:
        print(f"Erreur lors du téléchargement de {url}: {str(e)}")

# Télécharger chaque URL
for url in urls:
    download_mp3(url)
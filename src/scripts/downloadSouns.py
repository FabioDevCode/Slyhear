import yt_dlp # type: ignore
import os

sounds_dir = os.path.join(os.getcwd(), "..", "upload", "sounds")


# URL de la vidéo YouTube à télécharger
urls = [
	"https://www.youtube.com/watch?v=V62xgYWKnJQ",
	"https://www.youtube.com/watch?v=SL_nGCX4SSs",
	"https://www.youtube.com/watch?v=_81rly0kZTQ",
	"https://www.youtube.com/watch?v=MX8eYdEOU5w"
]

# Options pour télécharger la vidéo en format audio uniquement (MP3)
ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'outtmpl': os.path.join(sounds_dir, '%(title)s.%(ext)s'),  # Enregistre dans le dossier des sons
    'noplaylist': True,  # Ne télécharge pas les playlists
}

def download_mp3(url):
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            print(f"Téléchargement terminé pour {url}")
    except Exception as e:
        print(f"Erreur lors du téléchargement de {url}: {str(e)}")

# Télécharger chaque URL
for url in urls:
    download_mp3(url)
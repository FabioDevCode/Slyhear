import yt_dlp  # type: ignore
import os

sounds_dir = os.path.join(os.getcwd(), "..", "upload", "music")

urls = [
    "https://www.youtube.com/watch?v=huHDVKR-_NU",
    "https://www.youtube.com/watch?v=-d2lrsJuB0g"
]

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'outtmpl': os.path.join(sounds_dir, '%(title)s.%(ext)s'),
    'noplaylist': True,
}

def download_mp3(url):
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            print(f"Téléchargement terminé pour {url}")
    except Exception as e:
        print(f"Erreur lors du téléchargement de {url}: {str(e)}")

for url in urls:
    download_mp3(url)

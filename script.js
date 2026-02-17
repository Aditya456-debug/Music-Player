const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const fileUpload = document.getElementById('file-upload');
const playlistList = document.getElementById('playlist-list');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const disk = document.getElementById('disk');
const progress = document.getElementById('progress');

// 1. 5 Pre-defined Songs (Source 15, 28)
let playlist = [
    { 
        name: "Lofi Study", 
        artist: "Chill Beats", 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
    },
    { 
        name: "Deep Focus", 
        artist: "Synth Wave", 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
    },
    { 
        name: "Summer Vibes", 
        artist: "Tropical House", 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" 
    },
    { 
        name: "Morning Coffee", 
        artist: "Jazz Cafe", 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
    },
    { 
        name: "Midnight Drive", 
        artist: "Retrowave", 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" 
    }
];

let currentSongIndex = 0;

// Render Playlist UI
function renderPlaylist() {
    playlistList.innerHTML = "";
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-music"></i> ${song.name}`;
        if (index === currentSongIndex) li.classList.add('active');
        li.onclick = () => playSelectedSong(index);
        playlistList.appendChild(li);
    });
}

// Load Song Logic (Source 13, 19)
function loadSong(index) {
    const song = playlist[index];
    audio.src = song.url;
    audio.load(); // Reload audio element with new source
    title.innerText = song.name;
    artist.innerText = song.artist;
    renderPlaylist();
}

// Toggle Play/Pause (Source 16, 40)
function togglePlay(forcePlay = false) {
    if (audio.paused || forcePlay) {
        audio.play().then(() => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            disk.style.animationPlayState = 'running';
        }).catch(err => {
            console.log("Auto-play blocked. Please click the Play button manually.");
        });
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        disk.style.animationPlayState = 'paused';
    }
}

function playSelectedSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    // Play after a short delay to ensure source is ready
    setTimeout(() => togglePlay(true), 150);
}

// Controls (Source 12, 16)
playBtn.addEventListener('click', () => togglePlay());

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSelectedSong(currentSongIndex);
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSelectedSong(currentSongIndex);
});

// Progress Bar & Time Update (Source 12, 16)
audio.addEventListener('timeupdate', () => {
    const value = (audio.currentTime / audio.duration) * 100 || 0;
    progress.value = value;
    
    // Formatting Time
    const curMin = Math.floor(audio.currentTime / 60);
    const curSec = Math.floor(audio.currentTime % 60);
    document.getElementById('current-time').innerText = `${curMin}:${curSec < 10 ? '0'+curSec : curSec}`;
    
    if(audio.duration) {
        const durMin = Math.floor(audio.duration / 60);
        const durSec = Math.floor(audio.duration % 60);
        document.getElementById('duration').innerText = `${durMin}:${durSec < 10 ? '0'+durSec : durSec}`;
    }
});

// Seek Logic (Source 16)
progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// User Upload (Source 15, 28)
fileUpload.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const url = URL.createObjectURL(file);
        playlist.push({ name: file.name, artist: "Local File", url: url });
    });
    renderPlaylist();
});

// Initial Load
loadSong(currentSongIndex);
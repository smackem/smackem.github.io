document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.querySelector('.song-list');
    const audioPlayer = new Audio();
    let currentSongId = null;

    // Fetch song data from JSON
    fetch('assets/songs.json')
        .then(response => response.json())
        .then(songs => {
            renderSongs(songs);
            setupPlayer(songs);
        })
        .catch(error => {
            console.error('Error loading song list:', error);
            if (songListContainer) {
                songListContainer.innerHTML = '<p class="text-center">Error loading songs. Please try again later.</p>';
            }
        });

    /**
     * Renders the song list into the DOM
     * @param {Array} songs 
     */
    function renderSongs(songs) {
        if (!songListContainer) return;
        
        songListContainer.innerHTML = ''; // Clear placeholders

        songs.forEach(song => {
            const songItem = createSongElement(song);
            songListContainer.appendChild(songItem);
        });
    }

    /**
     * Creates a song list item element
     * @param {Object} song 
     * @returns {HTMLElement}
     */
    function createSongElement(song) {
        const li = document.createElement('li');
        li.className = 'song-item flex-wrap'; // Allow wrapping for expansion
        li.id = song.id;

        // Use placeholder images since actual assets might not exist yet
        const imgSrc = `https://placehold.co/90x90/111/eee?text=${encodeURIComponent(song.title)}`;

        li.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <img src="${imgSrc}" alt="${song.title} Cover" class="song-image">
                <span class="song-title">${song.title}</span>
                <button class="btn btn-outline-light btn-sm play-btn" data-song-id="${song.id}">Play</button>
            </div>
            <div class="song-controls mt-3 w-100" style="display: none;">
                <p class="song-description small text-muted">${song.description}</p>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-light pause-btn">Pause</button>
                    <button class="btn btn-sm btn-danger stop-btn">Stop</button>
                    <input type="range" class="form-range flex-grow-1 seek-slider" min="0" max="100" value="0">
                    <input type="range" class="form-range volume-slider" style="width: 80px;" min="0" max="1" step="0.01" value="0.8">
                </div>
            </div>
        `;

        return li;
    }

    /**
     * Sets up the audio player logic
     * @param {Array} songs 
     */
    function setupPlayer(songs) {
        const songItems = document.querySelectorAll('.song-item');

        songItems.forEach(item => {
            const playBtn = item.querySelector('.play-btn');
            const pauseBtn = item.querySelector('.pause-btn');
            const stopBtn = item.querySelector('.stop-btn');
            const seekSlider = item.querySelector('.seek-slider');
            const volumeSlider = item.querySelector('.volume-slider');
            const songId = item.id;
            const songData = songs.find(s => s.id === songId);

            playBtn.addEventListener('click', () => {
                if (currentSongId === songId) {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                        playBtn.textContent = 'Playing...';
                    }
                } else {
                    playSong(songData);
                }
            });

            pauseBtn.addEventListener('click', () => {
                audioPlayer.pause();
                playBtn.textContent = 'Play';
            });

            stopBtn.addEventListener('click', () => {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                playBtn.textContent = 'Play';
                collapseSong(songId);
                currentSongId = null;
            });

            seekSlider.addEventListener('input', () => {
                const time = (seekSlider.value / 100) * audioPlayer.duration;
                audioPlayer.currentTime = time;
            });

            volumeSlider.addEventListener('input', () => {
                audioPlayer.volume = volumeSlider.value;
            });
        });

        // Update seek slider as song plays
        audioPlayer.addEventListener('timeupdate', () => {
            if (currentSongId) {
                const currentItem = document.getElementById(currentSongId);
                const seekSlider = currentItem.querySelector('.seek-slider');
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                seekSlider.value = progress || 0;
            }
        });

        // Auto-advance to next song
        audioPlayer.addEventListener('ended', () => {
            const currentIndex = songs.findIndex(s => s.id === currentSongId);
            const nextIndex = (currentIndex + 1) % songs.length;
            playSong(songs[nextIndex]);
        });
    }

    /**
     * Plays a specific song and expands its UI
     * @param {Object} songData 
     */
    function playSong(songData) {
        if (currentSongId) {
            collapseSong(currentSongId);
            const prevPlayBtn = document.querySelector(`#${currentSongId} .play-btn`);
            if (prevPlayBtn) prevPlayBtn.textContent = 'Play';
        }

        currentSongId = songData.id;
        audioPlayer.src = songData.audio;
        audioPlayer.play().catch(e => console.warn('Playback failed (probably no file yet):', e));

        expandSong(currentSongId);
        const playBtn = document.querySelector(`#${currentSongId} .play-btn`);
        if (playBtn) playBtn.textContent = 'Playing...';
    }

    function expandSong(id) {
        const item = document.getElementById(id);
        const controls = item.querySelector('.song-controls');
        item.classList.add('selected');
        controls.style.display = 'block';
    }

    function collapseSong(id) {
        const item = document.getElementById(id);
        const controls = item.querySelector('.song-controls');
        item.classList.remove('selected');
        controls.style.display = 'none';
    }
});

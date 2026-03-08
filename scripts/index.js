document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.querySelector('.song-list');
    const audioPlayer = new Audio();
    let currentSongId = null;

    // Fetch song data from JSON
    fetch('songs.json')
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

        const imgSrc = song.image;

        li.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <img src="${imgSrc}" alt="${song.title} Cover" class="song-image" width="90" height="90">
                <span class="song-title">${song.title}</span>
                <button class="btn btn-outline-light btn-sm play-btn" data-song-id="${song.id}">Play</button>
            </div>
            <div class="song-controls w-100">
                <p class="song-description small text-secondary">${song.description}</p>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-light pause-btn">Pause</button>
                    <button class="btn btn-sm btn-danger stop-btn">Stop</button>
                    <input type="range" class="form-range flex-grow-1 seek-slider" min="0" max="100" step="any" value="0">
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
        const footerVolume = document.getElementById('footer-volume');
        const volumeIcon = document.querySelector('.volume-icon');
        const currentSongInfo = document.getElementById('current-song-info');

        // Initial volume
        audioPlayer.volume = footerVolume.value;
        updateVolumeIcon(footerVolume.value);

        songItems.forEach(item => {
            const playBtn = item.querySelector('.play-btn');
            const pauseBtn = item.querySelector('.pause-btn');
            const stopBtn = item.querySelector('.stop-btn');
            const seekSlider = item.querySelector('.seek-slider');
            const songId = item.id;
            const songData = songs.find(s => s.id === songId);

            playBtn.addEventListener('click', () => {
                if (currentSongId === songId) {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                    } else {
                        audioPlayer.pause();
                    }
                } else {
                    playSong(songData);
                }
            });

            // Handle clicking the image to play/pause
            const songImg = item.querySelector('.song-image');
            songImg.style.cursor = 'pointer';
            songImg.addEventListener('click', () => {
                if (currentSongId === songId) {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                    } else {
                        audioPlayer.pause();
                    }
                } else {
                    playSong(songData);
                }
            });

            pauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                audioPlayer.pause();
            });

            stopBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                stopPlayback();
            });

            seekSlider.addEventListener('input', () => {
                if (audioPlayer.duration) {
                    const time = (seekSlider.value / 100) * audioPlayer.duration;
                    audioPlayer.currentTime = time;
                }
            });
        });

        // Footer volume control
        footerVolume.addEventListener('input', () => {
            const volume = parseFloat(footerVolume.value);
            audioPlayer.volume = volume;
            updateVolumeIcon(volume);
        });

        /**
         * Updates the volume icon based on volume level
         * @param {number} volume 
         */
        function updateVolumeIcon(volume) {
            if (!volumeIcon) return;
            volumeIcon.className = 'volume-icon bi';
            if (volume === 0) {
                volumeIcon.classList.add('bi-volume-mute-fill');
            } else if (volume < 0.5) {
                volumeIcon.classList.add('bi-volume-down-fill');
            } else {
                volumeIcon.classList.add('bi-volume-up-fill');
            }
        }

        // Update seek slider smoothly
        function updateProgress() {
            if (currentSongId && !audioPlayer.paused) {
                const currentItem = document.getElementById(currentSongId);
                const seekSlider = currentItem ? currentItem.querySelector('.seek-slider') : null;
                if (seekSlider && audioPlayer.duration) {
                    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                    seekSlider.value = progress;
                }
            }
            requestAnimationFrame(updateProgress);
        }
        requestAnimationFrame(updateProgress);

        audioPlayer.addEventListener('play', () => {
            updateUIState();
            const songData = songs.find(s => s.id === currentSongId);
            if (songData) {
                currentSongInfo.textContent = `Playing: ${songData.title}`;
                currentSongInfo.classList.remove('text-muted');
                currentSongInfo.classList.add('text-light');
            }
        });

        audioPlayer.addEventListener('pause', () => {
            updateUIState();
            const songData = songs.find(s => s.id === currentSongId);
            if (songData) {
                currentSongInfo.textContent = `Paused: ${songData.title}`;
            }
        });

        // Auto-advance to next song
        audioPlayer.addEventListener('ended', () => {
            const currentIndex = songs.findIndex(s => s.id === currentSongId);
            const nextIndex = (currentIndex + 1) % songs.length;
            playSong(songs[nextIndex]);
        });
    }

    function playSong(songData) {
        if (currentSongId) {
            collapseSong(currentSongId);
        }
        currentSongId = songData.id;
        audioPlayer.src = songData.audio;
        audioPlayer.play();
        expandSong(currentSongId);
        updateUIState();
    }

    function updateUIState() {
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach(item => {
            const playBtn = item.querySelector('.play-btn');
            const songId = item.id;

            if (songId === currentSongId) {
                if (audioPlayer.paused) {
                    playBtn.textContent = 'Paused';
                } else {
                    playBtn.textContent = 'Playing...';
                }
            } else {
                playBtn.textContent = 'Play';
            }
        });
    }

    function stopPlayback() {
        if (currentSongId) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            collapseSong(currentSongId);
            currentSongId = null;
            updateUIState();
            const currentSongInfo = document.getElementById('current-song-info');
            currentSongInfo.textContent = 'Player idle';
            currentSongInfo.classList.remove('text-muted');
            currentSongInfo.classList.add('text-light');
        }
    }

    function expandSong(id) {
        const item = document.getElementById(id);
        if (item) item.classList.add('selected');
    }

    function collapseSong(id) {
        const item = document.getElementById(id);
        if (item) item.classList.remove('selected');
    }
});

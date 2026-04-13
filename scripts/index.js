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
                <img src="${imgSrc}" alt="${song.title} Cover" class="song-image" width="140" height="140" loading="lazy">
                <span class="song-title">${song.title}</span>
                <div class="ms-auto d-flex gap-1">
                    <button class="btn btn-outline-light btn-sm share-btn" data-song-id="${song.id}" title="Copy Link to Song">
                        <i class="bi bi-link-45deg"></i>
                    </button>
                    <button class="btn btn-outline-light btn-sm play-btn" data-song-id="${song.id}" title="Play/Pause">
                        <i class="bi bi-play-fill"></i>
                    </button>
                </div>
            </div>
            <div class="song-controls w-100">
                <p class="song-description small text-secondary">${song.description}</p>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-light simple-play-btn" title="Play">
                        <i class="bi bi-play-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-light next-btn" title="Next Song">
                        <i class="bi bi-skip-forward-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-danger stop-btn" title="Stop">
                        <i class="bi bi-stop-fill"></i>
                    </button>
                    <span class="song-time small">0:00</span>
                    <input type="range" class="form-range flex-grow-1 seek-slider" min="0" max="100" step="any" value="0">
                    <span class="song-duration small">-0:00</span>
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
        const volumeControl = footerVolume ? footerVolume.closest('.d-flex') : null;

        // Check if device is iOS (where volume is read-only via JS)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS && volumeControl) {
            volumeControl.style.display = 'none'; // Hide volume control on iOS
        }

        // Handle URL hash on load
        handleHash(songs);

        // Listen for hash changes
        window.addEventListener('hashchange', () => handleHash(songs));

        // Load saved volume or default to 0.8
        const savedVolume = localStorage.getItem('player-volume');
        const initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.8;
        footerVolume.value = initialVolume;
        audioPlayer.volume = initialVolume;
        updateVolumeIcon(initialVolume);

        songItems.forEach(item => {
            const playBtn = item.querySelector('.play-btn');
            const shareBtn = item.querySelector('.share-btn');
            const simplePlayBtn = item.querySelector('.simple-play-btn');
            const nextBtn = item.querySelector('.next-btn');
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

            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = new URL(window.location.href);
                url.hash = songId;
                navigator.clipboard.writeText(url.href).then(() => {
                    const icon = shareBtn.querySelector('i');
                    icon.className = 'bi bi-check2';
                    setTimeout(() => {
                        icon.className = 'bi bi-link-45deg';
                    }, 2000);
                });
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

            simplePlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
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

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentIndex = songs.findIndex(s => s.id === songId);
                const nextIndex = (currentIndex + 1) % songs.length;
                playSong(songs[nextIndex]);
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
            localStorage.setItem('player-volume', volume);
        });

        // Global spacebar listener for play/pause
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                // Don't trigger if user is typing in an input or textarea
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }

                e.preventDefault(); // Prevent page scroll
                
                if (currentSongId) {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                    } else {
                        audioPlayer.pause();
                    }
                } else if (songs.length > 0) {
                    // If no song is selected/playing, play the first one
                    playSong(songs[0]);
                }
            }
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

        // Update seek slider and time labels smoothly
        function updateProgress() {
            if (currentSongId) {
                const currentItem = document.getElementById(currentSongId);
                const seekSlider = currentItem ? currentItem.querySelector('.seek-slider') : null;
                const timeLabel = currentItem ? currentItem.querySelector('.song-time') : null;
                const durationLabel = currentItem ? currentItem.querySelector('.song-duration') : null;

                if (audioPlayer.duration) {
                    if (!audioPlayer.paused) {
                        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                        if (seekSlider) seekSlider.value = progress;
                    }
                    if (timeLabel) timeLabel.textContent = formatTime(audioPlayer.currentTime);
                    if (durationLabel) {
                        const remaining = audioPlayer.duration - audioPlayer.currentTime;
                        durationLabel.textContent = `-${formatTime(remaining)}`;
                    }
                }
            }
            requestAnimationFrame(updateProgress);
        }
        requestAnimationFrame(updateProgress);

        /**
         * Formats seconds into MM:SS
         * @param {number} seconds 
         * @returns {string}
         */
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

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
            if (currentIndex < songs.length - 1) {
                playSong(songs[currentIndex + 1]);
            } else {
                stopPlayback();
            }
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
            const simplePlayBtn = item.querySelector('.simple-play-btn');
            const songId = item.id;

            if (songId === currentSongId) {
                if (audioPlayer.paused) {
                    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
                    playBtn.classList.remove('active');
                    simplePlayBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
                    simplePlayBtn.classList.remove('playing');
                } else {
                    // playBtn is hidden when active via CSS
                    playBtn.classList.add('active');
                    simplePlayBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                    simplePlayBtn.classList.add('playing');
                }
            } else {
                playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
                playBtn.classList.remove('active');
                simplePlayBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
                simplePlayBtn.classList.remove('playing');
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

    /**
     * Handles the URL hash to play a specific song
     * @param {Array} songs 
     */
    function handleHash(songs) {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const song = songs.find(s => s.id === hash);
            if (song) {
                // We use a small timeout to ensure the DOM is fully ready and scroll into view works
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    if (currentSongId !== hash) {
                        playSong(song);
                    }
                }, 300);
            }
        }
    }
});

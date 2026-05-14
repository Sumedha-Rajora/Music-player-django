// Function to convert "00:17.87" to seconds
function timeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':').map(parseFloat);
    if (parts.length === 2) {
        return (parts[0] * 60) + parts[1];
    }
    return parts[0] || 0;
}

var audioPlayer = {
    init: function() {
        var $that = this;
        $(function() {
            $that.components.media();
        });
    },

    components: {
        media: function(target) {
            var media = $('audio.fc-media', (target !== undefined) ? target : 'body');

            if (media.length) {
                media.mediaelementplayer({
                    audioHeight: 40,
                    features: ['playpause', 'current', 'duration', 'progress', 'volume', 'tracks', 'fullscreen'],
                    alwaysShowControls: true,
                    timeAndDurationSeparator: '<span></span>',
                    success: function(mediaElement, originalNode) {
                        // Start syncing once the player is ready
                        const lyricsContainer = document.getElementById('song-lyrics');
                        const lyricsScript = document.getElementById('lyrics-data');
                        
                        if (!lyricsContainer || !lyricsScript) return;

                        let lyricsData = [];
                        try {
                            // Parse the data from the json_script tag
                            lyricsData = JSON.parse(lyricsScript.textContent);
                            // If it's a double-string, parse it again
                            if (typeof lyricsData === 'string') {
                                lyricsData = JSON.parse(lyricsData);
                            }
                        } catch (e) {
                            console.error("Lyrics data error:", e);
                        }

                        mediaElement.addEventListener('timeupdate', function() {
                            const currentTime = mediaElement.currentTime;
                            let activeLyric = "";

                            // Ensure lyricsData exists and is an array before checking length
                            if (lyricsData && Array.isArray(lyricsData)) {
                                for (let i = 0; i < lyricsData.length; i++) {
                                    if (currentTime >= timeToSeconds(lyricsData[i].time)) {
                                        activeLyric = lyricsData[i].lyrics;
                                    } else {
                                        break;
                                    }
                                }
                            }

                            if (lyricsContainer.innerText !== activeLyric) {
                                lyricsContainer.innerText = activeLyric;
                            }
                        });
                    }
                });
            }
        },
    },
};

audioPlayer.init();
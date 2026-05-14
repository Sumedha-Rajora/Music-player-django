/**
 * 1. Helper function defined at the TOP to avoid "ReferenceError"
 */
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
                        
                        // 2. Locate the lyrics data safely
                        const lyricsContainer = document.getElementById('song-lyrics');
                        const lyricsScript = document.getElementById('lyrics-data');
                        
                        if (!lyricsContainer || !lyricsScript) {
                            console.warn("Lyrics components not found in HTML.");
                            return;
                        }

                        let lyricsData = null;
                        try {
                            // Parse data from the json_script tag
                            const content = lyricsScript.textContent;
                            lyricsData = JSON.parse(content);
                            
                            // Handle double-encoding if it exists
                            if (typeof lyricsData === 'string') {
                                lyricsData = JSON.parse(lyricsData);
                            }
                        } catch (e) {
                            console.error("Failed to parse lyrics JSON:", e);
                        }

                        // 3. Sync lyrics on timeupdate
                        mediaElement.addEventListener('timeupdate', function() {
                            const currentTime = mediaElement.currentTime;
                            let activeLyric = " ";

                            // CRITICAL FIX: Check if lyricsData is actually an array before checking .length
                            if (lyricsData && Array.isArray(lyricsData) && lyricsData.length > 0) {
                                for (let i = 0; i < lyricsData.length; i++) {
                                    if (currentTime >= timeToSeconds(lyricsData[i].time)) {
                                        activeLyric = lyricsData[i].lyrics;
                                    } else {
                                        break;
                                    }
                                }
                            }

                            // Update the UI
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
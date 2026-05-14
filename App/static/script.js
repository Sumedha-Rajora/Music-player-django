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
                    features: [
                        'playpause',
                        'current',
                        'duration',
                        'progress',
                        'volume',
                        'tracks',
                        'fullscreen'
                    ],
                    alwaysShowControls: true,
                    timeAndDurationSeparator: '<span></span>',
                    iPadUseNativeControls: true,
                    iPhoneUseNativeControls: true,
                    AndroidUseNativeControls: true,
                    // Success callback to ensure we can sync lyrics once player is ready
                    success: function(mediaElement, originalNode) {
                        syncLyrics(mediaElement);
                    }
                });
            }
        },
    },
};

audioPlayer.init();

/**
 * Cleaned up Lyric Sync Logic
 * This replaces the "split('\n')" logic which was causing the JSON code to show
 */
function syncLyrics(mediaElement) {
    const lyricsContainer = document.getElementById('song-lyrics');
    if (!lyricsContainer) return;

    let lyricsData = [];
    try {
        // Retrieve the data attribute
        const rawData = lyricsContainer.getAttribute('data-lyrics');
        // Parse the JSON string (this fixes the \u0022 issue)
        lyricsData = JSON.parse(rawData);
    } catch (e) {
        console.warn("Lyrics data is not valid JSON or is empty.");
        return;
    }

    // Listen for time updates from the MediaElement player
    mediaElement.addEventListener('timeupdate', function() {
        const currentTime = mediaElement.currentTime;
        let activeLyric = "";

        // Find the line that matches the current time
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= timeToSeconds(lyricsData[i].time)) {
                activeLyric = lyricsData[i].lyrics;
            } else {
                break;
            }
        }

        // Update display if the lyric has changed
        if (lyricsContainer.innerText !== activeLyric) {
            lyricsContainer.innerText = activeLyric;
        }
    });
}

function timeToSeconds(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(parseFloat);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1]; // MM:SS
    }
    return parts[0]; // Seconds only
}
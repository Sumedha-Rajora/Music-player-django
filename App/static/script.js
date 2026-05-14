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
                    iPadUseNativeControls: true,
                    iPhoneUseNativeControls: true,
                    AndroidUseNativeControls: true,
                    success: function(mediaElement, originalNode) {
                        syncLyrics(mediaElement);
                    }
                });
            }
        },
    },
};

audioPlayer.init();
function syncLyrics(mediaElement) {
    const lyricsContainer = document.getElementById('song-lyrics');
    const lyricsScript = document.getElementById('lyrics-data');
    
    if (!lyricsContainer || !lyricsScript) {
        console.warn("Lyrics elements missing");
        return;
    }

    let lyricsData = [];
    try {
        // This helper method automatically handles the \u000D and formatting
        lyricsData = JSON.parse(lyricsScript.textContent);
        
        // If the data is still a string (double encoded), parse it once more
        if (typeof lyricsData === 'string') {
            lyricsData = JSON.parse(lyricsData);
        }
    } catch (e) {
        console.error("Final JSON Parse Error:", e);
        return;
    }

    mediaElement.addEventListener('timeupdate', function() {
        const currentTime = mediaElement.currentTime;
        let activeLyric = "";

        if (Array.isArray(lyricsData)) {
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
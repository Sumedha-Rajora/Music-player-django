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
    if (!lyricsContainer) return;

    let lyricsData = [];
    try {
        // 1. Get the raw data from the attribute
        let rawData = lyricsContainer.getAttribute('data-lyrics');

        // 2. Double-parsing logic: Handles strings escaped by Django's escapejs
        // We wrap it in quotes and parse it to resolve Unicode/escaped characters first
        const cleanJSONString = JSON.parse('"' + rawData + '"');
        lyricsData = JSON.parse(cleanJSONString);
        
    } catch (e) {
        console.error("JSON Parsing Error at position:", e.message);
        return;
    }

    mediaElement.addEventListener('timeupdate', function() {
        const currentTime = mediaElement.currentTime;
        let activeLyric = "";

        // Check if lyricsData is an array before looping
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

function timeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':').map(parseFloat);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
}
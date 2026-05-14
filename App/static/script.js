var audio = {
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
                    features : [
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
                    AndroidUseNativeControls: true
                });
            }
        },
    },
};

audio.init();

let lyrics = [];

let lyricsElement = document.getElementById("song-lyrics");

if (lyricsElement) {

    let rawLyrics = lyricsElement.getAttribute("data-lyrics");

    if (rawLyrics && rawLyrics.trim() !== "") {

        lyrics = rawLyrics.split("\n");

        console.log(lyrics);

        document.getElementById("song-lyrics").innerHTML =
            lyrics.join("<br>");

    } else {

        console.warn("Lyrics are empty");

    }

} else {

    console.warn("Lyrics element not found");

}
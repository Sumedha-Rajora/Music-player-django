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
                    features : ['playpause', 'current', 'duration', 'progress', 'volume', 'tracks', 'fullscreen'],
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

try {
    let rawLyrics = `{{ song.lyrics|escapejs }}`;

    if (rawLyrics && rawLyrics.trim() !== "") {
        lyrics = JSON.parse(rawLyrics);
    } else {
        console.warn("Lyrics are empty");
    }
} catch (error) {
    console.error("Invalid JSON format in lyrics:", error);
}


    

    
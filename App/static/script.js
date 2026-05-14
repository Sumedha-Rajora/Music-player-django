var audioPlayer = document.querySelector("audio");
var lyricsContainer = document.getElementById("song-lyrics");

let lyrics = [];

if (lyricsContainer) {

    let rawLyrics = lyricsContainer.getAttribute("data-lyrics");

    if (rawLyrics && rawLyrics.trim() !== "") {

        let lines = rawLyrics.split("\n");

        lines.forEach(line => {

            let match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);

            if (match) {

                let minutes = parseInt(match[1]);
                let seconds = parseFloat(match[2]);

                lyrics.push({
                    time: minutes * 60 + seconds,
                    text: match[3].trim()
                });
            }
        });

        console.log(lyrics);

    }
}

if (audioPlayer) {

    audioPlayer.addEventListener("timeupdate", function () {

        let currentTime = audioPlayer.currentTime;

        for (let i = 0; i < lyrics.length; i++) {

            if (
                currentTime >= lyrics[i].time &&
                (
                    i === lyrics.length - 1 ||
                    currentTime < lyrics[i + 1].time
                )
            ) {

                lyricsContainer.innerHTML = lyrics[i].text;
                break;
            }
        }
    });
}
console.log("lets write JavaScript")
let current_song = new Audio()
let pressed = null
let songs
let currfolder

function convertSecondsToMinSec(seconds) {
    if (isNaN(seconds)) {
        return "00:00"
    }

    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;

    secs = secs < 10 ? "0" + secs : secs;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${minutes}:${secs}`;
}

async function GetSongs(folder) {
    currfolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response

    songs = []
    let as = div.getElementsByTagName("a")
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].split(".")[0])
        }
    }

    // Show all the songs in the PlayList 
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +
            `<li class="card-design item-center" >
                <img class="invert" src="img/music.svg" alt="music">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>                                
                </div>
                <img class="invert playBtn-design" src="img/play2.svg" alt="play">
            </li>`
    }

    // Attact an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

            if (play.src = "img/play2.svg") {
                play.src = "img/pause.svg"
            } else {
                play.src = "img/pause.svg"
            }
            document.querySelector(".left").style.left = "-110%"
            // Pressed Logic    
            document.querySelectorAll(".songList li").forEach(li => {
                li.style.border = "3px solid transparent";
            });

            e.style.border = "3px solid white"
            pressed = e
        })
        document.querySelector(".songList ul").firstElementChild.style.border = "3px solid white"
    })

    return songs
}

const playMusic = (track, pause = false) => {
    current_song.src = `/${currfolder}/` + track + ".mp3"
    if (!pause) {
        current_song.play()
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function main() {
    // Get all the songs
    songs = await GetSongs("songs/ncs")

    // Default song login
    playMusic(songs[0], true)

    // Attact a event listener to previous, play and next
    play.addEventListener("click", () => {
        if (current_song.paused) {
            current_song.play()
            play.src = "img/pause.svg"
        } else {
            current_song.pause()
            play.src = "img/play2.svg"
        }
    })

    document.addEventListener("keydown", function (event) {
        if (event.code === "Space" && current_song.paused) {
            current_song.play()
            play.src = "img/pause.svg"
        } else {
            current_song.pause()
            play.src = "img/play2.svg"
        }
        event.preventDefault()
    })

    // Listen for timeupdate event
    current_song.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${convertSecondsToMinSec(Math.round(current_song.currentTime))} / ${convertSecondsToMinSec(Math.round(current_song.duration))}`
        document.querySelector(".circle").style.left = (current_song.currentTime / current_song.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        current_song.currentTime = (current_song.duration * percent) / 100
    })

    // Add an event listener to hambuger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })

    // Add an event listener to close 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(current_song.src.split(`/${currfolder}/`)[1].split(".")[0])
        if ((index - 1) >= 0) {
            play.src = "img/pause.svg"
            playMusic(songs[index - 1])
            document.querySelectorAll(".songList li").forEach(li => li.style.border = "3px solid transparent");
            document.querySelectorAll(".songList li")[index - 1].style.border = "3px solid white";
        } else {
            play.src = "img/pause.svg"
            playMusic(songs[0])
            document.querySelectorAll(".songList li").forEach(li => li.style.border = "3px solid transparent");
            document.querySelectorAll(".songList li")[0].style.border = "3px solid white";
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        let index = songs.indexOf(current_song.src.split(`/${currfolder}/`)[1].split(".")[0])
        if ((index + 1) < songs.length) {
            play.src = "img/pause.svg"
            playMusic(songs[index + 1])
            document.querySelectorAll(".songList li").forEach(li => li.style.border = "3px solid transparent");
            document.querySelectorAll(".songList li")[index + 1].style.border = "3px solid white";
        } else {
            playMusic(songs[0])
            document.querySelectorAll(".songList li").forEach(li => li.style.border = "3px solid transparent");
            document.querySelectorAll(".songList li")[0].style.border = "3px solid white";
        }
    })

    // Add an event listener when the song ends
    current_song.addEventListener("ended", () => {
        let index = songs.indexOf(current_song.src.split(`/${currfolder}/`)[1].split(".")[0])
        if ((index + 1) < songs.length) {
            play.src = "img/pause.svg"
            playMusic(songs[index + 1])
            document.querySelectorAll(".songList li").forEach(li => li.style.border = "3px solid transparent");
            document.querySelectorAll(".songList li")[index + 1].style.border = "3px solid white";
        } else {
            playMusic(songs[0])
            document.querySelectorAll(".songList li").forEach(li => li.style.border = "3px solid transparent");
            document.querySelectorAll(".songList li")[0].style.border = "3px solid white";
        }
    })

    // Load the Playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await GetSongs(`songs/${item.currentTarget.dataset.folder}`)
            document.querySelector(".left").style.left = "0%"
        })
    });
}

main()

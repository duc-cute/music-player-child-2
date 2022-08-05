/*
1.Render Song =>OK
2.Scroll top =>OK
3.Play /pause/peek =>OK
4.CD rotate =>OK
5.Next/prev =>OK
6.Random =>Ok
7.Next/Repeat When ended
8.Active song
9.Scroll active song into view
10.Play song onclick
*/

const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

    const cd=$('.cd');
    const playList=$('.playlist');
    const heading=$('.music__playing-name');
    const cdThumb=$('.cd-thumb');
    const audio=$('#audio');
    const player=$('.player');
    const playBtn=$('.btn-toggle-play');
    const progress=$('.progress');
    const nextBtn=$('.btn-next');
    const prevBtn=$('.btn-prev');
    const randomBtn=$('.btn-random');
    const repeatBtn=$('.btn-repeat');

//
const app= {
    currentSongIndex:0,
    isPlaying:false,
    isRandomSong:false,
    isRepeat:false,
    listSongPlayed:[],
    songs :[
        {
            name:'Tiếng pháo tiễn người',
            singer:'Hùng Quân',
            path:'./asset/music/song1.mp3',
            image:'./img/song1.jpg'

        },
        {
            name:'Em hát ai nghe',
            singer:'Orange',
            path:'./asset/music/song2.mp3',
            image:'./img/song2.jpg'
            
        },
        {
            name:'Là do em xui thôi',
            singer:'SOFIA',
            path:'./asset/music/song3.mp3',
            image:'./img/song3.jpg'

        },
        {
            name:'3107-2',
            singer:'DuongG-Nâu',
            path:'./asset/music/song4.mp3',
            image:'./img/song4.jpg'

        },
        {
            name:'Cao ốc 20',
            singer:'Bray if Masew',
            path:'./asset/music/song5.mp3',
            image:'./img/song5.jpg'

        },
        {
            name:'Xin',
            singer:'Bray ,Đạt G,Masew',
            path:'./asset/music/song6.mp3',
            image:'./img/song6.jpg'

        },
        {
            name:'Nếu như là định mệnh',
            singer:'Hoài Lâm x BinZ',
            path:'./asset/music/song7.mp3',
            image:'./img/song7.jpg'

        },
        {
            name:'Tháng 7 của anh',
            singer:'Khói if Masew',
            path:'./asset/music/song8.mp3',
            image:'./img/song8.jpg'

        }

    ],
    render: function() {
        const htmls=this.songs.map((song,index) => {
            return `
                <div data-index="${index}" class="song ${index === this.currentSongIndex ? 'active' : ''}">
                    <div class="thumb" style="background-image:url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option"><i class="fa-solid fa-ellipsis"></i></div>
                </div>
            `
        })
        playList.innerHTML=htmls.join('')
    },
    activeSong:function() {
        const listSongPlay=$$('.song');
        listSongPlay.forEach(function(song,index) {
            if(app.currentSongIndex===index) {
                $('.song.active').classList.remove('active');
                song.classList.add('active');
            }
        })
           
        
    },
    handleEvents: function() {
        _this=this;
        //Play bài hát
       playBtn.onclick=function() {
            if(_this.isPlaying) {
                audio.pause();
            }else {
                audio.play();
            }
       }
        //Khi song được play
        audio.onplay=function() {
            _this.isPlaying=true;
            player.classList.add('playing');
            csThumbAnimate.play();
            
            
            
        }
        //Khi song bị pause
        audio.onpause=function() {
            _this.isPlaying=false;
            player.classList.remove('playing');
            csThumbAnimate.pause();

        }
        
        // Xử lí thu/phóng CD
        const cdWidth=cd.offsetWidth;
        document.onscroll=function() {
            const scrollTop=window.scrollY || document.documentElement.scrollTop;
            const newCdWidth=cdWidth-scrollTop;
            cd.style.width=newCdWidth > 0 ? newCdWidth +'px' : 0;
            cd.style.opacity=newCdWidth/cdWidth;      
        }
        //Xử lí tiến độ bài hát hiện tại
        audio.ontimeupdate=function() {
            if(audio.currentTime) {
                const progressPercent=audio.currentTime/audio.duration *100;
                progress.value=progressPercent;                

            }
        }
        //Xử lí bài hát khi tua
        progress.oninput=function(e) {
            const seekTime=audio.duration*e.target.value/100;
            audio.currentTime=seekTime;
        }
        //Quay CD 
        const csThumbAnimate=cdThumb.animate([
            {transform :'rotate(360deg'}
        ],
        {
            duration:10000,
            iterations:Infinity

        })
        csThumbAnimate.pause();
        //Next Song
        nextBtn.onclick =function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.activeSong();
            _this.scrollToView();
        }
        //Prev Song
        prevBtn.onclick =function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.activeSong();
            _this.scrollToView();
        }
        //Random song
        randomBtn.onclick=function() {
            _this.isRandom=!_this.isRandom;
            randomBtn.classList.toggle('active',_this.isRandom);
        }
        //Xử lí ended của song
        audio.onended= function() {
            if(_this.isRepeat) {
                audio.play();
            }else {
                nextBtn.onclick();
            }
        }
        //Xử lí Repeat
        repeatBtn.onclick=function() {
            _this.isRepeat=!_this.isRepeat;
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }
        //Xử lí khi click vào song
        playList.onclick=function(e) {
            const songNode=e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                //Xử lí khi click vào nodeSong
                if(songNode) {
                    _this.currentSongIndex=Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    console.log('play')

                }
                //Xử lí khi click vào option và ngăn nổi bọt
                if(e.target.closest('.option')) {
                    $$('.option').forEach(function(option) {
                        option.onclick=function(e) {
                            e.stopPropagation();
                            console.log('option')
                        }
                        
                    })
                }

            }
        }
      

    },
    defineProperties:function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentSongIndex];
            }
        })
    },
    loadCurrentSong: function() {
        heading.innerText=this.currentSong.name;
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`;
        audio.src=`${this.currentSong.path}`;
        this.activeSong();
    },
    nextSong:function() {
        this.currentSongIndex++;
        if(this.currentSongIndex >= this.songs.length) {
            this.currentSongIndex=0;
        }
        this.loadCurrentSong();

    },
    prevSong:function() {
        this.currentSongIndex--;
        if(this.currentSongIndex < 0) {
            this.currentSongIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
       if(this.listSongPlayed.length == this.songs.length) {
        this.listSongPlayed=[];
       }
       let newIndex;
       do {
          newIndex=Math.floor(Math.random()*this.songs.length);

       }while(this.listSongPlayed.includes(newIndex)) ;
       this.listSongPlayed.push(newIndex);
       this.currentSongIndex=newIndex;
       this.loadCurrentSong();

    },
    scrollToView:function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'end'
            });

        },200)
    },
    start: function() {
        // Định nghĩa các thuộc tính mới cho Object
        this.defineProperties();

        // Các sự kiện trong DOM Events
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên
        this.loadCurrentSong();

        // Render ra bài hát
        this.render();

        // Active song
        this.activeSong();
    }
    
}
app.start();

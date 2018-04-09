
$(function(){
    $(window).resize(function(event) {
        viewWidth=screen.availWidth;
        // message.css("transition","none");
        message.css('transform', 'translate3d('+viewWidth+'px,0,0)');
    });
    var $musicList=$("#content .music-list");
    var $footer=$("#footer");
    var $musicDetail=$("#music-detail");
    var $musicBack=$("#music-detail .music-detail-header .icon-fanhui");
    var viewWidth=screen.availWidth;
    var page=0;
    var code=0;
    init(page);
    scoll();
    var childH;
    var off=true;
    var audioOff=true;
    var $Id=0;
    var audioImg=$("#footer .audioImg");
    var audioText=$("#footer .audioTxt");
    var audioBtn=$("#footer .audioBtn");
    var footerPro=$("#footer .progress .progress-UP");
    var proDot=$("#footer .progress b");
    var detailTitle=$("#music-detail .music-detail-header");
    var nowtime=$("#nowtime");
    var alltime=$("#alltime");
    var musicPre=$("#musicPre");
    var musicNext=$("#musicNext");
    var musicPlay=$("#musicPlay");
    var progress=$("#progress");
    var audioMusic=$("audio").get(0);// jquery用get转为dom
    var NowTime=null;
    var scale=0;
    var index=0;
    var musicListLi=$musicList.find('li');
    console.log(musicListLi)
    var disx=0;
    var progressW=progress.width();


    $musicList.on('touchend','li',  function(event) {
        // 或用delegate  事件委托
        if(off){
            // 防止滑动时也触发
            $(this).attr("class","active").siblings().attr("class","");
            $Id=$(this).attr("musicId");
            // console.log($Id)
            musicDetail($Id)
            index=$(this).index();
            // console.log(index)  获取当前元素索引
        }
    });
    $footer.on('touchstart', function(event) {
        event.preventDefault();
        if($Id){
            $musicDetail.css('transform', 'rotate(0deg)');
        }
    });
    $musicBack.on('touchstart', function(event) {
        event.preventDefault();
        $musicDetail.css('transform', 'rotate(90deg)');
    });
    audioBtn.find("span").first().add(musicPlay).on('touchstart',  function() {
        if(audioOff){
            play();
        // console.log(audioOff)
        }else{
            pause();
        }
        return false;
    });
    musicPre.on('touchstart', function(event) {
        event.preventDefault();
        preMusic();
    });
    audioBtn.find("span").first().next().add(musicNext).on('touchstart', function(event) {
        event.preventDefault();
        nextMusic();
        return false;
    });
    var detailFooterB=$("#music-detail .music-detail-footerB");
    detailFooterB.find('li').eq(0).on('touchstart', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $("#playWay").css('display', 'block');
    });
    $(document).on('touchstart', function(event) {
        event.preventDefault();
        $("#playWay").css('display', 'none');
    });
    var nowClass;
    $("#playWay ul").on('touchstart',"li" ,function(event) {
        event.preventDefault();
        var nowClass=($(this).attr('class'));
        detailFooterB.find('li').eq(0).removeClass().addClass(nowClass);
    });
    // 拉动进度条
    progress.find('b').add(proDot).on('touchstart', function(event){
        var This=this;
        var startPoint=event.originalEvent.changedTouches[0].clientX;
        var Dotpoint=$(This).position().left;
        // console.log(startPoint,Dotpoint)
        clearInterval(NowTime);
        progress.find('b').add(proDot).on('touchmove', function(event) {
            clearInterval(NowTime);
            var movepoint=event.originalEvent.changedTouches[0].clientX;
            disx=movepoint-startPoint+Dotpoint;
            // console.log(disx)
            if(disx<0){
                disx=0;
            }else if(disx>progressW){
                disx=progressW;
            }
            $(This).css('left',disx);
            progress.find('div').add(footerPro).css('width',disx);
            scale=disx/progressW;
        });
        progress.find('b').add(proDot).on('touchend', function(event) {
            audioMusic.currentTime=scale*audioMusic.duration;
            playing();
            clearInterval(NowTime);
            NowTime=setInterval(playing,1000);
        });
        return false;
    });
    var detailFooterT=$("#music-detail .music-detail-footerT");
    var message=$("#message");
    var msgTitle=$("#message .message-header");
    var msgContent=$("#message-content ul");
    var msgFooter=$("#message-footer");
    message.css('transform', 'translate3d('+viewWidth+'px,0,0)');
    message.css("transition",".3s");
    detailFooterT.find('li').eq(2).on('touchstart',function() {
        message.css('transform', 'translate3d(0,0,0)');
        msgDetail($Id);
        return false;
    });
    msgTitle.find('span').on('touchstart', function(event) {
        event.preventDefault();
        message.css('transform', 'translate3d('+viewWidth+'px,0,0)');
        return false;
    });
    msgFooter.find('input[type=button]').on('touchend',function(event) {
        event.preventDefault();
        var addmsg=msgFooter.find('input[type=text]').val();
        addMassage($Id,addmsg);
    });
    function init(page){

        $.ajax({
            url: './php/MusicList.php',
            type: 'GET',
            dataType: 'json',
            data:{page:page},
            async:false,//同步加载
        })
        .success(function(data) {
            $.each(data, function(index, val) {
                // console.log(data)
                var $li=$("<li musicId="+val.id+"><div><h4 class='title'>"+val.musicName+"</h4><p class='name'>"+val.singer+"</p></div><p class='iconfont icon-shixincaidan'></p></li>")
                 $musicList.append($li);
            });
            childH=$musicList.height();
        })
        .fail(function() {
            code=1;
        })
    }
    function musicDetail(id){
        $.ajax({
                url: './php/musicData.php',
                type: 'get',
                dataType: 'json',
                data: {id: id},
            })
            .success(function(data) {
                // console.log(data);
                show(data);
            })
            .fail(function() {
                console.log("error");
            });
    }
    function show(obj){
        var singer=obj.singer;
        var musicName=obj.musicName;
        var lyric=obj.lyric;
        var img=obj.img;
        var audio=obj.audio;
        console.log(singer,img)
        if(img){
            audioImg.attr("src","img/"+img);
        }else{
            audioImg.attr("src","img/pan.jpg");
        }
        audioText.find("h4").html(musicName);
        audioText.find("p").html(singer);
        audioMusic.src="music/"+audio;
        detailTitle.find('p').add(msgTitle.find("p")).html(musicName+"--"+singer);
        $musicDetail.css({'background-image':"url(img/"+img+")","backgroundRepeat":"no-repeat","background-size":"cover"
        });
        Lyric(lyric);
        $(audioMusic).one('canplaythrough', function() {
            // 放下面只执行一遍？
            // one 绑定一次触发后删除，用on会跳歌
            // canplaythrough  h5 audio中的监测音乐是否加载完
            play();
            // duration  h5 audio中的音乐的总时间
            // 右边的时间
            alltime.html(time(audioMusic.duration));
        });
        $(audioMusic).one('ended', function() {
            nextMusic();
        });
    }
    function play(){
        audioOff=false;
        msglength($Id);
        audioBtn.find("span").first().add(musicPlay).removeClass('icon-bofang').addClass("icon-zanting");
        audioImg.addClass('Rotate');
        audioMusic.play();
            // play()h5的播放插件，DOM元素的，jQuery没有
        playing();
        clearInterval(NowTime);
        NowTime=setInterval(playing,1000);
    }
    function pause(){
        audioBtn.find("span").first().add(musicPlay).removeClass('icon-zanting').addClass("icon-bofang");
        audioImg.removeClass('Rotate');
        audioMusic.pause();
        clearInterval(NowTime);
        audioOff=true;
    }

    function time(num){//计算时间
        var minutes=parseInt(num%3600/60);
        var second=parseInt(num%3600%60);
        // console.log(minutes,second);
        if(minutes<10){
            minutes="0"+minutes;
        }
        if(second<10){
            second="0"+second;
        }
        return minutes+":"+second;
    }
    function playing(){
        nowtime.html(time(audioMusic.currentTime));
        // currentTime  h5 audio中的音乐的目前时间
        scale=audioMusic.currentTime/audioMusic.duration;
        // console.log(scale)
        progress.find('div').add(footerPro).css('width',scale*100+"%");
        progress.find('b').add(proDot).css('left',scale*100+"%");
        var cureTime=audioMusic.currentTime;
        LyricScroll(cureTime);

    }
    function nextMusic(){
        var playClass=detailFooterB.find('li').eq(0);
        if (index == musicListLi.length - 1) {
            index=0;
        }else if(playClass.hasClass('icon-icon-')){
            index=index;
        }else if(playClass.hasClass('icon-suijibofang')){
            index=parseInt(index*(Math.random()*10)/(Math.random()*10));
            if(index==0){
                index=5;
            }else if(index>musicListLi.length){
                index=musicListLi.length-2;
            }
            // console.log(index)
        }else{
            index++;
        }
        $Id=musicListLi.eq(index).attr('musicid');
        console.log(musicListLi.length)
        musicListLi.eq(index).attr("class","active").siblings().attr("class","");
        musicDetail($Id);
    }
    function preMusic(){
        index=index==0?musicListLi.length-1:index-1;
        console.log(index)
        $Id=musicListLi.eq(index).attr('musicId');
        musicListLi.eq(index).attr("class","active").siblings().attr("class","");
        musicDetail($Id);
    }
    var musicLlyric=$musicDetail.find(".music-detail-content .music-lyric");
    var LyricLi;
    var LyLiH=0;var array=[];
    function Lyric(lyric){
        // console.log(lyric)

        var re=/\[[^[]+/g;
        // 正则写在//中间,\转换符，^写在[]内代表出什么意外，+代表多个，以[开头到]为止
        musicLlyric.empty();
        array=lyric.match(re);
        // console.log(array)
        for(var i=0;i<array.length;i++){
            // console.log(array[i])
            array[i]=[formateTime(array[i].substring(0,10)),array[i].substring(10)];
            // console.log(array[i])//转为二维数组，substring不包含第二个参数
        }//console.log(array)
        for(var j=0;j<array.length;j++){
            LyricLi=$("<li>"+array[j][1]+"</li>")
            musicLlyric.append(LyricLi);
        }
        musicLlyric.find('li').first().attr('class', 'Lyactive');
    }
    function formateTime(num){
        var Num=num.substring(1,num.length-1);//去中括号
        var arr=Num.split(":");

        var secondTime=parseFloat(arr[0]*60)+parseFloat(arr[1]);
        // console.log(arr[0],arr[1],secondTime)  不parseFloat是字符串拼接  易错
        //
        return secondTime;
    }
    function LyricScroll(cureTime){
        var LyLi=musicLlyric.find('li');
        LyLiH=LyLi.first().innerHeight();
        musicLlyric.css('transition', ".4s");
        for(var i=0;i<array.length;i++){
            // console.log(array[i][0],cureTime)
            if(i!=array.length-1&&array[i][0]<cureTime&&array[i+1][0]>cureTime){
                LyLi.eq(i).attr('class', 'Lyactive').siblings().attr('class', '');
                musicLlyric.css('transform', 'translate3d(0,'+(-LyLiH*i)+'px,0)');
            }else if(i==array.length-1&&array[i][0]<cureTime){
                // 最后一个是i 解决最后一个不变问题
                LyLi.eq(i).attr('class', 'Lyactive').siblings().attr('class', '');
                musicLlyric.css('transform', 'translate3d(0,'+(-LyLiH*i)+'px,0)');
            }
        }
    }
    function msgDetail(id){
        msgContent.empty();
        $.ajax({
            url: './php/message.php',
            type: 'get',
            dataType: 'json',
            data: {musicId: id},
        })
        .success(function(data) {
            $.each(data, function(index, val) {
                msgContent.prepend($("<li>"+val.text+"</li>"))
            });
        })
        .fail(function() {
            console.log("error");
        })
    }
    var musicDetailFooterT=$("#music-detail .music-detail-footerT");
    function msglength(id){
        console.log("msg")
        $.ajax({
            url: './php/message.php',
            type: 'get',
            dataType: 'json',
            data: {musicId: id},
        })
        .success(function(data) {
            // console.log(data.length)
            musicDetailFooterT.find('li').eq(2).find('span').html(data.length)
        })

        .fail(function() {
            musicDetailFooterT.find('li').eq(2).find('span').html(0)
        })
    }
    function addMassage(id,msg){
         // console.log(id,msg)
        $.ajax({
            url: './php/addmsg.php',
            type: 'post',
            data: {mId: id,message: msg},
            dataType:'json',
        })
        .success(function(data) {
            // console.log(data)
            // var Time=new Date().getMonth()+1+"月"+new Date().getDay()+"日"+new Date().getHours()+":"+new Date().getMinutes();
            msgFooter.find('input[type=text]').val("");
            var li=$("<li>"+data.message+"</li>")
            msgContent.prepend(li);
        })
        .fail(function() {
            console.log("error");
        })
    }
    var loding=null;
    function scoll(){
        var This;
        var startY=0;
        var endY=0;
        var dis=0;
        var moveTop=$musicList.position().top;
        var targetDis=0;
        var nowtop;//$musicList.height()
        var H=$("#content").height()-childH;
        var timer=null;

        $musicList.on('touchstart', function(event) {
            console.log(childH)
            H=$("#content").height()-childH;
            event.preventDefault();
            off=true;
            clearInterval(timer);
            This=$(this);
            var nowpoint=$musicList.position().top-40;
            moveTop=$musicList.position().top;console.log(moveTop)
            // console.log(event.originalEvent.changedTouches[0].clientY)
            startY=event.originalEvent.changedTouches[0].clientY;
            $musicList.on('touchmove',function(event) {
                event.preventDefault();
                off=false;
                nowtop=$musicList.position().top;
                endY=event.originalEvent.changedTouches[0].clientY;
                dis=endY-startY;
                // 减去最初始的40个偏差
                targetDis=moveTop+dis-40;
                // console.log(nowtop,H)
                if(nowtop>40){//上出
                    This.css('transform', 'translateY('+parseInt(targetDis/5)+'px');
                }else if(nowtop<H){
                    if(!loding&&!code){
                        page++;
                        console.log(page)
                        loding=$("<li style='text-align:center'>loading......</li>");
                        $musicList.append(loding);
                    }
                    var over=nowtop-H;
                    targetDis=parseInt(targetDis-over/2);
                    This.css('transform', 'translateY('+targetDis+'px');
                }else{
                    This.css('transform', 'translateY('+targetDis+'px');
                }
            }).on('touchend',function(event) {
                event.preventDefault();
                var speed=(targetDis-nowpoint)/8;
                clearInterval(timer);
                timer=setInterval(function(){
                    // console.log(targetDis,nowtop)
                        speed=speed*0.8;
                        // console.log(speed)
                        console.log(targetDis)
                        targetDis=targetDis+speed;
                    if(Math.abs(speed)<1){
                        clearInterval(timer);
                        // console.log("aahahah")
                    }
                    nowtop=$musicList.position().top;
                    if(nowtop>40){
                        // nowtop=$musicList.position().top;
                        // var timer2=setInterval(function(){nowtop=$musicList.position().top;
                        //     targetDis--;
                        //     if(nowtop<=40){
                        //         console.log(nowtop)
                        //         clearInterval(timer2);
                        //     }
                        // },50);
                        // This.css('transform', 'translateY('+cubic-bezier(.08,1.44,.6,1.46)+'px');
                        targetDis=0;
                        clearInterval(timer);
                    }
                    // console.log(nowtop,H)
                    if(nowtop<H){
                        targetDis=H;
                        clearInterval(timer);
                        if (loding) {
                            loding.remove();
                            loding=null;
                            init(page);
                            musicListLi=$musicList.children('li');
                            // console.log(musicListLi.length);
                        };


                        console.log(code)
                    }
                    // console.log(targetDis)
                    This.css('transform', 'translateY('+targetDis+'px');

                },50);

            });
        });
    }
})
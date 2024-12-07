let circles=[]
let vs=[]
let block=[[500,500,100,100,"grey"],[500,800,200,200,"grey"]]
class draw{
    constructor(x,y,w1,w2,c,shape){
        this.type=shape;
        if(shape=="circle"){
            this.x=x;
            this.y=y;
            this.r=w1;
            this.w=w2;
            this.c=c;
            circles.push(this)
        }else if(shape=='square'){
            this[1]=x;
            this[2]=y;
            this[2]=w1;
            this[3]=w2;
            this[4]=c;
            block.push(this)
        }
        this.activ=false;
    }
}
let game={
    0:{0:100,1:100,pole:60,width:40,height:30},
    1:{0:1000,1:1000,pole:60,width:40,height:30},
    i:0,
    bgc:'black',
    draw(){
        for(let j=0;j<2;j++){
            this.check();
            let subject=this[game.i+j];
            if(game.i+1==undefined){
                console.log('time to wrap up')
            }
            ctx.fillStyle="green";
            ctx.strokeStyle="brown";
            ctx.lineWidth=2*sizer.sca;
            ctx.beginPath();
            sizer.as(subject[0],subject[1])
            ctx.moveTo(vs[0],vs[1]);
            sizer.as(subject[0],subject[1],0,-subject.pole)
            ctx.lineTo(vs[0],vs[1]);
            ctx.stroke();
            ctx.fillRect(vs[0],vs[1],subject.width*sizer.sca,subject.height*sizer.sca)
            ctx.fillStyle="black";
            ctx.font=`${30*sizer.sca}px serif`
            ctx.fillText(j,vs[0]+subject.width*sizer.sca/3,vs[1]+subject.height*sizer.sca*4/5)
        }
    },
    add(x,y,p,w,h){
        game.push({0:x,1:y,pole:p,width:w,height:h})
    },
    check(){
        if(compare(this[game.i+1][0]-20,this[game.i+1][0]+20,this[game.i+1][1]+20,this[game.i+1][1]+20)){
            console.log('heah')
            this.i++
        }
    }
}
let canvas=document.getElementById('canv');
let ctx=canvas.getContext('2d');
document.getElementsByTagName('body')[0].style.backgroundColor=game.bgc
block.check=function(){
    for(let i=0;i<block.length;i++){
        if(compare(block[i][0]+sizer.X,block[i][0]+block[i][2]+sizer.X,block[i][1]+sizer.Y,block[i][1]+block[i][3]+sizer.Y)){
            ar.activ=false;
            ar.x=game[game.i][0]+sizer.X;
            ar.y=game[game.i][1]+sizer.Y;
            break;
        }   
    }
}
block.draw=function(){
    for(let i=0;i<block.length;i++){
        ctx.fillStyle=block[i][4];
        sizer.as(block[i][0],block[i][1])
        ctx.fillRect(vs[0],vs[1],block[i][2]*sizer.sca,block[i][3]*sizer.sca)
    }
}
let sizer={
    sca:1,
    X:0,
    Y:0,
    drift(x,y){
        ar.x+=x;
        sizer.X+=x;
        ar.y+=y;
        sizer.Y+=y;
    },
    as(x,y,dx=0,dy=0,w,h,dx1=0,dy1=0){
        vs[0]=(x+this.X+dx+dx1)*sizer.sca;
        vs[1]=(y+this.Y+dy+dy1)*sizer.sca;
        return [vs];
    }
}
let ar=new draw(game[game.i][0],game[game.i][1],30,10,'transparent','circle')
let movables=[ar]
function connector(event){
    for(let i=0;i<circles.length;i++){
        let object=circles[i];
        if(compare(event.clientX/sizer.sca-object.r,event.clientX/sizer.sca+object.r,event.clientY/sizer.sca-object.r,event.clientY/sizer.sca+object.r)){
            if(object.activ){
                object.activ=false;
            }else{
                object.activ=true;
            }
        }
    }
}
function recenter(object){
    sizer.drift((window.innerWidth/2-object.x*sizer.sca)/sizer.sca,(window.innerHeight/2-object.y*sizer.sca)/sizer.sca)
}
function compare(x1,x2,y1,y2){
    let lineup=[1,1,-1,1,1,-1,-1,-1]
    for(let i=0;i<8;i+=2){
        if(x1<=ar.x+((Math.cos(45)*ar.r+ar.w)*lineup[i])&ar.x+((Math.cos(45)*ar.r+ar.w)*lineup[i])<=x2&y1<=ar.y+((Math.cos(45)*ar.r+ar.w)*lineup[i+1])&ar.y+((Math.cos(45)*ar.r+ar.w)*lineup[i+1])<=y2){
            return true
        }
        if(i<4){
            if(x1<=ar.x+(ar.r*lineup[i])&ar.x+(ar.r*lineup[i])<=x2&y1<=ar.y&ar.y<=y2){
                return true
            }
        }else{
            if(y1<=ar.y+(ar.r*lineup[i])&ar.y+(ar.r*lineup[i])<=y2&x1<=ar.x&ar.x<=x2){
                return true
            }
        }
    }
    return false
}
function display(){
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
}
function drawcircle(object){
    ctx.moveTo(sizer.sca*(object.x+object.r),sizer.sca*object.y)
    ctx.beginPath()
    ctx.arc(sizer.sca*object.x,sizer.sca*object.y,sizer.sca*object.r,0,Math.PI*2)
    if(object.activ){
        ctx.strokeStyle="green"
    }else{
        ctx.strokeStyle="red"
    }
    ctx.lineWidth=sizer.sca*object.w;
    ctx.fillStyle=object.c;
    ctx.fill()
    ctx.stroke()
}
function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=game.bgc
    ctx.fillRect(0,0,canvas.width,canvas.height);
    block.draw();
    block.check();
    game.draw();
    drawcircle(ar);
    requestAnimationFrame(frame);
}
function circle(event){
    if(ar.activ){
        event=event||window.event;
        ar.x=event.clientX/sizer.sca;
        ar.y=event.clientY/sizer.sca;
    }
}
function tpcheck(diffx,diffy){
    let ogx=ar.x;
    let ogy=ar.y;
    function loop(){
        ar.x+=1/diffx*sizer.sca;
        ar.y+=1/diffy*sizer.sca;
        console.log("anything?")
        block.check();
        if(ogx==ogx+diffx&&ogy==ogy+diffy){
            return 
        }else{
            loop()
        }
    }
    loop();
    ar.x=ogx;
    ar.y=ogy;
}
document.addEventListener('mouseleave',function(){ar.activ=false})
document.addEventListener('wheel',function(event){
    let slide=event.wheelDelta/700; 
    if(sizer.sca+slide>0.5){
        ar.activ=false
        sizer.drift((event.clientX-(event.clientX/sizer.sca)*(sizer.sca+slide))/sizer.sca,(event.clientY-(event.clientY/sizer.sca)*(sizer.sca+slide))/sizer.sca)
        sizer.sca+=slide;
    }
})
document.addEventListener('keydown',function(event){
    let dp=canvas.width/10;
    if(event.key=="ArrowLeft"||event.key=='a'){
        if(ar.activ){
            tpcheck(-dp,0);
            ar.x-=dp;
        }
        sizer.drift(dp,0)
    }else if(event.key=="ArrowRight"||event.key=='d'){
        if(ar.activ){
            tpcheck(dp,0);
            ar.x+=dp;
        }
        sizer.drift(-dp,0)
    }else if(event.key=="ArrowUp"||event.key=='w'){
        if(ar.activ){
            tpcheck(0,-dp)
            ar.y-=dp;
        }
        sizer.drift(0,dp)
    }else if(event.key=="ArrowDown"||event.key=="s"){
        if(ar.activ){
            tpcheck(0,dp)
            ar.y+=dp;
        }
        sizer.drift(0,-dp)
    }else{
        recenter(ar);
    }
})
document.onmousemove=circle
frame()
display()
window.onresize=display;
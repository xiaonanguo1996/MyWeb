var search_box = document.getElementsByClassName("search-box")[0]
	,input_box = search_box.getElementsByTagName("input")[0]
	,search_example = search_box.getElementsByClassName("search-example")[0]
	,scroll_container = document.getElementById("scroll-container")
	,fixed_top = document.getElementsByClassName("fixed-top")[0]
	,prev = document.getElementsByClassName("prev")[0]
	,next = document.getElementsByClassName("next")[0]
	,images = document.getElementsByClassName("img-container")
	,buttons = document.getElementsByClassName("buttons")[0].getElementsByTagName("li")
	,videos = document.getElementsByTagName("video");
new WOW().init();
/////////////////搜索框focus示例动画//////////////////
input_box.addEventListener("focus",function(){
	var gone_example = setInterval(function(){
		search_example.style.opacity -= 0.05;
		if(search_example.style.opacity == 0){
			search_example.style.display = "none";
			clearInterval(gone_example);
		}
	},10);
},false);
input_box.addEventListener("blur",function(){
	search_example.style.display = "block";
	search_example.style.opacity = 1;
},false);
////////////////////轮播点击切换/////////////////////
next.onclick = function(event){
	event.preventDefault();
	if(scroll_container.animating == true) return;
	myAnimate(scroll_container,-100);
	toggle_button();
};
prev.onclick = function(event){
	event.preventDefault();
	if(scroll_container.animating == true) return;
	myAnimate(scroll_container,100);
	toggle_button();
};
buttons[0].onclick = function(){
	if(scroll_container.animating == true || scroll_container.style.left == "-100%") return;
	myAnimate(scroll_container,100);
	toggle_button();
};
buttons[1].onclick = function(){
	if(scroll_container.animating == true || scroll_container.style.left == "-200%") return;
	myAnimate(scroll_container,-100);
	toggle_button();
};
function toggle_button(){
	buttons[0].classList.toggle("current");
	buttons[1].classList.toggle("current");
}
////////////////////图片切换具体实现/////////////////////
function myAnimate(ele,length){
	scroll_container.animating = true;
	var start_left = parseInt(ele.style.left);
	var left = start_left;
	var tick_time = 10;
	var time = 500;
	var myAnimation = function(){
		left = left + length/(time/tick_time);
		ele.style.left = left + "%";
		if(left == start_left + length){
			scroll_container.animating = false;
			if(left == -300){
				ele.style.left = "-100%";
			}
			if(left == 0){
				ele.style.left = "-200%";
			}
			return;
		}
		setTimeout(myAnimation,tick_time);
	};
	setTimeout(myAnimation,tick_time);
}
////////////////////自循环播放/////////////////////
function my_click(){
	var event = document.createEvent("MouseEvents");
	event.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
	next.dispatchEvent(event);
}
var click = setInterval(my_click,10000);
scroll_container.onmouseover = function(){
	clearInterval(click);
};
scroll_container.onmouseout = function(){
	click = setInterval(my_click,8000);
};
/////////////////监听滚动显示Mix导航/////////////////
window.addEventListener("mousewheel",function(){
	if(document.body.scrollTop >= 300){
		fixed_top.classList.add("top-show");
		fixed_top.classList.add("animated");
		fixed_top.classList.add("fadeInDown");
	}else{
		fixed_top.classList.remove("top-show");
	}
});
/////////////////监听滚动显示Video-1/////////////////
window.addEventListener("mousewheel",function(){
	if(document.body.scrollTop >= 1200 && document.body.scrollTop <= 2500){
		videos[0].loop = true;
		videos[0].play();
	}else{
		videos[0].pause();
	}
});
/////////////////监听滚动显示Video-2/////////////////
window.addEventListener("mousewheel",function(){
	if(document.body.scrollTop >= 2700 && document.body.scrollTop <= 4000){
		videos[1].loop = true;
		videos[1].play();
	}else{
		videos[1].pause();
	}
});



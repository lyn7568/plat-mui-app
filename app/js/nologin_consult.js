mui.plusReady(function() {
	
	var regBtn = document.getElementById("regBtn");
	var logBtn = document.getElementById("logBtn");
	
//	注册
	regBtn.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/reg.html',
			id: '../html/reg.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
		
	});
	
	//登陆
	logBtn.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/login.html',
			id: '../html/login.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
		
	});
	
	var userid = plus.storage.getItem('userid'); 
	
	
	
	
});
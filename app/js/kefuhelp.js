mui.ready(function() {
	var feedBack = document.getElementById("feedBack");
	var claims = document.getElementById("claims");
//	var FAQ = document.getElementById("FAQ");
	var contactService = document.getElementById("contactService");
	
	
	/*意见反馈*/
	feedBack.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/feedback.html',
			id: '../html/feedback.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});
	
	/*投诉举报*/
	claims.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/claims.html',
			id: '../html/claims.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});
	
	/*常见问题*/
	/*FAQ.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/faq.html',
			id: '../html/faq.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});*/
	
	/*联系客服*/
	contactService.addEventListener('tap',function(){
		var userid = plus.storage.getItem('userid');
		console.log(userid);
		mui.openWindow({
			url: '../html/contactservice.html',
			id: '../html/contactservice.html',
			show: {
				aniShow: "slide-in-right"
			},
			extras:{userId:userid}
		});
		
	});
	
});
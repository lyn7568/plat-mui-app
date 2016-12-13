mui.ready(function() {
	var detail = document.getElementById("service_phone");
	
	mui.plusReady(function() {
		
		var self = plus.webview.currentWebview();
		var userId = self.userId;
		console.log(userId);
		
		
		function dialTest() {
			var phoneNum = document.getElementById("phone_num").innerHTML;
			plus.device.dial( phoneNum, false);
		};
		
		detail.addEventListener('tap',function(){
			dialTest();
		});
		
		
		
	});
});
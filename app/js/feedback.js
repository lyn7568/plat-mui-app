mui.ready(function() {
	var feedbackCon = document.getElementById("question");
	var sendBtn = document.querySelector('.tijiao');
	
	
	/*提交反馈*/
	function sendFeedBack(userid){
		
		mui.ajax(baseUrl+'',{
			data:{
				
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				
			},
			error:function(xhr,type,errorThrown){
				mui.toast('反馈失败');
			}
		});
	};
	
	/*反馈字数限制*/
	function checkLen(obj) {  

		var maxChars = 500;//最多字符数  
		
		if (obj.value.length > maxChars) {
			
			obj.value = obj.value.substring(0,maxChars); 
		}
		
		var curr = maxChars - obj.value.length;  
		
		document.getElementById("count").innerHTML = curr.toString(); 	
	};
	
	feedbackCon.addEventListener('keyup',function(){
		
		checkLen(feedbackCon);
	});
	
	
	mui.plusReady(function() {
		
		var self = plus.webview.currentWebview();
		var userId = self.userId;
		console.log(userId);
		
		sendBtn.addEventListener('tap',function(){
//			sendFeedBack(userId);
		});
		
		
		
		
		
		
		
		
		
		
		
	});
	
});
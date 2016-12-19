mui.ready(function() {
	var tousuCon = document.getElementById("question");
	var sendBtn = document.querySelector('.claims');
	
	/*提交*/
	function sendClaims(userid) {
		console.log('投诉内容：=='+tousuCon.value);
		mui.ajax(baseUrl+'/ajax/complain',{
			data:{
				"professorId": userid, //投诉人ID (必填)
				"complainContant": tousuCon.value, //投诉内容 (必填)
				"appellee": "", //被投诉ID (可为空，类型为建议时为空)
				"complainType": 1 //投诉类型 (0-建议，1-投诉) 
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log(data.data);
				if(data.data){
					tousuCon.value = '';//投诉完成后，清空容器
					mui.toast('已提交');
				}
			}, 
			error:function(xhr,type,errorThrown){
				mui.toast('提交失败');
			}
		});
	};
	
	/*字数限制*/
	function checkLen(obj) {  

		var maxChars = 500;//最多字符数  
		
		if (obj.value.length > maxChars) {
			
			obj.value = obj.value.substring(0,maxChars); 
		}
		
		var curr = maxChars - obj.value.length;  
		
		document.getElementById("count").innerHTML = curr.toString(); 	
	};
	
	tousuCon.addEventListener('keyup',function(){
		
		checkLen(tousuCon);
	});
	
	
	mui.plusReady(function() {
		
		var self = plus.webview.currentWebview();
		var userId = self.userId;
		console.log(userId);
		
		sendBtn.addEventListener('tap',function(){
			sendClaims(userId);
		});
		
		
	});
	
});
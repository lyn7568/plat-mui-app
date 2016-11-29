mui.ready(function(){
	
	var osendBtn = document.getElementById("submit");//发送按扭；
	
	var oplaceholder =document.getElementById("placeholder");//
	var otextNum = document.getElementById("text-count");//字数
	var oinp = document.getElementById("inp");//用来放评价字数的隐藏于
	
	var oassesscontent = document.getElementById("question");//评价内容
	var ostarContainer = document.getElementById("starContainer");//星星容器
	
	/*保存评价评价*/
	function saveassess(consultId) {
		var assessStar = ostarContainer.querySelectorAll('.icon-favorfill').length;
		var assessContant = oassesscontent.innerHTML;
		var params = {
				"consultId":consultId, //咨询ID
			    "assessStatus":"1", //评价状态 0-未评价，1-已评价
			    "assessStar":assessStar, //评价星级
			    "assessContant":assessContant //评价内容
		};
		
		mui.ajax(baseUrl+'/ajax/consult/assess',{
			data:params,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			success:function(data){
				
				if(data.data == true){
					mui.toast('评价成功');
				}else {
					mui.alert('已经评价');
				}
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	};
	//点击评价区域，placeholder效果，字数限制效果、
	oassesscontent.addEventListener('keyup',function(){
		limitTextCountFn();
	});
	//评价字数限制
	//字数限制函数
	function limitTextCountFn(){
		var curLength = oassesscontent.innerHTML.length;
		if(curLength > 300){
			var num= oassesscontent.innerHTML.substr(0,300); 
		} 
		else {
			otextNum.innerHTML = parseInt(curLength); 
			
		} 
	};

	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var consultId = self.consultId;
		console.log(consultId);
		/*发送评价,返回聊天*/
		osendBtn.addEventListener('tap',function() {
			saveassess(consultId);
			/*返回聊天*/
			var chatsList = plus.webview.getWebviewById('chats.html');
			chatsList.show();
			mui.fire(chatsList,'refresh',{'chatsList':chatsList}); 

		});
		
	});
});
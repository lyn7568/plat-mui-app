//谢绝理由
var xjsubmt = document.getElementById("xjsubmt");
var lyinput = document.getElementById("lyinput");

mui.plusReady(function(){
 	var self = plus.webview.currentWebview();
 	var consultId = self.consultId;
 	var userid = plus.storage.getItem('userid');
 	var newtemp;
 	//谢绝理由选择
 	mui("#xjlist").on('tap', 'li', function() {
 		if(this.getAttribute("class")=="checkedLi"){
 			this.classList.remove("checkedLi");	
 		}else{
 			this.classList.add("checkedLi");	
 		}
 	})
 	
 	xjsubmt.addEventListener("tap",function(){
 		var lyval = lyinput.innerText;
 		var arr = document.querySelectorAll("#xjlist li.checkedLi span"),temp = [];
		for(var i = 0;i<arr.length;i++){
		    temp.push(arr[i].innerHTML);
		}
		if(lyval==""){
			 newtemp = temp;	
		}else{
			 newtemp = temp.concat([lyval]);	
		}
		console.log(JSON.stringify(newtemp))
		if(newtemp==""){
			plus.nativeUI.toast("至少选择一个或输入谢绝缘由", toastStyle);
		}else{
			submtbut();
		}
 	})
 	
 	/*谢绝理由提交*/
 	function submtbut(){
	 	mui.ajax(baseUrl + '/ajax/consult/reject', {
			data: {
				"consultId": consultId,
				"professorId": userid,
				"reasons": newtemp
			}, //咨询ID
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			traditional:true,//传数组必须加这个
			//async:false,
			success: function(data) {
				if(data.success){
					console.log(JSON.stringify(data))
					var consultlistPage = plus.webview.getWebviewById('consultlist.html');
						mui.fire(consultlistPage, 'consid', {});
					plus.nativeUI.toast("已谢绝对方的咨询——您可以再看看其他需求。", toastStyle);
					var curr = plus.webview.currentWebview();
                    var wvs = plus.webview.all();
                    for (var i = 0, len = wvs.length; i < len; i++) {
                        //关闭除setting页面外的其他页面
                        if (wvs[i].getURL() == curr.getURL())
                            continue;
                        plus.webview.close(wvs[i]);
                    }
                    //打开login页面后再关闭setting页面
                    plus.webview.open('../index.html');
                    curr.close();
				}
			},
			error: function() { 
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
 	}
 	
 	/*拒绝字数限制*/
	function checkLen(obj) {  
		var maxChars = 300;//最多字符数  
		if (obj.innerHTML.length > maxChars) {
			obj.innerHTML = obj.innerHTML.substring(0,maxChars); 
		}
		var curr = maxChars - obj.innerHTML.length;  
		document.getElementById("countNum").innerHTML = curr.toString(); 	
	};
	lyinput.addEventListener('keyup',function(){
		checkLen(lyinput);
	});
 	
	plus.nativeUI.closeWaiting();
	plus.webview.currentWebview().show("slide-in-right",150);
})
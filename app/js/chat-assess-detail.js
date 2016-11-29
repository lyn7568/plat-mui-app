mui.ready(function(){
	var ostarContainer =document.getElementById("starContainer");//星星容器
	var oassesscon =document.getElementById("assesscon");//评价内容
	
	function getAssDetail(manFlag,consultId) {
		if(manFlag == 'myNeed'){
			mui.ajax(baseUrl+'/ajax/consult/qacon',{
				data:{"consultId":consultId,"readStatus":"1"},
				dataType:'json',
				type:'get',
				timeout:10000,
				success:function(data){
						var myData = data.data;
						//评价星级
						var starCount = myData["assessStar"];
						var starlist = ostarContainer.children;
						for(var i = 0; i < starCount; i++) {
							starlist[i].classList.remove('icon-favor');
			  				starlist[i].classList.add('icon-favorfill');
						};
						oassesscon.innerHTML =  myData["assessContant"];
					
				},
				error:function(xhr,type,errorThrown){
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		} else if(manFlag == 'consult'){
			console.log('收到咨询');
			mui.ajax(baseUrl+'/ajax/consult/qapro',{
				data:{"consultId":consultId,"readStatus":"1"},
				dataType:'json',
				type:'get',
				timeout:10000,
				success:function(data){
						var myData = data.data;
						//评价星级
						var starCount = myData["assessStar"];
						var starlist = ostarContainer.children;
						for(var i = 0; i < starCount; i++) {
							starlist[i].classList.remove('icon-favor');
			  				starlist[i].classList.add('icon-favorfill');
						};
						oassesscon.innerHTML =  myData["assessContant"];
					
				},
				error:function(xhr,type,errorThrown){
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
	}
	
	
	
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		var consultId = self.consultId;
		var manFlag = self.manFlag;
		/*console.log(consultId);
		console.log(manFlag);*/
		//填充评价详情
		getAssDetail(manFlag,consultId);
	});
	
})
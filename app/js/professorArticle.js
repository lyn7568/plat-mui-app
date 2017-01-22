mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.articleId;	
	function proInfoMain() {
		mui.ajax(baseUrl + "/ajax/article/query", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			data: {
				"articleId": proId
			},
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(JSON.stringify(data))
				var $info = data.data || {};
				if(data.success && data.data) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					var nameli = document.getElementById("nameli");
					var proZlist = document.getElementById("proZlist"); //专家资源
					var proName = document.getElementById("proName");
					var proTitle = document.getElementById("proTitle");
					var proOffice = document.getElementById("proOffice");
					var proOrg = document.getElementById("proOrg");
					var proAddress = document.getElementById("proAddress");
					var articleImg=document.getElementById("articleImg");
					var artical_topic=document.getElementById("artical_topic");
					var main_content=document.getElementById("main_content");
					proName.innerText = $info.professor.name;
					if($info.professor.title&&$info.professor.office&&$info.professor.orgName&&$info.professor.address){
						proTitle.innerText=$info.professor.title+"，";
						proOffice.innerText=$info.professor.office+"，";
						proOrg.innerText=$info.professor.orgName+" | ";
						proAddress.innerText=$info.professor.address;
					}else if(!$info.professor.title&&$info.professor.office&&$info.professor.orgName&&$info.professor.address){
						proOffice.innerText=$info.professor.office+"，";
						proOrg.innerText=$info.professor.orgName+" | ";
						proAddress.innerText=$info.professor.address;
					}else if($info.professor.title&&!$info.professor.office&&$info.professor.orgName&&$info.professor.address){
						proTitle.innerText=$info.professor.title+"，";						
						proOrg.innerText=$info.professor.orgName+" | ";
						proAddress.innerText=$info.professor.address;
					}else if($info.professor.title&&$info.professor.office&&!$info.professor.orgName&&$info.professor.address){
						proTitle.innerText=$info.professor.title+"，";
						proOffice.innerText=$info.professor.office+" | ";						
						proAddress.innerText=$info.professor.address;
					}else if($info.professor.title&&$info.professor.office&&$info.professor.orgName&&!$info.professor.address){
						proTitle.innerText=$info.professor.title+"，";
						proOffice.innerText=$info.professor.office+"，";
						proOrg.innerText=$info.professor.orgName;						
					}else if(!$info.professor.title&&!$info.professor.office&&$info.professor.orgName&&$info.professor.address){
						proOrg.innerText=$info.professor.orgName+" | ";
						proAddress.innerText=$info.professor.address;					
					}else if(!$info.professor.title&&$info.professor.office&&!$info.professor.orgName&&$info.professor.address){						
						proOffice.innerText=$info.professor.office+" | ";						
						proAddress.innerText=$info.professor.address;					
					}else if(!$info.professor.title&&$info.professor.office&&$info.professor.orgName&&!$info.professor.address){						
						proOffice.innerText=$info.professor.office+"，";
						proOrg.innerText=$info.professor.orgName;										
					}else if($info.professor.title&&!$info.professor.office&&!$info.professor.orgName&&$info.professor.address){
						proTitle.innerText=$info.professor.title+" | ";						
						proAddress.innerText=$info.professor.address;					
					}else if($info.professor.title&&!$info.professor.office&&$info.professor.orgName&&!$info.professor.address){						
						proOffice.innerText=$info.professor.title+"，";						
						proAddress.innerText=$info.professor.orgName;					
					}else if($info.professor.title&&$info.professor.office&&!$info.professor.orgName&&!$info.professor.address){
						proTitle.innerText=$info.professor.title+"，";
						proOffice.innerText=$info.professor.office;					
					}else if(!$info.professor.title&&!$info.professor.office&&!$info.professor.orgName&&$info.professor.address){
						proAddress.innerText=$info.professor.address;					
					}else if(!$info.professor.title&&!$info.professor.office&&$info.professor.orgName&&!$info.professor.address){
						proOrg.innerText=$info.professor.orgName;					
					}else if(!$info.professor.title&&$info.professor.office&&!$info.professor.orgName&&!$info.professor.address){
						proOffice.innerText=$info.professor.office;	
					}else if($info.professor.title&&!$info.professor.office&&!$info.professor.orgName&&!$info.professor.address){
						proTitle.innerText=$info.professor.title;						
					}
					var zlist="";
					for(var n = 0; n < $info.professor.resources.length; n++) {
						zlist += '<span>' + $info.professor.resources[n].resourceName + '</span>';
						if(n!=$info.professor.resources.length-1){
							zlist += '，';
						}
					}
					($info.professor.resources) ? proZlist.innerHTML = zlist: proZlist.innerText = '';
					if($info.articleImg){
						articleImg.style.backgroundImage='url('+baseUrl+'/data/article/'+$info.articleImg+')';
					}
					artical_topic.innerText=$info.articleTitle;
					if($info.articleContent){
						main_content.innerHTML=$info.articleContent;
						var oImg=main_content.getElementsByTagName("img");
						for(var i = 0; i < oImg.length; i++) {
							(function(n) {
								var att = oImg[n].src.substr(7);
								oImg[n].setAttribute("src", baseUrl + att);
							})(i);
						}
					}
				} 
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
	proInfoMain();
	/*进入留言*/
	document.getElementById("leaveWord").addEventListener("tap",function(){
		if(!userid){
			goLoginFun();
			return;
		}
		var nwaiting = plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/articalMessage.html", "articalMessage.html", {}, {
			articleId: proId
		}); //后台创建webview并打开show.html   	    	
	})
});
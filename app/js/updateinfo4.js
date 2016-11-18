mui.ready(function() {		
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');
		var ws=plus.webview.currentWebview();		
		//查询学术领域		
		function personalMessage() {		
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {					
					var $data=data.data;																														
					//学术领域
					if($data.subject) {
						if($data.researchAreas.length) {							
								
								var html = []; 
						for (var i = 0; i < $data.researchAreas.length; i++) {
							html.push("<li>"+$data.researchAreas[i].caption+"<em class='mui-icon mui-icon-closeempty'></em></li>");														
						};
						document.getElementsByClassName("labelshow")[0].innerHTML=html.join('');
					}
					}					
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		function trim(str) { //删除左右两端的空格
　　     			return str.replace(/(^\s*)|(\s*$)/g, "");
　　			 }
		mui(".labelshow").on("tap","em",function(){
			var val=this.parentNode;
			document.getElementsByClassName('labelshow')[0].removeChild(val);			
		});
		document.getElementsByClassName("addlabelbtn")[0].addEventListener("click",function(){
			var addContent=document.getElementsByTagName('input')[0].value;
			var content=trim(addContent);
			if(content) {				
				var node=document.createElement("li");				
				 node.innerHTML=content+'<em class="mui-icon mui-icon-closeempty"></em>';
				document.getElementsByClassName("labelshow")[0].appendChild(node);				
			}else {
				plus.nativeUI.toast("添加内容不能为空", toastStyle);
			}
		});
		document.getElementsByClassName("topsave")[0].addEventListener("click",function(){
    		
    		var $data=[];
			var researchAreas = document.getElementsByTagName("li");
			if(researchAreas.length>0){
				for (var i = 0; i <researchAreas.length; i++) {
					var $rd ={};
					$rd.professorId = userid;					
					$rd.caption= researchAreas[i].innerText;
					$data[i]=$rd;
				}
			}						
    		var mess1 = JSON.stringify($data);   		
    		$.ajax({
				"url" :baseUrl+'/ajax/researchArea',
				"type" : "PUT" ,
				"async":true,
				"data" :mess1,
				"beforeSend":function(xhr,settings){console.log(JSON.stringify(settings))},
				"contentType" :"application/json",					
				"success" : function(data) {					
					if (data.success) 
					{
						var web=plus.webview.getWebviewById("html/proinforupdate.html");
						mui.fire(web,"newId");						
						mui.back();
					} 
					else
					{
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
					}
				}
			});
    	});
		personalMessage();
	});
})    

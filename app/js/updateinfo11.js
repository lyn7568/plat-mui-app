mui.ready(function() {		
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');		
		var ws=plus.webview.currentWebview();		
		var str = JSON.stringify(ws);			
    	var oDt=document.getElementsByClassName("frmtype");    	    	    	
    	if(ws.edu) {   		    		
    		$.ajax({
				"url" :baseUrl+"/ajax/honor/"+ws.edu,
				"type" : "get" ,
				"async":true,																	
				"success" : function($data) {					
					if ($data.success) 
					{
						plus.nativeUI.closeWaiting();	; //新webview的载入完毕后关闭等待框
        				ws.show("slide-in-right",150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画    
						$info = $data.data;	
						 oDt[0].value=$info.name;																	
						 oDt[1].innerText=$info.year;						
						 if(!$info.descp) 
						 $info.descp="";						
						document.getElementsByClassName("textareabox")[0].innerText=$info.descp;
					} 
					else
					{
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
					}
				}
			});

    		
    	}
    	function trim(str) { //删除左右两端的空格
　　     			return str.replace(/(^\s*)|(\s*$)/g, "");
　　			 }
    	oDt[0].addEventListener("blur",function(){
    		var length=trim(oDt[0].value);
    		if(!length) 
    		plus.nativeUI.toast("获奖名称不能为空");
    	});
    	var oEduYear = document.getElementById("eduYear");
		var oBtn=document.getElementsByClassName("btn")[0];
		oBtn.addEventListener("click", function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);			
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) { 				
					oEduYear.innerText = rs.text.substr(0,4);				
			});
   })
    	function savePro() {    		  		
    		var $data = {};							
			$data.professorId = userid;
			$data.name =oDt[0].value;
			$data.year = oDt[1].innerText;						
			$data.descp = document.getElementsByClassName("textareabox")[0].innerText;			
			if(ws.edu) {
				$data.id=ws.edu;
			}			
    		$.ajax({
				"url" :baseUrl+"/ajax/honor",
				"type" : ws.edu?"put" :"post",
				"async":true,
				"data" :ws.edu?JSON.stringify($data):$data,
				"contentType" : ws.edu ? "application/json"
						: "application/x-www-form-urlencoded",
				"success" : function(data) {
					var y=JSON.stringify(data)					
					if (data.success) 
					{
						plus.nativeUI.showWaiting();
						var web=plus.webview.getWebviewById("proinforupdate-more.html");
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
		}
    	
    	document.getElementsByClassName("topsave")[0].addEventListener("click",function(){
    		var length1=trim(oDt[0].value);    		   		
    		if(length1) {    			
    			savePro();
    		}else {
    			plus.nativeUI.toast("获奖名称不能为空");
    		}	
    	});
    	if(ws.edu) 
    	document.getElementsByClassName("exitbtn")[0].addEventListener("click",function(){
    		$.ajax({
					"url" : baseUrl+"/ajax/honor/" + ws.edu,
					"type" : "DELETE",
					"success" : function($data) {
						if ($data.success) {
							plus.nativeUI.showWaiting();
							var web=plus.webview.getWebviewById("proinforupdate-more.html");
							mui.fire(web,"newId");						
							mui.back();
						}
						else {
							plus.nativeUI.toast("服务器链接超时", toastStyle);
						}
					}
				});
    	});
	});
})          
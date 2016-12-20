mui.ready(function() {		
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');		
		var ws=plus.webview.currentWebview();		
		var str = JSON.stringify(ws);			
    	var oDt=document.getElementsByClassName("frmtype"); 
    	var oDegree;   	
    	if(ws.descp) {
    		    		
    		$.ajax({
				"url" :baseUrl+"/ajax/edu/"+ws.edu,
				"type" : "get" ,
				"async":true,																	
				"success" : function($data) {					
					if ($data.success) 
					{
						plus.nativeUI.closeWaiting();	; //新webview的载入完毕后关闭等待框
        				ws.show("slide-in-right",150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画    
						$info = $data.data;	
						if($info.year){
							oDt[4].innerText=$info.year;
						}
						oDt[0].value=$info.school;
						 oDt[1].value=$info.college;
						 if(!$info.major)
						 $info.major=""
						 oDt[2].value=$info.major;
						oDt[3].value =$info.degree;	
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
    		plus.nativeUI.toast("学校名称不能为空");
    	});
    	oDt[1].addEventListener("blur",function(){
    		var length=trim(oDt[1].value);
    		if(!length)     			
  		plus.nativeUI.toast("学院不能为空");
    	});
    	oDt[3].addEventListener("change",function(){
    		oDegree=oDt[3].value;
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

		});
    	function savePro() {    		  		
    		var $data = {};							
			$data.professorId = userid;
			$data.year = oDt[4].innerText;
			$data.school =oDt[0].value;
			$data.college = oDt[1].value;
			$data.major = oDt[2].value;
			$data.degree = oDegree;	
			if(ws.edu) {
				$data.id=ws.edu;
			}
    		$.ajax({
				"url" :baseUrl+'/ajax/edu',
				"type" : ws.edu?"put" :"post",
				"async":true,
				"data" :ws.edu?JSON.stringify($data):$data,
				"contentType" : ws.edu ? "application/json"
						: "application/x-www-form-urlencoded",
				"success" : function(data) {
					if (data.success) 
					{  plus.nativeUI.showWaiting();
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
    		var length2=trim(oDt[1].value);   		
    		if(length1&&length2) {    			
    			savePro();
    		}else if(!length1&&length2) {
    			plus.nativeUI.toast("学校名称不能为空");
    		}else if(length1&&!length2) {
    			plus.nativeUI.toast("学院不能为空");
    		}else if(!length1&&!length2) {
    			plus.nativeUI.toast("学校名称不能为空&&学院不能为空");
    		}    		
    	});
    	if(ws.edu) 
    	document.getElementsByClassName("exitbtn")[0].addEventListener("click",function(){
    		$.ajax({
					"url" : baseUrl+"/ajax/edu/" + ws.edu,
					"type" : "DELETE",
					"success" : function($data) {
						if ($data.success) {
							 plus.nativeUI.showWaiting();
							var web=plus.webview.getWebviewById("proinforupdate-more.html");
							mui.fire(web,"newId");						
							mui.back();
						}
						else {
							alert($data.msg);
						}
					}
				});
    	});
	});
})          
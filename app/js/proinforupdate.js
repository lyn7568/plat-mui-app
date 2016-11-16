mui.ready(function() {		
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var oImg=document.getElementsByTagName("img")[0];
		var personalMaterial=document.getElementsByClassName('personalMaterial');
		var personSummary=document.getElementsByClassName("breifinfo")[0];
		window.addEventListener("newId",function(){
			personalMessage();
		})
		//查询学术领域
		var subjectShow = function (data){
				if(data != undefined &&  data.length != 0 ){
					var subs = new Array();				
					if(data.indexOf(',')) {	
						subs = data.split(',');			
					}else {
						subs[0] = data;
					}
					if(subs.length>0) {
						var html = [];
						for (var i = 0; i < subs.length; i++) {
							html.push("<li>"+subs[i]+"</li>");														
						};
						document.getElementsByClassName("infosubject")[0].innerHTML=html.join('');
					}	
				}			
			}
		//查询应用行业		
		var industryShow = function (data){
				if(data != undefined &&  data.length != 0 ){
					var subs = new Array();				
					if(data.indexOf(',')) {	
						subs = data.split(',');			
					}else {
						subs[0] = data;
					}
					if(subs.length>0) {   
						var html = [];
						for (var i = 0; i < subs.length; i++) {
							html.push("<li>"+subs[i]+"</li>");														
						};
						document.getElementsByClassName("infoapply")[0].innerHTML=html.join('');
					}	
				}			
			}
		//查询研究方向
		var getRecords = function ($researchAreaLogs,caption){
			     var ret=[];
			     for(var i = 0 ;i < $researchAreaLogs.length ; i++){
			     	if(caption==$researchAreaLogs[i].caption){
			     		ret.push($researchAreaLogs[i].opreteProfessorId);
			     	}
			     }
			     return ret;
			}
var researchAreaShow = function ($datas,$datarecords){
				if($datas != undefined &&  $datas.length != 0 ){
					 var html = [];
					for(var i =0 ; i< $datas.length;++i) {
						var $data = $datas[i];
						var $photos = [];
						//获取头像
						if($datarecords.length>0) {
							$photos = getRecords($datarecords,$data.caption);
						}
						var showDiv= "<div class='listbox'><div class='listbrowse mui-ellipsis'><span class='like'>"+$data.count+"</span>"+$data.caption+"</div><span class='plusbtn' data-isagree='-1'></span><div class='likenum'>";
						if($photos.length>10) {
							showDiv += "<div class='triangleR'></div>";
						}
						if($photos.length>0) {
							for(var j =0 ; j< $photos.length;++j) {							
								showDiv += "<span class='likepeople'><img class='like-h' src='../images/head/"+$photos[j]+"_s.jpg'></span>";							
							} 
						}
						showDiv += "</div></div>";
						html.push(showDiv);	
					}
					document.getElementsByClassName("reserachMess")[0].innerHTML=html.join('')
				}			
			}

		//获取头像
		function personalMessageHeadImage() {
			mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					var str = JSON.stringify(data.data);										
					if(data.data.hasHeadImage) {						
						oImg.src="../images/head/" + userid + "_m.jpg";						
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		//获取个人的信息
		function personalMessage() {
			console.log(1);  
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
				
					var str = JSON.stringify(data.data);
					var $data=data.data;																									
					personalMaterial[0].innerText=$data.name; 										
					//基本信息
					if(!$data.authentication) {						
						document.getElementsByClassName('authword')[0].innerText="未认证";
						document.getElementsByClassName('authword')[0].style.backgroundColor="#cccccc";
					}
					if($data.office) {
						personalMaterial[1].innerText=$data.office;             
					}else {  
						personalMaterial[1].parentNode.style.display="none";  
					}
					if($data.title) {
						personalMaterial[2].innerText=$data.title;
					}else {
						personalMaterial[2].parentNode.style.display="none";
					}
					if($data.orgName) {
						personalMaterial[3].innerText=$data.orgName;
					}else {
						personalMaterial[3].parentNode.style.display="none";
					}
					if($data.department) {
						personalMaterial[4].innerText=$data.department;
					}else {
						personalMaterial[4].parentNode.style.display="none";
					}
					if($data.address) {
						personalMaterial[5].innerText=$data.address;
					}else {
						personalMaterial[5].parentNode.style.display="none";
					}	  
					//个人简介
					
					if($data.descp) {
						personSummary.innerHTML=$data.descp;  
					}
					//学术领域
					if($data.subject) {
						subjectShow($data.subject);
					}
					//研究方向
					if($data.researchAreas.length) {
								console.log($data.researchAreaLogs);
								console.log($data.researchAreas)
								researchAreaShow($data.researchAreas,$data.researchAreaLogs);
					}
					//应用行业
					if($data.industry) {
								industryShow($data.industry);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		//我的所有资源、
		function resource(){
	mui.ajax(baseUrl + "/ajax/resource/qapro", {
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		data:{"professorId":userid},
		timeout: 10000, //超时设置
		success: function(data) {
			
			var str = JSON.stringify(data.data);			
			var $data=data.data;
			var html=[];
			for(var i=0;i<data.data.length;i++) {
				 var string='<li class="mui-table-view-cell mui-media">'
				                string+='<a class="proinfor" href="resinforupdate.html">'
				                	if($data[i].images.length) {				                		
				                		string+='<img class="mui-media-object mui-pull-left resimg" src="../images/resource/'+$data[i].resourceId+'.jpg">'
				                		console.log('../images/resource/'+$data[i].resourceId+'.jpg')
				                	} else{
				                		
				                		string+='<img class="mui-media-object mui-pull-left resimg" src="../images/default-resource.jpg">'
				                	}				                    
				                    string+='<div class="mui-media-body">'
				                        string+='<span class="listtit">'+$data[i].resourceName+'<div class="updatebox" style="top:6px;right:6px;"><em class="updatebtn"></em></div></span>'
				                        string+='<p class="listtit2">'+$data[i].supportedServices+'</p>'
				                    	string+='<p class="listtit3 resbrief">'
				                    		if($data[i].descp) {
				                    			string+=$data[i].descp;
				                    		}
				                    	string+='</p></div></a></li>'
				                    	html.push(string);				                    
			}
			document.getElementById("resourceList").innerHTML=html.join('');    
		},		
		error: function() {  
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}		
	//个人信息修改
	document.getElementsByClassName("updatebox")[0].addEventListener("tap",function(){
		var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框  
		var arr={name:personalMaterial[0].innerText,office:personalMaterial[1].innerText,
				title:personalMaterial[2].innerText,orgName:personalMaterial[3].innerText,
				department:personalMaterial[4].innerText,address:personalMaterial[5].innerText
		}
		console.log(arr);
    	webviewShow = plus.webview.create("../html/updateinfo1.html","../html/updateinfo1.html",{},arr);//后台创建webview并打开show.html   	    	
    	webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
        nwaiting.close(); //新webview的载入完毕后关闭等待框
        webviewShow.show("slide-in-right",150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
    }, false);		
	});
	document.getElementsByClassName("updatebox")[1].addEventListener("tap",function(){
		var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框  
		var arr={descp:personSummary.innerText}				
		
		console.log(arr);
    	webviewShow = plus.webview.create("../html/updateinfo2.html","updateinfo2.html",{},arr);//后台创建webview并打开show.html   	    	
    	webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
        nwaiting.close(); //新webview的载入完毕后关闭等待框
        webviewShow.show("slide-in-right",150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
    }, false);		
	})
		personalMessageHeadImage();  
		personalMessage();
		resource();  
	});	
});

  
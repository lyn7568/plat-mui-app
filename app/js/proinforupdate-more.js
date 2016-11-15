mui.ready(function() {		
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		//查询教育背景
var eduBgShow = function(data) {	    
				if(data.length>0){					
					var html=[];
					for (var i = 0; i < data.length; i++) {						
							var string='<li class="mui-table-view-cell mui-media listitem">'
				               	   string+='<a href="javascript:;">'
				               	   string+='<div class="mui-media-object mui-pull-left iconposition">'
				                   string+='<img class="" src="../images/icon-edu.png">'
				                   string+='</div>'
				                   string+='<div class="mui-media-body">'
				                   if(data[i].school) {
				                   		 string+='<div class="listtit2">'+data[i].school+'<div class="updatebox"><em class="updatebtn"></em></div></div>'	
				                   }				                       
				                   string+='<p class="listtit3 mutlinebox">'
				                    if(data[i].college) {
				                       	string+=data[i].college+"，";
				                       }
				                    if(data[i].major) {
				                       	string+=data[i].major+"，";
				                       }
				                    if(data[i].degree) {
				                       	string+=data[i].degree;
				                       }				                       
				                    string+='</p>'
				                    if(data[i].year) {
				                       	 string+='<p class="listtit3">'+data[i].year+'</p>'
				                       }									   
				                    string+='</div></a></li>'
								html.push(string);
					}
					document.getElementById("education").innerHTML=html.join('');
				}
			}
	//查询工作经历
	var timeJobShow = function(data) {

				if(data.length>0){
					var html=[];
					for (var i = 0; i < data.length; i++) {   
						var string='<li class="mui-table-view-cell mui-media listitem">'
				               string+='<a href="updateinfo7.html">'
				               	   string+='<div class="mui-media-object mui-pull-left iconposition">'
				                   string+='<img class="" src="../images/icon-work.png"></div>'				                   
				                   string+='<div class="mui-media-body">'
				                       string+='<div class="listtit2">'
				                       if(data[i].company) {
				                       		string+=data[i].company;
				                       }
				                       string+='<div class="updatebox"><em class="updatebtn"></em></div></div>'
				                       string+='<p class="listtit3">'
				                       if(data[i].title) {
				                       	string+=data[i].title;
				                       }				                      
				                       string+='</p>'
									   string+='<p class="listtit3">'
									   if(data[i].startMonth) {
									   	string+=data[i].startMonth+"-";
									   }
									   if(data[i].stopMonth) {
									   	string+=data[i].stopMonth;
									   }
									   string+='</p>'
				                   string+='</div></a></li>'
				               html.push(string);			           
					} 
					document.getElementById("soJob").innerHTML=html.join('');
				}
			}
	//项目经历
	var projectShow = function(data){		
				if(data.length>0){
					var html=[];
					for (var i = 0; i < data.length; i++) {   
						 var string='<li class="mui-table-view-cell mui-media listitem">'
				              string+='<a href="updateinfo8.html">'
				              string+='<div class="mui-media-object mui-pull-left iconposition">'
				              string+='<img class="" src="../images/icon-project.png">'
				              string+='</div>'
				              string+='<div class="mui-media-body">'
				              string+='<div class="listtit2">'
				              if(data[i].name) {
				                       	 string+=data[i].name;
				                       }
				              string+=' <div class="updatebox"><em class="updatebtn"></em></div></div>'
				              string+='<p class="listtit3">'				              
				              if(data[i].startMonth) {
				                       	 string+=data[i].startMonth+"  -  "; 
				                       }
				              if(data[i].stopMonth) {
				                       	 string+=data[i].stopMonth;
				                       }
				              '</p>'
							  string+='<p class="listtit3 mutlinebox">'
							  if(data[i].descp) {
									   	string+=data[i].descp;
									   }
						      string+='</p>'
				              string+='</div></a></li>'
				              html.push(string);
					} 
					document.getElementById("projectExperience").innerHTML=html.join('');
				}
			}
	//著作论文文章
	var paperShow = function(data){
		
				if(data.length>0){
					var html=[];
					for (var i = 0; i < data.length; i++) {  
						var string='<li class="mui-table-view-cell mui-media listitem">'
				               string+='<a href="updateinfo9.html">'
				               	   string+='<div class="mui-media-object mui-pull-left iconposition">'
				                   		string+='<img class="" src="../images/icon-acad.png">'
				                   string+='</div>'
				                   string+='<div class="mui-media-body">'
				                       string+='<div class="listtit2">'
				                       if(data[i].name) {
				                       		 string+=data[i].name;
				                       }
				                       string+='<div class="updatebox"><em class="updatebtn"></em></div></div>'
				                       string+='<p class="listtit3">'
				                       if(data[i].year) {
				                       		string+="发表于"+data[i].year+"年";
				                       }
				                       '</p>'
									   string+='<p class="listtit3 mutlinebox">'
									   if(data[i].descp) {
									   	string+=data[i].descp;
									   }
									   '</p>'
				                   string+='</div></a></li>'
				               		html.push(string);
					}
					document.getElementById("paperExperience").innerHTML=html.join('');
				}
			}
	//查询专利
	var patentShow = function(data){
				if(data.length>0){
					console.log(data);   
					var html=[];
					for (var i = 0; i < data.length; i++) {						
						var string='<li class="mui-table-view-cell mui-media listitem">'
				               string+='<a href="updateinfo10.html">'
				               string+='<div class="mui-media-object mui-pull-left iconposition">'
				               string+='<img class="" src="../images/icon-mono.png">'
				               string+='</div>'
				               string+='<div class="mui-media-body">'
				               string+='<div class="listtit2">'
				              	if(data[i].name) {
				              		string+=data[i].name;
				              	}  
				               string+='<div class="updatebox"><em class="updatebtn"></em></div></div>'
				               string+='<p class="listtit3">'
				               if(data[i].year) {
				               	string+="发表于"+data[i].year+"年";
				               }
				               string+='</p>'
							   string+='<p class="listtit3 mutlinebox">'
							   	if(data[i].descp) {
							   		string+=data[i].descp;  
							   	}  
							   string+='</p>'
				               string+='</div></a></li>'
				               html.push(string);
					}
					document.getElementById("patentExperience").innerHTML=html.join('');
				}
		}	
	//
			var honorShow = function(data){
				if(data.length>0){
					var html=[];
					for (var i = 0; i < data.length; i++) {						
						var string='<li class="mui-table-view-cell mui-media listitem">'
				               string+='<a class="addinfobox mui-clearfix" href="updateinfo11.html">'
				               string+='<div class="mui-media-object mui-pull-left iconposition">'
				               string+='<img class="" src="../images/icon-honor.png">'
				               string+='</div>'
				               string+='<div class="mui-media-body">'
				               string+='<div class="listtit2">'
				              	if(data[i].name) {
				              		string+=data[i].name;  
				              	}  
				               string+='<div class="updatebox"><em class="updatebtn"></em></div></div>'
				               string+='<p class="listtit3">'
				               if(data[i].year) {
				               	string+="发表于"+data[i].year+"年";
				               }
				               string+='</p>'
							   string+='<p class="listtit3 mutlinebox">'
							   	if(data[i].descp) {
							   		string+=data[i].descp;  
							   	}  
							   string+='</p>'
				               string+='</div></a></li>'
				               html.push(string);  
					}
					document.getElementById("honor").innerHTML=html.join('');
				}
				}
			
		function personalMessage() {			
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型   
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					var str = JSON.stringify(data.data);
					var $data=data.data;
					console.log(str);					
					//教育背景					
					if($data.edus.length) {
								eduBgShow($data.edus);
					}
					//工作经历
					if ($data.jobs.length) {
								timeJobShow($data.jobs);
							}
					//项目经历
					if ($data.projects.length) {
								projectShow($data.projects);
							}
					//著作 论文 文章
					if ($data.papers.length) {
								paperShow($data.papers);
							}
					//专利
					if ($data.patents.length) {
								patentShow($data.patents);
							}
				    if ($data.honors.length) {
								honorShow($data.honors);
							}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		
		personalMessage();
	})
	})
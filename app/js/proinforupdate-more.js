mui.ready(function() {		
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		window.addEventListener("newId",function(){			
			personalMessage();						
		})
		//查询教育背景
var eduBgShow = function(data) {	    
				if(data.length>0){					
					var html=[];
					for (var i = 0; i < data.length; i++) {						
							var string='<li class="mui-table-view-cell mui-media listitem">'
				               	   string+='<a>'
				               	   string+='<div class="mui-media-object mui-pull-left iconposition " >'
				                   string+='<img class="" src="../images/icon-edu.png">'
				                   string+='</div>'
				                   string+='<div class="mui-media-body">'
				                   if(data[i].school) {
							string += '<div class="listtit2 mutlinebox mutlinebox">' + data[i].school + '<div class="updatebox updatebox2 edu" title=' + data[i].id + '><em class="mui-icon mui-icon-compose updatebtn"></em></div></div>'
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
				                       	 string+='<p class="listtit3">毕业于'+data[i].year+'年</p>'
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
				               string+='<a >'
				               	   string+='<div class="mui-media-object mui-pull-left iconposition">'
				                   string+='<img class="" src="../images/icon-work.png"></div>'				                   
				                   string+='<div class="mui-media-body">'
				                       string+='<div class="listtit2 mutlinebox mutlinebox">'
				                       if(data[i].company) {
				                       		string+=data[i].company;
				                       }
						string += '<div class="updatebox updatebox2 job" title=' + data[i].id + '><em class="mui-icon mui-icon-compose updatebtn"></em></div></div>'
						string += '<p class="listtit3">'
						if(data[i].title) {
							string += data[i].title + "，";
						}
						if(data[i].department) {
							string += data[i].department;
						}
						string += '</p>'
						string += '<p class="listtit3">'
						if(data[i].startMonth) {
							string += data[i].startMonth.substr(0, 4) + "年" + data[i].startMonth.substr(4, 6) + "月" + "-";
						}
						if(data[i].stopMonth) {
							string += data[i].stopMonth.substr(0, 4) + "年" + data[i].stopMonth.substr(4, 6) + "月";
						}
						string += '</p>'
						string += '</div></a></li>'
						html.push(string);
					}
					document.getElementById("soJob").innerHTML = html.join('');
				}
			}
			//项目经历
		var projectShow = function(data) {
				if(data.length > 0) {
					var html = [];
					for(var i = 0; i < data.length; i++) {
						var string = '<li class="mui-table-view-cell mui-media listitem">'
						string += '<a>'
						string += '<div class="mui-media-object mui-pull-left iconposition">'
						string += '<img class="" src="../images/icon-project.png">'
						string += '</div>'
						string += '<div class="mui-media-body">'
						string += '<div class="listtit2 mutlinebox mutlinebox">'
						if(data[i].name) {
							string += data[i].name;
						}
						string += ' <div class="updatebox updatebox2 project" title=' + data[i].id + '><em class="mui-icon mui-icon-compose updatebtn"></em></div></div>'
						string += '<p class="listtit3">'
						if(data[i].startMonth) {
							string += data[i].startMonth.substr(0, 4) + "年" + data[i].startMonth.substr(4, 6) + "月" + "-";
						}
						if(data[i].stopMonth) {
							string += data[i].stopMonth.substr(0, 4) + "年" + data[i].stopMonth.substr(4, 6) + "月";
						}
						'</p>'
						string += '<p class="listtit3 mutlinebox">'
						if(data[i].descp) {
							string += data[i].descp;
						}
						string += '</p>'
						string += '</div></a></li>'
						html.push(string);
					}
					document.getElementById("projectExperience").innerHTML = html.join('');
				}
			}
			//著作论文文章
		var paperShow = function(data) {

				if(data.length > 0) {
					var html = [];
					for(var i = 0; i < data.length; i++) {
						var string = '<li class="mui-table-view-cell mui-media listitem">'
						string += '<a>'
						string += '<div class="mui-media-object mui-pull-left iconposition">'
						string += '<img class="" src="../images/icon-acad.png">'
						string += '</div>'
						string += '<div class="mui-media-body">'
						string += '<div class="listtit2 mutlinebox mutlinebox">'
						if(data[i].name) {
							string += data[i].name;
						}
						string += '<div class="updatebox updatebox2 paper" title=' + data[i].id + '><em class="mui-icon mui-icon-compose updatebtn"></em></div></div>'
						string += '<p class="listtit3">'
						if(data[i].year) {
							string += "发表于" + data[i].year + "年";
						}
						'</p>'
						string += '<p class="listtit3 mutlinebox">'
						if(data[i].descp) {
							string += data[i].descp;
						}
						'</p>'
						string += '</div></a></li>'
						html.push(string);
					}
					document.getElementById("paperExperience").innerHTML = html.join('');
				}
			}
			//查询专利
		var patentShow = function(data) {
				if(data.length > 0) {
					var html = [];
					for(var i = 0; i < data.length; i++) {
						var string = '<li class="mui-table-view-cell mui-media listitem">'
						string += '<a>'
						string += '<div class="mui-media-object mui-pull-left iconposition">'
						string += '<img class="" src="../images/icon-mono.png">'
						string += '</div>'
						string += '<div class="mui-media-body">'
						string += '<div class="listtit2 mutlinebox mutlinebox">'
						if(data[i].name) {
							string += data[i].name;
						}
						string += '<div class="updatebox updatebox2 patent" title=' + data[i].id + '><em class="mui-icon mui-icon-compose updatebtn"></em></div></div>'
						string += '<p class="listtit3">'
						if(data[i].year) {
							string += "发表于" + data[i].year + "年";
						}
						string += '</p>'
						string += '<p class="listtit3 mutlinebox">'
						if(data[i].descp) {
							string += data[i].descp;
						}
						string += '</p>'
						string += '</div></a></li>'
						html.push(string);
					}
					document.getElementById("patentExperience").innerHTML = html.join('');
				}
			}
			//
		var honorShow = function(data) {
			if(data.length > 0) {
				var html = [];
				for(var i = 0; i < data.length; i++) {
					var string = '<li class="mui-table-view-cell mui-media listitem">'
					string += '<a class="addinfobox mui-clearfix">'
					string += '<div class="mui-media-object mui-pull-left iconposition">'
					string += '<img class="" src="../images/icon-honor.png">'
					string += '</div>'
					string += '<div class="mui-media-body">'
					string += '<div class="listtit2 mutlinebox mutlinebox">'
					if(data[i].name) {
						string += data[i].name;
					}
					string += '<div class="updatebox updatebox2 honor" title=' + data[i].id + '><em class="mui-icon mui-icon-compose updatebtn"></em></div></div>'
					string += '<p class="listtit3">'
					if(data[i].year) {
						string += "获得于" + data[i].year + "年";
					}
					string += '</p>'
					string += '<p class="listtit3 mutlinebox">'
					if(data[i].descp) {
						string += data[i].descp;
					}
					string += '</p>'
					string += '</div></a></li>'
					html.push(string);
				}
				document.getElementById("honor").innerHTML = html.join('');
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
					var web=plus.webview.currentWebview()
					 plus.nativeUI.closeWaiting();			
        			web.show("slide-in-right",150); 					
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
		//增加教育背景
		document.getElementsByClassName("addinfobox")[0].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				descp: 0
			}
			var webv = plus.webview.create("../html/updateinfo6.html", "updateinfo6.html", {}, arr); //后台创建webview并打开show.html   	    	
			webv.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webv.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		mui("#education").on("tap", ".edu", function() {
			var eduId = this.attributes["title"].value;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				descp: 1,
				edu: eduId
			};
			var webv = plus.webview.create("../html/updateinfo6.html", "updateinfo6.html", {}, arr); //后台创建webview并打开show.html   	    	
			webv.addEventListener("loaded", function() { //注册新webview的载入完成事件       
			}, false);
		});
		//工作经历
		document.getElementsByClassName("addinfobox")[1].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  

			var webv1 = plus.webview.create("../html/updateinfo7.html", "updateinfo7.html"); //后台创建webview并打开show.html   	    	
			webv1.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webv1.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		mui("#soJob").on("tap", ".job", function() {
			var eduId = this.attributes["title"].value;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				edu: eduId
			};
			var webv = plus.webview.create("../html/updateinfo7.html", "updateinfo7.html", {}, arr); //后台创建webview并打开show.html   	    	
			webv.addEventListener("loaded", function() { //注册新webview的载入完成事件       
			}, false);
		});
		//项目经历
		document.getElementsByClassName("addinfobox")[2].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  										
			var webv1 = plus.webview.create("../html/updateinfo8.html", "updateinfo8.html"); //后台创建webview并打开show.html   	    	
			webv1.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webv1.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		mui("#projectExperience").on("tap", ".project", function() {
			var eduId = this.attributes["title"].value;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				edu: eduId
			};
			var webv = plus.webview.create("../html/updateinfo8.html", "updateinfo8.html", {}, arr); //后台创建webview并打开show.html   	    	
			webv.addEventListener("loaded", function() { //注册新webview的载入完成事件       
			}, false);
		});
		//著作论文文章
		document.getElementsByClassName("addinfobox")[3].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  

			var webv1 = plus.webview.create("../html/updateinfo9.html", "updateinfo9.html"); //后台创建webview并打开show.html   	    	
			webv1.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webv1.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		mui("#paperExperience").on("tap", ".paper", function() {
			var eduId = this.attributes["title"].value;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				edu: eduId
			};
			var webv = plus.webview.create("../html/updateinfo9.html", "updateinfo9.html", {}, arr); //后台创建webview并打开show.html   	    	
			webv.addEventListener("loaded", function() { //注册新webview的载入完成事件       
			}, false);
		});
		//专利
		document.getElementsByClassName("addinfobox")[4].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  

			var webv1 = plus.webview.create("../html/updateinfo10.html", "updateinfo10.html"); //后台创建webview并打开show.html   	    	
			webv1.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webv1.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		mui("#patentExperience").on("tap", ".patent", function() {
			var eduId = this.attributes["title"].value;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				edu: eduId
			};
			var webv = plus.webview.create("../html/updateinfo10.html", "updateinfo10.html", {}, arr); //后台创建webview并打开show.html   	    	
			webv.addEventListener("loaded", function() { //注册新webview的载入完成事件       
			}, false);
		});
		//荣誉
		document.getElementsByClassName("addinfobox")[5].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  

			var webv1 = plus.webview.create("../html/updateinfo11.html", "updateinfo11.html"); //后台创建webview并打开show.html   	    	
			webv1.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webv1.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		mui("#honor").on("tap", ".honor", function() {
			var eduId = this.attributes["title"].value;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				edu: eduId
			};
			var webv = plus.webview.create("../html/updateinfo11.html", "updateinfo11.html", {}, arr); //后台创建webview并打开show.html   	    	
			webv.addEventListener("loaded", function() { //注册新webview的载入完成事件       
			}, false);
		});

		personalMessage();
	})
	})
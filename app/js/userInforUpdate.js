mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var fl;
		var prose={};
		//学术领域及应用行业关键词数量
		function tagNum(obj) {
			if(obj.data) {
				if(obj.data.indexOf(",")) {
					document.getElementById(obj.selector).innerHTML = obj.data.split(',').length;
				} else {
					document.getElementById(obj.selector).innerHTML = 1;
				}
			} else {
				document.getElementById(obj.selector).innerHTML = 0;
			}
		}
		//
		function timeT(obj) {
			var a, b;
			if(obj.startMonth) {
				if(obj.startMonth.substring(4, 1) == 0) {
					a = obj.startMonth.substring(0, 4) + "年" + obj.startMonth.substring(5, 6) + "月";
				} else {
					a = obj.startMonth.substring(0, 4) + "年" + obj.startMonth.substring(4, 6) + "月";
				}
			} else {
				a = "";
			}
			if(obj.stopMonth) {
				if(obj.stopMonth.substring(4, 1) == 0) {
					b = obj.stopMonth.substring(0, 4) + "年" + obj.stopMonth.substring(5, 6) + "月";
				} else {
					b = obj.stopMonth.substring(0, 4) + "年" + obj.stopMonth.substring(4, 6) + "月";
				}
			} else {
				if(a) {
					b = "至今"
				} else {
					b = "";
					return "";
				}

			}
			return a + " - " + b;
		}
		//项目经历
		var projectShow = function(obj) {
			if(obj.data.length > 0) {
				var arr = [];
				for(var i = 0; i < obj.data.length; i++) {
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitem">'
						var name = obj.data[i].name;
					} else {
						var str = '<li class="mui-table-view-cell listitem">'
						var name = obj.data[i].company;
					}
					var os = '<div class="h4Tit listtit2">' + name + '</div>' +
						' <p class="listtit3">' + timeT({
							startMonth: obj.data[i].startMonth,
							stopMonth: obj.data[i].stopMonth
						}) + '</p></li>'
					arr.push(str + os);
				}
				document.getElementById(obj.selector).innerHTML = arr.join('');
			}
		}
		//荣誉奖项
		var honorShow = function(obj) {
			if(obj.data.length > 0) {
				var arr = [];	                  
				for(var i = 0; i < obj.data.length; i++) {
					
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitem">'
						var name = obj.data[i].name;
						if(obj.data[i].year) {
							var year='发表于'+obj.data[i].year+'年'
						}else{
							var year="至今";
						}
						
					} else {
						var str = '<li class="mui-table-view-cell mui-media listitem">'
						var name = obj.data[i].school;
						//console.log(obj.data[i].year);
						if(obj.data[i].year) {
							if(obj.data[i].year!="至今  ") {
								var year='毕业于'+obj.data[i].year+'年'
							}else{
								var year="至今";
							}
							
						}else{
							var year="";
						}
					}
					var os = '<div class="h4Tit listtit2">' + name + '</div>' +
						' <p class="listtit3">' + year + '</p></li>'
					arr.push(str + os);
				}
				document.getElementById(obj.selector).innerHTML = arr.join('');
			}
		}
		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						
						plus.nativeUI.closeWaiting();
						if(!fl) {
							plus.webview.currentWebview().show("slide-in-right", 150);
						}
						var $data = data.data;
						console.log(JSON.stringify($data.researchAreas));
						document.getElementById("name").innerText = $data.name;
						//头像					
						if($data.hasHeadImage) {
							var mun = Math.round(Math.random() * 99 + 1);
							document.getElementById("userimg").style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg?" + mun + ")";
						}
						if($data.descp) {
							prose.descp=$data.descp;
						}else{
							prose.descp=""
						}
						//学术领域
						tagNum({
							selector: 'subjectNum',
							data: $data.subject
						});
						if($data.subject) {
							prose.subject=$data.subject;
						}
						//研究方向
						//学术领域
						if($data.researchAreas.length) {
							document.getElementById("researchAreaNum").innerHTML = $data.researchAreas.length;
							prose.researchAreas=$data.researchAreas;
						}else{
							document.getElementById("researchAreaNum").innerHTML =0;
						}
						
						//应用行业
						tagNum({
							selector: 'industryNum',
							data: $data.industry
						});
						if($data.industry) {
							prose.industry=$data.industry;
						}
						//项目经历
						if($data.projects.length) {
							projectShow({
								data: $data.projects,
								selector: 'projectExperience',
								flag: 1
							});
							prose.projects=$data.projects;
						}
						//工作经历
						if($data.jobs.length) {
							projectShow({
								data: $data.jobs,
								selector: 'soJob',
								flag: 2
							});
						}
						//荣誉奖项
						if($data.honors.length) {
							honorShow({
								data: $data.honors,
								selector: 'honor',
								flag: 1
							});
						}
						//教育背景
						if($data.edus.length) {
							honorShow({
								data: $data.edus,
								selector: 'education',
								flag: 2
							});
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		personalMessage();
		window.addEventListener("newId", function(event) {
			if(event.detail.rd==1) {
				fl = event.detail.rd;
			}
			 if(event.detail.obre) {
			 	 prose.descp=event.detail.obre;
			 }
			if(event.detail.subject) {
			 	 prose.subject=event.detail.subject;
			 }
			personalMessage();
		})
		//进入基本信息浏览页面
		function openNewWebview(obj) {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/"+obj.html+"",obj.id, {}, obj.data);
		}
		function bindEvent(obj) {
			document.getElementById(obj.selector).addEventListener('tap',function(){
			openNewWebview(obj.web);
		})
		}
		bindEvent({selector:"editProfile",web:{html:'updateBasic.html',id:"updateBasic.html",data:{}}})
		bindEvent({selector:"breif",web:{html:'updateProfile.html',id:"updateProfile.html",data:prose}})
		bindEvent({selector:"subject",web:{html:'updateAcad.html',id:"updateAcad.html",data:prose}})
		bindEvent({selector:"industry",web:{html:'updataIndustry.html',id:"updataIndustry.html",data:prose}})
		bindEvent({selector:"researchArea",web:{html:'updateResearch.html',id:"updateResearch.html",data:prose}})
		bindEvent({selector:"oproject",web:{html:'updateProject.html',id:"updateProject.html",data:prose}})
		bindEvent({selector:"oJob1",web:{html:'updateJob.html',id:"updateJob.html",data:prose}})
		//荣誉奖项
		bindEvent({selector:"ohonor",web:{html:'updateHonor.html',id:"updateHonor.html",data:prose}});
		//教育背景
		bindEvent({selector:"oeduction",web:{html:'updateEdu.html',id:"updateEdu.html",data:prose}});
	})
})
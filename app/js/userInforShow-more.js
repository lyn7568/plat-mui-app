mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var proId = self.pId;
		var oDe = {
			1: "博士",
			2: "硕士",
			3: "学士",
			4: "大专",
			5: "其他"
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
					var odescp="";
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitem">'
						var name = obj.data[i].name;
					} else {
						var str = '<li class="mui-table-view-cell listitem">'
						var name = obj.data[i].company;
					}
					if(obj.data[i].descp) {
						odescp = obj.data[i].descp
					}
					var os = '<div class="h4Tit listtit2">' + name + '</div>' +
						' <p class="listtit3">' + timeT({
							startMonth: obj.data[i].startMonth,
							stopMonth: obj.data[i].stopMonth
						}) + '</p><p class="listtit3 mutlinebox">' + odescp + '</p></li>'
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
					var odescp = "";
					var ode = ""
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitem">'
						var name = obj.data[i].name;
						if(obj.data[i].year) {
							var year = '发表于' + obj.data[i].year + '年'
						} else {
							var year = "";
						}
						if(obj.data[i].descp) {
							var odescp = '<p class="listtit3 mutlinebox">' + obj.data[i].descp + '</p>'
						}
					} else {
						var str = '<li class="mui-table-view-cell mui-media listitem">'
						var name = obj.data[i].school;
						//console.log(obj.data[i].year);
						if(obj.data[i].year) {
							if(obj.data[i].year != "至今 ") {
								var year = '毕业于' + obj.data[i].year + '年'
							} else {
								var year = "";
							}
							var arrq = [];
							if(obj.data[i].degree) {
								arrq.push(obj.data[i].degree);
							}
							if(obj.data[i].major) {
								arrq.push(obj.data[i].major);
							}
							if(obj.data[i].college) {
								arrq.push(obj.data[i].college);
							}
							if(arrq.length) {
								ode = '<p class="listtit3 mutlinebox">' + arrq.join(",") + '</p>'
							}
						} else {
							var year = "";
						}
					}
					var os = '<div class="h4Tit listtit2">' + name + '</div>' +
						' ' + ode + '<p class="listtit3">' + year + '</p>' + odescp + '</li>'
					arr.push(str + os);
				}
				document.getElementById(obj.selector).innerHTML = arr.join('');
			}
		}

		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						plus.nativeUI.closeWaiting();
						plus.webview.currentWebview().show("slide-in-right", 150);
						var $data = data.data;
						if($data.descp) {
							document.getElementById("descp").innerHTML = $data.descp;
						} else {
							document.getElementById("professorBreifinfo").style.display = "none";
						}
						//项目经历
						if($data.projects.length) {
							projectShow({
								data: $data.projects,
								selector: 'projectExperience',
								flag: 1
							});
						} else {
							document.getElementById("perfessorExperience").style.display = "none";
						}
						//工作经历
						if($data.jobs.length) {
							projectShow({
								data: $data.jobs,
								selector: 'soJob',
								flag: 2
							});
						} else {
							document.getElementById("perfessorsoJob").style.display = "none";
						}
						//荣誉奖项
						if($data.honors.length) {
							honorShow({
								data: $data.honors,
								selector: 'honor',
								flag: 1
							});
						} else {
							document.getElementById("perfessorhonor").style.display = "none";
						}
						//教育背景
						if($data.edus.length) {
							honorShow({
								data: $data.edus,
								selector: 'education',
								flag: 2
							});
						} else {
							document.getElementById("perfessorEducation").style.display = "none";
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
			if(event.detail.rd == 1) {
				fl = event.detail.rd;
			}
			if(event.detail.obre) {
				prose.descp = event.detail.obre;
			}
			if(event.detail.subject) {
				prose.subject = event.detail.subject;
			}
			personalMessage();
		})
	})
})
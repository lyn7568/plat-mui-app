mui.ready(function() {
	var rows = 20,
		dataC = {
			time: "",
			id: ""
		};
	var pulldownRefresh = function() {
			setTimeout(function() {
				onePage();
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			}, 1000);
		},
		pullupRefresh = function() {
			setTimeout(function() {
				morePage();
				mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			}, 1000);
		}
	var oAjax = function(url, dataS, otype, oFun) {
			mui.ajax(baseUrl + url, {
				dataType: 'json',
				type: otype,
				data: dataS,
				success: function(res) {
					if(res.success) {
						//console.log(JSON.stringify(res))
						oFun(res)
					}
				}
			});
		},
		onePage = function() {
			document.getElementById("questList").innerHTML=""
			oAjax("/ajax/question", {
				"rows": rows
			},"get", myConList)
		},
		morePage = function() {
			oAjax("/ajax/question", {
				"time": dataC.time,
				"id": dataC.id,
				"rows": rows
			},"get", myConList)
		},
		myConList = function(res) {
			var $info = res.data;
			if($info.length > 0) {
				dataC.time = res.data[res.data.length - 1].createTime;
				dataC.id = res.data[res.data.length - 1].id;
		
				for(var i = 0; i < $info.length; i++) {
					var liStr = document.createElement("li");
					liStr.className = "mui-table-view-cell";
					liStr.setAttribute("data-id", $info[i].id);
					document.getElementById("questList").appendChild(liStr);
					myConHtml($info[i], liStr);
				}
				if($info.length > rows) {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				}
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		},
		myConHtml = function(dataStr, liStr) {
			var baImg = "../images/default-q&a.jpg";
			var subs = new Array();
			if(dataStr.img) {
				if(dataStr.img.indexOf(',')) {
					subs = dataStr.img.split(',');
				} else {
					subs[0] = dataStr.img;
				}
				baImg = baseUrl + "/data/question"+ subs[0];
			}
			var hd = "";
			if(dataStr.replyCount > 0) {
				hd = '<span>' + dataStr.replyCount + ' 回答</span>'
			}
			liStr.className = "mui-table-view-cell";
			liStr.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
				'<div class="madiaHead qa-Head" style="background-image:url(' + baImg + ')"></div>' +
				'<div class="madiaInfo OmadiaInfo">' +
				'<p class="mui-ellipsis-2 h1Font">' + dataStr.title + '</p>' +
				'<p class="show-item mui-ellipsis h2Font">' + hd + '<span class="attendCount"></span></p>' +
				'</div></div>'
			var $str = $(liStr);
			attendCount(dataStr.id, $str);
        },
		attendCount=function(id, $str) {
			oAjax("/ajax/watch/countProfessor", {
				id:id,
				type: 8
			}, "get", function(data) {
				if(data.success) {
					if(data.data > 0) {
						$str.find(".attendCount").html(data.data + "关注");
					}
				}
			})
		},
		inviteStatus = function(id, $str) {
			oAjax("/ajax/question/invite", {
				"qid": qid,
				"pid": id,
				"uid": userid,
			}, "get", function(res) {
				if(res.data.length>0){
					$str.find(".yaoqing").addClass("yiyaoqing");
					$str.find(".yaoqing").html("已邀请");
					$str.find(".yaoqing").attr("data-type","0");
				}else{
					$str.find(".yaoqing").text("邀请")
					$str.find(".yaoqing").attr("data-type","1");
				}
			});
		}
		
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				height: 50,
				callback: pullupRefresh
			},
			down: {
				auto: true,
				callback: pulldownRefresh
			}
		}
	});
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
			plus.nativeUI.closeWaiting();
			self.show("slide-in-right", 150);

		mui("#questList").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-question-show.html", 'qa-question-show.html', {}, {
				quid: id
			});
		})
		
		
	})

})	


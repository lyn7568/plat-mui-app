mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh,
			auto: true
		}
	}
});
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	mui('#pullrefresh').pullRefresh().refresh(true);
	count = 1;
	setTimeout(function() {
		mui.plusReady(function() {
			for(var i in obj) {
				if(obj.uid == obj[i] || obj.rows == obj[i]) {
					continue;
				}
				if(obj.time == obj[i] || obj.mid == obj[i])
					delete obj[i];

			}
			informList(obj);
		})
	}, 1000);
}
var count,
	obj = {
		rows: 20
	};
/**
 * 上拉加载具体业务实现
 */

function pullupRefresh() {

	mui.plusReady(function() {
		if(!obj.uid) {
			obj.uid = plus.storage.getItem('userid');
		}
		setTimeout(function() {
			informList(obj);
		}, 1000);
	})

}

function informList(objec) {
	mui.ajax(baseUrl + '/ajax/notify', {
		data: objec,
		async: true,
		dataType: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		traditional: true, //传数组必须加这个
		success: function(data) {
			if(data.success) {
				console.log(JSON.stringify(data))
				var $info = data.data;
				console.log($info == null)
				if(data.data==null) {
					return;
				}

				if($info.length == 0) {
					if(count) {
						document.getElementById("nodatalist").style.display = "block";
						mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						return;
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
						return;
					}
				}
				if(count) {
					document.getElementById("consultList").innerHTML = "";
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();

				}
				readed({
					uid: obj.uid,
					mid: $info[0].id,
					time: $info[0].createTime
				})
				count = 0;
				informHtml($info);
				if(data.data.length == obj.rows) {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					obj.time = $info[$info.length - 1].createTime;
					obj.mid = $info[$info.length - 1].id;
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}

			}

		},
		error: function(x) {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}

function informHtml($data) {
	for(var i = 0; i < $data.length; i++) {
		var par = JSON.stringify($data[i]);
		console.log($data[i].readed);
		var li = document.createElement("li");
		li.className = "mui-table-view-cell";
		li.style.height = "100%";
		li.innerHTML = '<div class="sty" data-id="' + $data[i].uid + '"></div>' +
			'<div class="madiaInfo">' +
			'<div class="h2Font" style="color: #333;font-weight: 400;">' + $data[i].cnt + '</div>' +
			'<div class="h3Font" style="margin: 5px 0;">' + commenTime($data[i].createTime) + '</div></div>'
		li.getElementsByClassName("madiaInfo")[0].setAttribute("data-obj", par);
		document.getElementById("consultList").appendChild(li);
		uinfo(li, $data[i].uid)
	}
}

function uinfo(li, uid) {
	mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + uid, {
		async: true,
		dataType: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		traditional: true, //传数组必须加这个
		success: function(data) {
			if(data.success) {
				var $data = data.data;
				if($data==null) {
					return;
				}
				if($data.hasHeadImage == 1) {
					li.getElementsByClassName("sty")[0].style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg" + ")";
				}
			}
		},
		error: function(x) {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}

function readed(objec) {
	mui.ajax(baseUrl + '/ajax/notify/readed', {
		data: objec,
		async: true,
		dataType: 'json', //服务器返回json格式数据
		type: 'POST', //HTTP请求类型
		traditional: true, //传数组必须加这个
		success: function(data) {
			if(data.success) {
				console.log(JSON.stringify(data))
			}

		},
		error: function(x) {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}
mui("#consultList").on("tap", ".madiaInfo", function() {
	var dobj = JSON.parse(this.getAttribute("data-obj"));
	var our = "",
		data;
	if(dobj.opType == 0) {
		ourl = "userInforShow.html";
		data = {
			proid: dobj.uid
		}
	} else if(dobj.opType == 1) {
		ourl = "researchAreaHead.html";
		data = {
			dataCaption: dobj.cnt.substring(dobj.cnt.indexOf(">") + 1, dobj.cnt.lastIndexOf("<")),
			professorId: dobj.pid
		}
	} else if(dobj.opType == 2) {
		ourl = "professorArticle.html";
		data = {
			articleId: dobj.pid,
			ownerid: obj.uid
		};
	} else if(dobj.opType == 3) {
		ourl = "qa-answer-show.html";
		data = {
			anid: dobj.pid.split(":")[0]
		};
	} else if(dobj.opType == 4) {
		ourl = "qa-answer-show.html";
		data = {
			anid: dobj.pid.split(":")[0]
		};
	} else if(dobj.opType == 5) {
		ourl = "qa-question-show.html"
		data = {
			quid: dobj.pid
		};
	} else if(dobj.opType == 6) {
		ourl = "patentShow.html"
		data = {
			patentId: dobj.pid
		}
	} else if(dobj.opType == 7) {
		ourl = "paperShow.html";
		data = {
			paperId: dobj.pid
		}
	} else {
		ourl = "leaveWordDialog.html";
		data = {
			lid: dobj.pid
		}
	}
	mui.openWindow({
		url: '../html/' + ourl,
		id: ourl,
		show: {
			autoShow: false,
			aniShow: "slide-in-right",
		},
		extras: data
	})
})
mui("#consultList").on("tap", ".sty", function() {
	var dobj = this.getAttribute("data-id");
	mui.openWindow({
		url: '../html/userInforShow.html',
		id: "userInforShow.html",
		show: {
			autoShow: false,
			aniShow: "slide-in-right",
		},
		extras: {
			proid: dobj
		}
	})
})
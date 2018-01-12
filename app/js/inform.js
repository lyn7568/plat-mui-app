mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh,
			auto:true
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
	console.log(JSON.stringify(objec));
	mui.ajax(baseUrl + '/ajax/notify', {
		data: objec,
		async: true,
		dataType: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		traditional: true, //传数组必须加这个
		success: function(data) {
			if(data.success) {
				var $info = data.data;
				console.log($info.length)
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
					document.getElementById("consultList").innerHTML="";
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				}
				count = 0;
				informHtml($info);
				if(data.data.length == obj.rows) {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					obj.time = $info[$info.length-1].createTime;
					obj.mid = $info[$info.length-1].id;
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
		var li = document.createElement("li");
		li.className = "mui-table-view-cell";
		li.style.height = "80px";
		li.innerHTML = '<div class="madiaHead useHead" style="../images/default-photo.jpg"></div>' +
			'<div class="madiaInfo">' +
			'<div class="h2Font mui-ellipsis-2" style="color: #333;font-weight: 400;">' + $data[i].cnt + '</div>' +
			'<div class="h3Font" style="margin: 5px 0;">' + commenTime($data[i].createTime) + '</div></div>'
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
				if($data.hasHeadImage == 1) {
					li.getElementsByClassName("useHead")[0].style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg" + ")";
				}
			}
		},
		error: function(x) {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}
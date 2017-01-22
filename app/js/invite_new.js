mui.ready(function() {
	mui.plusReady(function() {
		var userId = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var professorName = ws.proName;
		var table = document.body.querySelector('.list');
		var invite = document.getElementById("invite");
		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/queryInvite", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				data: {
					"id": userId
				},
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						plus.nativeUI.closeWaiting(); //新webview的载入完毕后关闭等待框
						ws.show("slide-in-right", 150);
						if(!data.data.length) {
							document.getElementById("inblock").style.display = "none";
							document.getElementById("nodatabox1").style.display = "block";
							return;
						}
						document.getElementById("inviteNumber").innerText = data.data.length;
						var datalist = data.data;
						datalistEach(datalist);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		personalMessage()
			/*数据遍历*/
		function datalistEach(datalist) {
			mui.each(datalist, function(index, item) {

				/*获取头像*/
				if(item.hasHeadImage == 1) {
					var img = baseUrl + "/images/head/" + item.id + "_l.jpg";
				} else {
					var img = "../images/default-photo.jpg";
				}

				/*获取研究方向信息*/
				var researchAreas = item.researchAreas;
				var rlist = ''
				for(var n = 0; n < researchAreas.length; n++) {
					//console.log(researchAreas[n].caption);
					rlist += '<span>' + researchAreas[n].caption + '</span>';
					if(n != researchAreas.length - 1) {
						rlist += "，"
					}
				}

				/*获取资源信息*/
				var resources = item.resources;
				var zlist = ''
				for(var m = 0; m < resources.length; m++) {
					//console.log(resources[m].caption);
					zlist += '<span>' + resources[m].resourceName + '</span>';
					if(m != resources.length - 1) {
						zlist += "，"
					}
				}
				var title = "";
				var office = "";
				var orgName = "";
				var address = "";
				if(item.title && item.office && item.organization.name && item.address) {
					title = item.title + "，";
					office = item.office + "，";
					orgName = item.organization.name + " | ";
					address = item.address;
				} else if(!item.title && item.office && item.organization.name && item.address) {
					office = item.office + "，";
					orgName = item.organization.name + " | ";
					address = item.address;
				} else if(item.title && !item.office && item.organization.name && item.address) {
					title = item.title + "，";
					orgName = item.organization.name + " | ";
					address = item.address;
				} else if(item.title && item.office && !item.organization.name && item.address) {
					title = item.title + "，";
					office = item.office + " | ";
					address = item.address;
				} else if(item.title && item.office && item.organization.name && !item.address) {
					title = item.title + "，";
					office = item.office + "，";
					orgName = item.organization.name;
				} else if(!item.title && !item.office && item.organization.name && item.address) {
					orgName = item.organization.name + " | ";
					address = item.address;
				} else if(!item.title && item.office && !item.organization.name && item.address) {
					office = item.office + " | ";
					address = item.address;
				} else if(!item.title && item.office && item.organization.name && !item.address) {
					office = item.office + "，";
					orgName = item.organization.name;
				} else if(item.title && !item.office && !item.organization.name && item.address) {
					title = item.title + " | ";
					address = item.address;
				} else if(item.title && !item.office && item.organization.name && !item.address) {
					office = item.title + "，";
					address = item.organization.name;
				} else if(item.title && item.office && !item.organization.name && !item.address) {
					title = item.title + "，";
					office = item.office;
				} else if(!item.title && !item.office && !item.organization.name && item.address) {
					address = item.address;
				} else if(!item.title && !item.office && item.organization.name && !item.address) {
					orgName = item.organization.name;
				} else if(!item.title && item.office && !item.organization.name && !item.address) {
					office = item.office;
				} else if(item.title && !item.office && !item.organization.name && !item.address) {
					title = item.title;
				}
				var typeTname = '';
				if(item.authType) {
					typeTname = '<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
				} else {
					if(item.authStatus) {
						if(item.authentication == 1) {
							typeTname = '<em class="mui-icon iconfont icon-renzheng authicon-mana"></em>';
						} else if(item.authentication == 2) {
							typeTname = '<em class="mui-icon iconfont icon-renzheng authicon-staff"></em>';
						} else {
							typeTname = '<em class="mui-icon iconfont icon-renzheng authicon-stu"></em>';
						}
					}
				}

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media';
				li.setAttribute("professorId", item.id);
				li.innerHTML = '<a class="proinfor" data-id="' + item.id + '"' +
					'<p><img class="mui-media-object mui-pull-left headimg headRadius" src="' + img + '"></p>' +
					'<div class="mui-media-body">' +
					'<span class="listtit">' + item.name + typeTname + '</span>' +
					'<p class="listtit2"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
					'<p class="mui-ellipsis listtit3">' + rlist + '</p>' +
					'<p class="mui-ellipsis listtit3">' + zlist + '</p>' +
					'</div></a></li>';

				table.appendChild(li, table.firstChild);

			});
		}
		/*微信及微信朋友圈分享专家*/
		var auths, shares;
		invite.addEventListener("tap", function() {
			shareShow()
		});
		plus.oauth.getServices(function(services) {
			auths = {};
			for(var i in services) {
				var t = services[i];
				auths[t.id] = t;
			}
		}, function(e) {
			alert("获取登录服务列表失败：" + e.message + " - " + e.code);
		});
		plus.share.getServices(function(services) {

			shares = {};
			for(var i in services) {

				var t = services[i];

				shares[t.id] = t;

			}
		}, function(e) {
			alert("获取分享服务列表失败：" + e.message + " - " + e.code);
		})

		function shareShow() {
			var shareBts = [];
			// 更新分享列表
			var ss = shares['weixin'];
			if(navigator.userAgent.indexOf('StreamApp') < 0 && navigator.userAgent.indexOf('qihoo') < 0) { //在360流应用中微信不支持分享图片
				ss && ss.nativeClient && (shareBts.push({
						title: '微信好友',
						s: ss,
						x: 'WXSceneSession'
					}),
					shareBts.push({
						title: '微信朋友圈',
						s: ss,
						x: 'WXSceneTimeline'
					}));
			}
			//				// 弹出分享列表
			shareBts.length > 0 ? plus.nativeUI.actionSheet({
				title: '分享',
				cancel: '取消',
				buttons: shareBts
			}, function(e) {
				var str = "研究方向"
				if(e.index == 1) {
					var share = buildShareService();
					if(share) {
						shareMessage(share, "WXSceneSession", {
							content: "科袖网，搭建企业与专家的桥梁。",
							title: professorName + "邀请您加入【科袖】",
							href: baseUrl + "/ekexiu/Invitation.html?professorId=" + userId + "&professorName=" + encodeURI(professorName),
							thumbs: [baseUrl + "/images/logo180.png"]
						});
					}
				} else if(e.index == 2) {
					var share = buildShareService();
					if(share) {
						shareMessage(share, "WXSceneTimeline", {
							content: professorName,
							title: "【科袖名片",
							href: baseUrl + "/ekexiu/Invitation.html?professorId=" + userId + "&professorName=" + encodeURI(professorName),
							thumbs: [baseUrl + "/images/logo180.png"]
						});
					}
				}

			}) : plus.nativeUI.alert('当前环境无法支持分享操作!');

		}

		function buildShareService() {
			var share = shares["weixin"];
			if(share) {
				if(share.authenticated) {
					console.log("---已授权---");
				} else {
					console.log("---未授权---");
					share.authorize(function() {
						console.log('授权成功...')
					}, function(e) {
						alert("认证授权失败：" + e.code + " - " + e.message);
						return null;
					});
				}
				return share;
			} else {
				alert("没有获取微信分享服务");
				return null;
			}

		}

		function shareMessage(share, ex, msg) {
			msg.extra = {
				scene: ex
			};
			share.send(msg, function() {
				plus.nativeUI.closeWaiting();
				var strtmp = "分享到\"" + share.description + "\"成功！ ";
				console.log(strtmp);
				plus.nativeUI.toast(strtmp, {
					verticalAlign: 'center'
				});
			}, function(e) {
				plus.nativeUI.closeWaiting();
				if(e.code == -2) {
					plus.nativeUI.toast('已取消分享', {
						verticalAlign: 'center'
					});
				}
			});
		}
	});
})
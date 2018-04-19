$(document).ready(function() {
		/*直播管理*/

		//live action-toolbar
		//select
		$('[name="nice-select"]').click(function(e) {
			$('[name="nice-select"]').find('ul').hide();
			$(this).find('ul').show();
			e.stopPropagation();
		});
		$('[name="nice-select"] li').hover(function(e) {
			$(this).toggleClass('on');
			e.stopPropagation();
		});
		$('[name="nice-select"] li').click(function(e) {
			var val = $(this).text();
			var dataVal = $(this).attr("data-value");
			$(this).parents('[name="nice-select"]').find('input').val(val);
			$('[name="nice-select"] ul').hide();
			e.stopPropagation();
		});
		$(document).click(function() {
			$('[name="nice-select"] ul').hide();
		});
		//过滤搜索
		$("#filter_search li").click(function() {
			var dataVal = $(this).attr("data-value");
			$(".live_filter[data-value='" + dataVal + "']").removeClass("hide").siblings(".live_filter").addClass("hide");
		});
		// play live
		$(".Play_box-header .close").click(function() {
			$(".play_zhezao").hide();
			$(".Play_box").removeClass("on");
		});
		$(".live-name a").click(function() {
			$(".play_zhezao").show();
			$(".Play_box").addClass("on");
			var oTxt = $(this).parent().text();
			$(".Play_box-title").text(oTxt);
		});
		//缩略图
		$(".thumbnail-img").click(function() {
			$(".modal-body").html("");
			$("#myModal").show().addClass("bs-example-modal-sm");
			$(".modal-dialog").addClass("modal-sm");
			$(".modal-footer").hide();
			var otext = $(this).parent().text();
			var osrc = $(this).parent().find("img").attr("src");
			$("#myModalLabel").text(otext);
			var odiv = $("<div style='text-align:center'><img src='" + osrc + "' style='display:inline-block'></div>");
			$(".modal-body").append(odiv);
		});
		//删除
		$(".operation-del").click(function() {
				$(".operation-del").removeAttr("value");
				$(this).attr("value", "this");
				$(".modal-body").html("");
				$("#myModal").show().removeClass("bs-example-modal-sm");
				$(".modal-dialog").removeClass("modal-sm");
				$(".modal-footer").show();
				$("#myModalLabel").text("删除媒体");
				var oname = $(this).parent().siblings(".live-name").text();
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要删除媒体' + oname + ' 吗？</p></div>');
				$(".modal-body").append(odiv);
			})
			//发布
		$(".operation-Release").click(function() {
			$(".operation-Release").removeAttr("value");
			$(this).attr("value", "fabu");
			$(".modal-body").html("");
			$("#myModal").show().removeClass("bs-example-modal-sm");
			$(".modal-dialog").removeClass("modal-sm");
			$(".modal-footer").show();
			var otext = $(this).text();
			var oname = $(this).parent().siblings(".live-name").text();
			if(otext == "取消发布") {
				$("#myModalLabel").text("撤销发布媒体");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要撤销发布媒体' + oname + '吗？</p></div>');
				$(".modal-body").append(odiv);
			} else {
				$("#myModalLabel").text("发布媒体");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要发布媒体' + oname + '吗？</p></div>');
				$(".modal-body").append(odiv);
			}
		});

		/*bulit-live*/
		$("input[name='recoard']").click(function() {
			if($(this).val() == "录制") $(".hideen").show();
			else $(".hideen").hide();
		});
		$("#B-LIve_file").change(function() {
			var fileList = this.files;
			for(var i = 0; i < fileList.length; i++) {
				var $file = $(this);
				var fileObj = $file[0];
				if(fileObj && fileObj.files && fileObj.files[0]) {
					$("#B-LIve_txt").val(fileList[i].name);
				}
			}
		});
		$("#bulit-live_confirm").click(function() {
			var Reco = $("input[name='recoard']:checked").val();
			if(!$("#live_name").val()) {
				layer.msg('请输入直播名称', {
					time: 2000,
				})
				$("#live_name").focus();
				return false;
			} else if(!$("#start_time").val()) {
				layer.msg('请输入直播开始时间', {
					time: 2000,
				})
				$("#live-start").focus();
				return false;
			} else if(!$("#end_time").val()) {
				layer.msg('请输入直播结束时间', {
					time: 2000,
				})
				$("#live-end").focus();
				return false;
			} else if(!$("#B-LIve_txt").val()) {
				layer.msg('请选择文件上传', {
					time: 2000,
				})
				$("#B-LIve_file").click();
				return false;
			} else {
				var arr = []; //获得编辑器里面的内容
				arr.push(UM.getEditor('myEditor').getContent());
				/*alert(arr);
				 um.execCommand('insertHtml', arr+"mm");
				 return false;*/
				$("#bulit-live").submit();
				window.location.href = 'bulit-live-complate.html';
			}
		});

		/*live 回看*/
		$(".play-preview").click(function() {
			var livename = $(this).parent().siblings(".live-name").text();
			$(".play_zhezao").show();
			$(".Play_box").addClass("on");
			$(".Play_box-title").text(livename);
		});

		/*统计 用户行为*/
		$(".nav-pills li").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
		});
		//init
		$(".cdn-domain-selector-wrap .nice-select li:first-child").trigger("click");

		$(".timing li").click(function() {
			var oValue = $(this).attr("data-value");
			//alert(oValue);
			switch(oValue) {
				case "today":
					var mydate = new Date();
					var hour = mydate.getHours();
					hour = hour < 10 ? "0" + hour: hour;
					var minutes = mydate.getMinutes();
					minutes = minutes < 10 ? "0" + minutes : minutes;
					$("#cdn-date-range-picker").val(getBeforeDate(0)+" 00:00 - "+ getBeforeDate(0)+" "+hour+":"+minutes);
					break;
				case "yesterday":
					$("#cdn-date-range-picker").val(getBeforeDate(1)+" 00:00 - "+ getBeforeDate(1)+" 23:59");
					break;
				case "week":
					var mydate = new Date();
					var hour = mydate.getHours();
					hour = hour < 10 ? "0" + hour: hour;
					var minutes = mydate.getMinutes();
					minutes = minutes < 10 ? "0" + minutes : minutes;
					$("#cdn-date-range-picker").val(getBeforeDate(7)+" "+hour+":"+minutes+" - "+getBeforeDate(0)+" "+hour+":"+minutes);
					break;
				case "month":
					var mydate = new Date();
					var hour = mydate.getHours();
					hour = hour < 10 ? "0" + hour: hour;
					var minutes = mydate.getMinutes();
					minutes = minutes < 10 ? "0" + minutes : minutes;
					$("#cdn-date-range-picker").val(getBeforeDate(30)+" "+hour+":"+minutes+" - "+getBeforeDate(0)+" "+hour+":"+minutes);
					break;
				default:
					return;
			}
		})
		$(".timing li").eq(0).trigger("click");

		//点击 modal-footer btn-primary
		$(".modal-footer .btn-primary").on("click", function() {
			if($("#myModalLabel").text() == "删除媒体") {
				//删除
				$("a.operation-del[value='this']").parents("tr").remove();
			} else if($("#myModalLabel").text() == "发布媒体") {
				//发布
				$("a.operation-Release[value='fabu']").parent().siblings(".Release").text("发布");
				$("a.operation-Release[value='fabu']").text("取消发布");
			} else if($("#myModalLabel").text() == "撤销发布媒体") {
				//取消发布
				$("a.operation-Release[value='fabu']").parent().siblings(".Release").text("未发布");
				$("a.operation-Release[value='fabu']").text("发布");
			} else {
				return;
			}
			$('#myModal').modal('hide')
		});
		//

	})
	/*layui
layui.use('layer', function() {
	var $ = layui.jquery,
		layer = layui.layer;
})*/


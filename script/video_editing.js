$(document).ready(function() {
	/*素材管理*/
	$("#cdn-date-range-picker").val(getBeforeDate(7) + " 00:00" + " - " + getBeforeDate(0) + " 23:59");
	$(".videoedit_type").change(function() {
		var type = $(this).find("option:selected").attr("value");
		$("div[data-value='" + type + "']").removeClass("hide").siblings("div").addClass("hide");
	});
	//播放
	$(".play_hove").on("click", function() {
		$("#myModal").modal("show");
		$("#myModal .modal-header,#myModal .modal-body,#myModal .modal-footer").hide();
		$(".modal-content").html(template("playbox", []));
		$(".player-close").attr("data-dismiss", "modal");
	});
	//删除
	$(".material_del").on("click", function() {
		deleate($(this), "删除素材", "您确定要删除素材吗？");
	});

	function deleate(obj, str1, str2) {
		$("#myModal").modal("show");
		$("#myModalLabel").text(str1);
		$(".modal-footer").find(".btn-default").text("取消");
		$(".modal-footer").find(".btn-primary").text("确定").attr("id", "materialdel");
		var div = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">' + str2 + '</p></div>');
		$(".modal-body").append(div);
		obj.parent().parent().attr("value", "thisdata").siblings().removeAttr("value");
	}

	$("#myModal").on("click", "#materialdel", function() {
		$("tr[value").remove();
		tooltip("删除素材成功！");
		$("#myModal").modal("hide");
	});
	//刷新
	$(".videoedit_refresh").on("click", function() {
		var $tbody = $(".materiallist").hide().clone();
		$(".loadBox").removeClass("hide");
		$.ajax({
			type: "get",
			url: "json/video_source.js",
			dataType: "json",
			success: function(data) {
				var _data = data;
				var _key = (JSON.stringify(_data) == "{}");
				if(_key) {
					$(".materiallist").html("").append(template("nodata", []));
					$(".table-fixed").addClass("hide");
				} else {
					var html = template("templatetr", data);
					$(".materiallist").append(html);
					$("tr.nodata").remove();
					$(".table-fixed").removeClass("hide");
					elementposition($(".right-service-rt").get(0), $(".table-fixed"), $(".console-title").outerWidth());
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("error");
				console.log(XMLHttpRequest.responseText);
			},
		});
		$(".materiallist").show();
		$(".loadBox").addClass("hide");
	});
	//上传视频
	$("#videoedit_upload").on("click", function() {
		$("#myModal").modal("show");
		$("#myModalLabel").text("上传任务");
		$("#myModal .modal-footer").hide();
		$(".modal-body").css("padding", "0px").html(template("uploadvideo", []));
	});
	//分页
	var height01, height02, width;
	elementposition($(".right-service-rt").get(0), $(".table-fixed"), $(".console-title").outerWidth());
	$(window).resize(function() {
		elementposition($(".right-service-rt").get(0), $(".table-fixed"), $(".console-title").outerWidth());
	});

	function elementposition(obj1, obj2, num) {
		height01 = obj1.scrollHeight;
		height02 = $(document).height() - 50;
		if(height01 > height02) {
			obj2.css({
				"margin": " 0px",
				"z-index": "99",
				"width": num + "px",
				"position": "fixed",
				"bottom": "0",
			});
		} else {
			obj2.css({
				"margin": " -57px 0px 0px",
				"z-index": "99",
				"width": "100%",
				"position": "relative",
				"bottom": "auto"
			});
		}
	};

	/*视频编辑*/
	//添加视频silder
	$(".add_videomaterial").click(function() {
		$(".videosilder").addClass("show");
	});
	$(".vod-body-title .close").click(function() {
		$(".videosilder").removeClass("show");
	});
	$(".vod-body-sidebar-window .otype").change(function() {
		var _type = $(this).find("option:selected").attr("value");
		$("div[data-value='" + _type + "']").removeClass("hide").siblings("div").addClass("hide");
	});
	$(".import-video-item-list").on("click", ".videoitemul li", function() {
		$(this).toggleClass("itemChecked");
		$(".vod-body-foot").find(".import-number").text($(".itemChecked").length);
		if($(".itemChecked").length > 0) $(".addprimary").prop("disabled", false).addClass("btn-primary");
		else $(".addprimary").prop("disabled", true).removeClass("btn-primary");
	});
	//按编辑时间／视频名称查询
	var _indexarr = new Array();
	var $li = $(".videoitemul li").clone();
	$(".videoedit_search").on("click", function() {
		var $type = $(".vod-body-sidebar-window .otype").find("option:selected").attr("value");
		if($type == "edittime") {
			console.log("按编辑时间查询");
		} else { //按视频名称查询
			var _name = $(".sernam").val();
			if(_name == "") {
				$(".search-result").removeClass("hide").find(".ssname").text("");
				$(".search-result").find(".ssnum").text($(".videoitemul").find("li").length);
			} else {
				$li.find(".item-filed-title").each(function(index, ele) {
					if($(ele).text().indexOf(_name) != -1) {
						_indexarr.push(index);
						return _indexarr;
					}
				});
				if(_indexarr.length == 0) {
					$(".searnodata").removeClass("hide");
					$(".videoitemul,.import-fixed-page").addClass("hide");
					$(".videoitemul li").remove();
				} else {
					$(".videoitemul li").remove();
					$.each(_indexarr, function(i, val) {
						$(".videoitemul").append($li.eq(val));
					});
					$(".search-result").removeClass("hide").find(".ssname").text(_name);
					$(".search-result").find(".ssnum").text($(".videoitemul").find("li").length);
				}
				$(".import-fixed-page").find(".pageNum em").text($(".videoitemul").find("li").length);
			}
		}
		$(".videoitemul li").removeClass("itemChecked");
		$(".vod-body-foot").find(".import-number").text(0);
		$(".addprimary").prop("disabled", true).removeClass("btn-primary");
	});
	//返回视频列表
	$(".btn-action-a").on("click", function() {
		_indexarr = new Array();
		$(".vod-body-sidebar-window .otype").html("").html('<option value="edittime">按编辑时间查询</option><option value="videoname">按视频名称查询</option>');
		$("div[data-value=edittime]").removeClass("hide").siblings("div").addClass("hide");
		$(".videoitemul").find("li").remove().end().append($li);
		$(".searnodata,.search-result").addClass("hide");
		$(".videoitemul,.import-fixed-page").removeClass("hide");
		$(".sernam").val("");
		$(".import-fixed-page").find(".pageNum em").text($(".videoitemul").find("li").length);
		$(".videoitemul li").removeClass("itemChecked");
		$(".vod-body-foot").find(".import-number").text(0);
		$(".addprimary").prop("disabled", true).removeClass("btn-primary");
	});
	//添加视频 slider 确定／取消
	var initial_width = 100;
	var rate = 10;
	var drag_key = false;
	/* */
	$(".addprimary").on("click", function() {
		var namearr = new Array(),
			oringinal_name = new Array();
		var videoname, duration_;
		$(".videoitemul .itemChecked").each(function(index, ele) {
			var name = $(ele).find(".item-filed-title").text();
			var time = $(ele).find(".item-filed-time").text();
			namearr.push({
				"name": name,
				"time": time
			});
			return namearr;
		});
		$(".materialbox .materialitem").each(function(index, ele) {
			var name = $(ele).find(".shadow-title").text();
			oringinal_name.push({
				"name": name
			});
			return oringinal_name;
		});
		var result = [];
		for(var i = 0; i < namearr.length; i++) {
			var obj = namearr[i];
			var num = obj.name;
			var isExist = false;
			for(var j = 0; j < oringinal_name.length; j++) {
				var aj = oringinal_name[j];
				var n = aj.name;
				if(n == num) {
					isExist = true;
					break;
				}
			}
			if(!isExist) {
				result.push(obj);
			}
		}
		var $item = "";
		$.each(result, function(i, val) {
			$item += '<div class="materialbox_con"><div class="materialitem" draggable="true"><span class="item-add">+</span><div class="image-item-background"><div class="item-filed-time"><span class="shadow-title">' + val.name + '</span><span class="duration pull-right">' + val.time + '</span></div></div></div></div>';
		});
		$("#materialbox").append($item);
		$("#storedit").prop("disabled", false).addClass("btn-primary");
		$(".videosilder").removeClass("show");
		tooltip("添加视频素材成功");
		$(".videoitemul li").removeClass("itemChecked");
		$(".vod-body-foot").find(".import-number").text(0);
		//拖拽视频素材到剪辑区
		var drag_ = document.getElementById("materialbox");
		var target_ = document.getElementById("timeline-editor");
		var $drag = drag_.getElementsByClassName("materialitem");
		var hidden = document.getElementById("hidden_domain");
		for(var i = 0; i < $drag.length; i++) {
			$drag[i].id = i;
			$drag[i].ondragstart = function(ev) {
				if(ev.target.className == "materialitem") {
					ev.dataTransfer.setData("Text", ev.target.id);
					drag_key = true;
				}
			};
			stop_select($drag[i]);
		}
		target_.ondragenter = function(ev) {
			if(ev.target.className == "timeline-editor") {
				$(".drag_here").css("outline-color", "rgb(0, 193, 222)").find("p").css("color", "rgb(0, 193, 222)");
			}
		}
		target_.ondragleave = function(ev) {
			if(ev.target.className == "timeline-editor") {
				$(".drag_here").find("p").css("color", "rgb(195, 197, 198)");
			}
		}
		target_.ondragover = function(ev) {
			ev.preventDefault();
		}
		target_.ondrop = function(ev) {
			ev.preventDefault();
			hidden.innerHTML = "";
			var data = event.dataTransfer.getData("Text");
			if(drag_key) {
				var clone = document.getElementById(data).cloneNode(true);
				hidden.appendChild(clone);
				videoname = $("#hidden_domain").find(".shadow-title").text();
				duration_ = $("#hidden_domain").find(".duration").text();
				var tarr = duration_.split(":");
				var length = $(".layer-video-clips").find(".drag-source").length;
				releasetarget(videoname, duration_, tarr, length);
			};
			drag_key = false;
		};
	});

	function setparameter(arr) {
		var $time = 0;
		switch(arr.length) {
			case 2:
				$time = Number(arr[0] * 60) + Number(arr[1]);
				break;
			case 3:
				$time = Number(arr[0] * 3600) + Number(arr[1] * 60) + Number(arr[2]);
				break;
			default:
				console.log("视频时长格式不正确，请重新获取");
		};
		return $time;
	};

	function releasetarget(name, duration, arr, num) {
		var flag = generateUUID();
		var $width = initial_width * (setparameter(arr) / rate);
		var $returnsum = cacul_sum(num);
		var source = $('<div class="drag-source" val="' + flag + '" draggable="true" style="width:' + $width + 'px;"><div class="layer-clip-body"><div class="thumb-group"><span class="thumb" style="left: 0%;width: 120px;"></span><span class="thumb" style="left: 50%;width: 120px;"></span></div><div class="layer-clip-delete text-center">×</div><div class="layer-clip-text"><span class="layer-clip-title">' + name + '</span><span class="layer-clip-duration">' + duration + '</span></div></div></div>');
		var w = Math.ceil(($returnsum.sum_time + setparameter(arr)) / rate) * initial_width;
		var lf = $width + $returnsum.sum_width;
		$(".layer-video-clips").append(source);
		$(".drag_here").css({
			"left": lf + "px",
			"outline-color": "rgb(192, 192, 192)"
		}).find("p").css("color", "rgb(195, 197, 198)");
		var lintxt = transtime($returnsum.sum_time);
		$(".play-line-container").css("left", $returnsum.sum_width + "px").find(".play-line-time").text(lintxt);
		$(".time-ruler").find(".hline").css("width", w + "px").end().find(".section").css("width", w + "px").empty();
		var $end = $('<div class="mtick" val="' + flag + '"  style="left:' + lf + 'px;"><div class="base"></div></div>');
		$(".time-ruler").append($end);
		scale(setparameter(arr), $width, $returnsum.sum_time);
		var ww = parseFloat($(".timeline_container").width()) - 16;
		if(ww < w) $("#timeline-editor").css("width", w);
		else $("#timeline-editor").css("width", ww);
		$("#makevideo").prop("disabled", false).addClass("btn-primary");
		Sortable.create(simpleList, {
			ghostClass: "ghostClass",
			forceFallback: true,
			scroll: true,
			onEnd: function(evt) {
				drag_key = false;
				$(".drag-source").each(function(i, e) {
					var $lf = $(e).position().left;
					var $width = parseFloat($(e).css("width"));
					var $val = $(e).attr("val");
					$(".time-ruler").find(".mtick[val='" + $val + "']").css("left", $lf + $width);
				});
				var i = evt.newIndex - 1;
				var left_ = $(".drag-source").eq(i).position().left;
				var txt_ = left_ * rate / initial_width;
				$(".play-line-container").css("left", left_).find(".play-line-time").text(transtime(txt_));
			},
		});
	};

	function scale(num, width, sum) {
		var $num = Math.ceil((num + sum) / rate);
		var ruler = "";
		for(var i = 0; i < $num; i++) {
			var lf = (i + 1) * initial_width;
			var rulertxt = transtime((i + 1) * rate);
			ruler += '<div class="stick" style="left: ' + lf + 'px;"></div><div class="rulabel" style="left: ' + lf + 'px;">' + rulertxt + '</div>';
		};
		$(".time-ruler").find(".section").append(ruler);
	};

	function cacul_sum(num) {
		var $sum_width = $sum_time = 0;
		if(num == 0) $sum_width = $sum_time = 0;
		else {
			var arr = new Array();
			$(".layer-video-clips").find(".drag-source").each(function(index, ele) {
				var w = $(ele).innerWidth();
				$sum_width += w;
				var t = $(this).find(".layer-clip-duration").text();
				arr.push(t);
			});
			$sum_time = getsum(arr);
		};
		return {
			sum_width: $sum_width,
			sum_time: $sum_time,
		}
	};

	$(".addcancel").on("click", function() {
		$(".videosilder").removeClass("show");
	});
	//视频素材 +
	$(".editmaterial").on("click", ".materialitem .item-add", function() {
		var add_name = $(this).next().find(".shadow-title").text();
		var add_duration = $(this).next().find(".duration").text();
		var tarr = add_duration.split(":");
		var length = $(".layer-video-clips").find(".drag-source").length;
		releasetarget(add_name, add_duration, tarr, length);
	});
	//剪辑视频
	$(".play-line-cut").on("click", function(e) {
		e.stopPropagation();
		var $div = $('<div class="layer-clip-flag layer-clip-flag-cut"><div class="layer-clip-flag-cut-img"></div></div>');
		var length = $(".layer-video-clips").find(".drag-source").length;
		var txt = $(this).parent().find(".play-line-time").text();
		var time = txt.split(":");
		time = setparameter(time);
		var total_time, name;
		if(length == 0) return;
		else {
			var timearr = new Array();
			var timarr = new Array();
			var total = $index = 0;
			$(".layer-video-clips").find(".drag-source").each(function(index, ele) {
				timearr.push($(ele).find(".layer-clip-duration").text());
			});
			$.each(timearr, function(i, val) {
				var $val = setparameter(val.split(":"));
				timarr.push($val);
			});
			for(var i = 0; i < timarr.length; i++) {
				total += timarr[i];
				if(time <= total) {
					$index = i;
					break;
				}
			};
			var total_txt = $(".drag-source").eq($index).find(".layer-clip-duration").text();
			total_time = setparameter(total_txt.split(":"));
			name = $(".drag-source").eq($index).find(".layer-clip-title").text();
			for(var j = 0; j < $index; j++) {
				time -= timarr[j];
			}
			var time1 = time;
			var time2 = total_time - time1;
			var attrval = $(".drag-source").eq($index).attr("val");
			var $left = $(".drag-source").eq($index).position().left;
			w1 = time1 / rate * initial_width;
			w2 = time2 / rate * initial_width;
			var flag = generateUUID();
			var source = $('<div class="drag-source" val="' + flag + '" draggable="true" style="width:' + w2 + 'px;"><div class="layer-clip-body"><div class="thumb-group"><span class="thumb" style="left: 0%;width: 120px;"></span><span class="thumb" style="left: 50%;width: 120px;"></span></div><div class="layer-clip-delete text-center">×</div><div class="layer-clip-flag layer-clip-flag-cut"><div class="layer-clip-flag-cut-img"></div></div><div class="layer-clip-text"><span class="layer-clip-title">' + name +
				'</span><span class="layer-clip-duration">' + transtime(time2) + '</span></div></div></div>');
			$(".drag-source").eq($index).css("width", w1).find(".layer-clip-duration").text(transtime(time1)).end().find(".layer-clip-delete").after($div).end().after(source);;
			$(".time-ruler").find(".mtick[val=" + attrval + "]").css("left", $left + w1);
			var $end = $('<div class="mtick" val="' + flag + '"  style="left:' + ($left + w1 + w2) + 'px;"><div class="base"></div></div>');
			$(".time-ruler").append($end);
		};
	});
	//删除剪辑区的视频
	$(".timeline-editor").on("click", ".layer-clip-delete", function(event) {
		event.stopPropagation();
		var parents_ = $(this).parents(".drag-source");
		var flag = parents_.attr("val");
		var time = parents_.find(".layer-clip-duration").text();
		time = time.split(":");
		var thew = setparameter(time) / rate * initial_width;
		var dlf = parseFloat($(".drag_here").css("left"));
		var linelf = parseFloat($(".play-line-container").css("left"));
		dlf -= thew;
		if(dlf <= 0) dlf = 0;
		$(".drag_here").css("left", dlf);
		parents_.nextAll().each(function() {
			var lf = $(this).position().left;
			lf -= thew;
			var ff = $(this).attr("val");
			var fl = $(".time-ruler").find(".mtick[val=" + ff + "]").css("left");
			fl = parseFloat(fl);
			fl -= thew;
			$(".time-ruler").find(".mtick[val=" + ff + "]").css("left", fl);
		});
		parents_.remove();
		$(".time-ruler").find(".mtick[val=" + flag + "]").remove();
		$(".time-ruler").find(".section").empty();
		var timearr = new Array();
		$(".layer-video-clips").find(".drag-source").each(function(index, ele) {
			var t = $(ele).find(".layer-clip-duration").text();
			timearr.push(t);
		});
		var len = timearr.length;
		var linetxt = "";
		if(len >= 0 && len <= 1) {
			linelf = 0;
			linetxt = "00:00";
		} else {
			var timearr_ = new Array();
			for(var i = 0; i < len - 1; i++) {
				timearr_.push(timearr[i]);
			}
			linelf = getsum(timearr_) / rate * initial_width;
			linetxt = transtime(getsum(timearr_));
		}
		$(".play-line-container").css("left", linelf).find(".play-line-time").text(linetxt);
		var $num = Math.ceil(getsum(timearr) / rate);
		var ruler = "";
		for(var i = 0; i < $num; i++) {
			var lf = (i + 1) * initial_width;
			var rulertxt = transtime((i + 1) * rate);
			ruler += '<div class="stick" style="left: ' + lf + 'px;"></div><div class="rulabel" style="left: ' + lf + 'px;">' + rulertxt + '</div>';
		};
		$(".time-ruler").find(".section").append(ruler).end().find(".section").css("width", $num * initial_width).end().find(".hline").css("width", $num * initial_width);
		var ww = parseFloat($(".timeline_container").width()) - 16;
		if(ww < ($num * initial_width)) $("#timeline-editor").css("width", $num * initial_width);
		else $("#timeline-editor").css("width", ww);
		if($(".layer-video-clips").find(".drag-source").length == 0) {
			$("#makevideo").prop("disabled", true).removeClass("btn-primary");
		}
	});

	//滑块值改变是剪辑区时间轴变化
	var ratio = 0.095;
	$(".zoombox .rangval").on("change", function() {
		rate = 10;
		rate -= $(this).val() * ratio;
		rate = rate.toFixed(1);
		var timearr = new Array();
		var $sumwidth = 0;
		var linetxt = $(".play-line-container").find(".play-line-time").text();
		$(".layer-video-clips").find(".drag-source").each(function(index, ele) {
			var t = $(ele).find(".layer-clip-duration").text();
			var $width = setparameter(t.split(":")) / rate * initial_width;
			var flg = $(ele).attr("val");
			timearr.push(t);
			$sumwidth += $width;
			var sumw = 0;
			$(ele).prevAll().each(function(i, e) {
				var w = parseFloat($(e).css("width"));
				sumw += w;
			});
			$(".time-ruler").find(".mtick[val=" + flg + "]").css("left", sumw + $width);
			$(ele).css("width", $width, );
		});
		$(".drag_here").css("left", $sumwidth);
		var xx = setparameter(linetxt.split(":")) / rate * initial_width;
		$(".play-line-container").css("left", xx);
		$(".time-ruler").find(".section").empty();
		var $num = Math.ceil(getsum(timearr) / rate);
		var ruler = "";
		for(var i = 0; i < $num; i++) {
			var lf = (i + 1) * initial_width;
			var rulertxt = transtime((i + 1) * rate);
			ruler += '<div class="stick" style="left: ' + lf + 'px;"></div><div class="rulabel" style="left: ' + lf + 'px;">' + rulertxt + '</div>';
		};
		$(".time-ruler").find(".section").append(ruler).end().find(".section").css("width", $num * initial_width).end().find(".hline").css("width", $num * initial_width);
		var ww = parseFloat($(".timeline_container").width()) - 16;
		if(ww < ($num * initial_width)) $("#timeline-editor").css("width", $num * initial_width);
		else $("#timeline-editor").css("width", ww);
	});
	$(".zoombox").find(".zoom_narrow").on("click", function() {
		var $slider = Number($(".zoombox .rangval").val());
		$slider -= 1;
		if($slider <= 0) $slider = 0;
		$slider = $slider.toString();
		$(".zoombox .rangval").jRange("setValue", $slider);
	});
	$(".zoombox").find(".zoom_enlarge").on("click", function() {
		var $slider = Number($(".zoombox .rangval").val());
		$slider += 1;
		if($slider >= 100) $slider = 100;
		$slider = $slider.toString();
		$(".zoombox .rangval").jRange("setValue", $slider);
	});
	//拖动play-line-container
	var isDrag = false;
	var x, smw;
	$("#timeline-editor").on("click", function(ev) {
		if(ev.target.id == "timeline-editor") {
			var $length_ = $(".drag-source").length;
			if($length_ == 0) return;
			else {
				smw = 0;
				var initlf = $(this).offset().left;
				var ev = window.event || ev;
				var mlf = ev.clientX - initlf + $(this).scrollLeft();
				$(".drag-source").each(function(index, ele) {
					var w = parseFloat($(ele).css("width"));
					smw += w;
				});
				if(mlf >= smw) mlf = smw;
				var txt = transtime(mlf * rate / initial_width);
				$(".play-line-container").css("left", mlf).find(".play-line-time").text(txt);
			};
		}
	});
	$(".play-line-container").on("mousedown", function(ev) {
		var $length_ = $(".drag-source").length;
		smw = 0;
		if($length_ == 0) isDrag = false;
		else {
			var ev = window.event || ev;
			x = ev.clientX - this.offsetLeft;
			$(".drag-source").each(function(index, ele) {
				var w = parseFloat($(ele).css("width"));
				smw += w;
			});
			isDrag = true;
		}
	});
	$(document).on("mousemove", function(ev) {
		if(isDrag) {
			var ev = window.event || ev;
			var lf = ev.clientX - x;
			if(lf <= 0) lf = 0;
			else if(lf >= smw) lf = smw;
			var txt = transtime(lf * rate / initial_width);
			$(".play-line-container").css("left", lf).find(".play-line-time").text(txt);
		}
	});
	$(document).on("mouseup", function(ev) {
		isDrag = false;
	});

	//重置
	$("#resetedit").on("click", function() {
		$("#materialbox").find(".materialbox_con").not(":first").remove();
		$("#simpleList").find(".drag-source").remove();
		$(".drag_here,.play-line-container").css("left", "0");
		$(".play-line-container").find(".play-line-time").text("0:00");
		$(".time-ruler").find(".hline").css("width", "0").end().find(".section").empty().end().find(".mtick").remove();
		$("#storedit").prop("disabled", true).removeClass("btn-primary");
	});
	//保存
	$("#storedit").on("click", function() {
		var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
		var timearr = new Array();
		$(".layer-video-clips").find(".drag-source").each(function(index, ele) {
			timearr.push($(ele).find(".layer-clip-duration").text());
		});
		var duration = getsum(timearr);
		if(duration > 0) duration = transtime(duration);
		//var $tr = $('<tr><td style="width:30px;"><input type="checkbox" class="edit_select" /></td><td class="col-sm-5"><div class="material_infor"><div class="material_infor_img"></div><div class="material_infor_txt"><p><span class="">视频_1517806653001</span></p><p><span class="text-muted">任务ID：' + generateUUID() + '</span></p><p><span class="text-muted">视频时长：' + duration + '</span></p></div></div></td><td class="col-sm-2">草稿</td><td class="col-sm-3">' + time + '</td><td class="text-center"><a href="video_editor.html" class="clde">编辑</a><span class="text-explode">|</span><a href="javascript:" class="editlist_del clde">删除</a></td></tr>');
		//点击保存按钮，生成编辑列表tr,若视频剪辑区无视频,时长为0，若有，则为所有视频时长相加之和
		console.log("视频编辑保存成功!");
	});
	//生成视频
	$("#makevideo").on("click", function() {
		console.log("生成视频任务提交成功!");
		window.location.href="video_editor_list.html";
	});

	/*编辑列表*/
	$(".edit_selectall").on("click", function() {
		$(".editllist").find("input[type=checkbox]").prop("checked", $(this).prop("checked"));
		$(".edit_selectall").prop("checked", $(this).prop("checked"));
		if($(".editllist").find("input[type=checkbox]").is(":checked")) $(".batch_del").prop("disabled", false);
		else $(".batch_del").prop("disabled", true);
	});
	$(".editllist").find("input[type=checkbox]").on("click", function() {
		if(!$(this).is("checked")) $(".edit_selectall").prop("checked", false);
		var sel_flag = true;
		$(".editllist").find("input[type=checkbox]").each(function(index, ele) {
			if(!$(ele).is(":checked")) {
				sel_flag = false;
				return;
			}
		});
		if(sel_flag) {
			$(".edit_selectall").prop("checked", true);
		};
		if($(".editllist").find("input[type=checkbox]").is(":checked")) $(".batch_del").prop("disabled", false);
		else $(".batch_del").prop("disabled", true);
	});
	//编辑列表删除
	$(".editlist_del").on("click", function() {
		deleate($(this), "删除编辑任务", "你确定要删除编辑任务吗？");
		$(this).parent().siblings().find("input[type=checkbox]").prop("checked", true);
		$(".batch_del").prop("disabled", false);
		$(".modal-footer").find(".btn-primary").text("确定").attr("id", "editlistdel");
	});
	$(".batch_del").on("click", function() {
		deleate($(this), "删除编辑任务", "你确定要删除编辑任务吗？");
		$(".modal-footer").find(".btn-primary").text("确定").attr("id", "editlistdel");
	});
	$("#myModal").on("click", "#editlistdel", function() {
		$(".editllist").find("input[type=checkbox]:checked").parent().parent().remove();
		tooltip("删除编辑任务成功！");
		$("#myModal").modal("hide");
	});

	//
	$('#myModal').on('hidden.bs.modal', function(e) {
		$(".modal").removeClass("bs-example-modal-lg bs-example-modal-sm");
		$(".modal-dialog").removeClass("modal-lg modal-sm");
		$(".modal-content").html('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Modal title</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save changes</button></div>');
	});
	//
});

function tooltip(str) {
	var tipdiv = $('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + str + '</div>');
	$(".growl").append(tipdiv).addClass("on");
	setTimeout(function() {
		$(".growl").empty(tipdiv).removeClass("on");
	}, 2000);
};
var concat_ = function(arr1, arr2) {
	var arr = arr1.slice(0)
	for(var i = 0; i < arr2.length; i++) {
		arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
	}
	return arr;
}

function stop_select(element) {
	if(typeof(element.onselectstart) != "undefined") {
		// IE下禁止元素被选取          
		element.onselectstart = new Function("return false");
	} else {
		// firefox下禁止元素被选取的变通办法          
		element.onmousedown = new Function("return false");
		element.onmouseup = new Function("return true");
	}
};

function transtime(num) {
	var long_ = "";
	var hour = Math.floor(num / 3600);
	var min = Math.floor(num / 60) % 60;
	var sec = num % 60;
	if(hour <= 0) long_ = "";
	else if(hour >= 1 && hour < 10) long_ = '0' + hour + ":";
	else long_ = hour + ":";
	if(min < 10) long_ += "0" + min + ":";
	else long_ += min + ":";
	if(sec < 10) long_ += "0" + sec.toFixed(1);
	else long_ += sec.toFixed(1);
	return long_;
}

function toPercent(point) {
	var str = Number(point * 100).toFixed(1);
	str += "%";
	return str;
}

function getsum(arr) {
	var s = "";
	var sum = 0;
	$.each(arr, function(index, ele) {
		var t = arr[index].split(":");
		if(t.length == 2) {
			s = Number(t[0] * 60) + Number(t[1]);
		} else if(t.length == 3) {
			s = Number(t[0]) * 3600 + Number(t[1]) * 60 + Number(t[2]);
		} else console.log("格式错误")
		sum += Number(s);
	});
	return sum;
};
Number.prototype.toFixed = function(s) {
	return(parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
};

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return(c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds() // 毫秒
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
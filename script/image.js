$(document).ready(function() {
	/*文件管理*/
	$("body").on("mouseover", "#fileList tr", function() {
		$(this).addClass("hovered")
	});
	$("body").on("mouseout", "#fileList tr", function() {
		$(this).removeClass("hovered")
	});
	// 删除 init
	function delinit() {
		if(!$("#fileList").find("input[name=filesign]").length) {
			$("#ckboxall").attr("disabled", true).prop("checked", false);
		} else $("#ckboxall").attr("disabled", false);
	}
	delinit();
	$("body").on("click", "#fileList tr:not(.returnline)", function() {
		var check = $(this).find("input[type=checkbox]");
		if(check.is(":checked")) {
			check.prop("checked", false);
			$(this).removeClass("selected");
			$("#ckboxall").prop("checked", false);
		} else {
			check.prop("checked", true);
			$(this).addClass("selected");
		}
		checkstate();
	});
	$("#ckboxall").click(function() {
		if($(this).is(":checked")) {
			$("#fileList input[name=filesign]").prop("checked", true).parents("tr").addClass("selected");
			if($("#fileList").find(".filefolder").length == 0) {
				$(".filedel").prop("disabled", false);
				$(".gatwrapper").removeClass("bg");
			} else {
				$(".filedel").prop("disabled", true);
				$(".gatwrapper").addClass("bg");
			}
		} else {
			$("#fileList input[name=filesign]").prop("checked", false).parents("tr").removeClass("selected");
			$(".gatwrapper").removeClass("bg");
		}
	});
	$("body").on("change", "#fileList input[name=filesign]", function(e) {
		e.stopPropagation();
		if(!$(this).is(":checked")) $("#ckboxall").prop("checked", false);
		var flag = true;
		$("#fileList input[name=filesign]").each(function(index, ele) {
			if(!$(ele).is(":checked")) {
				flag = false;
				return;
			}
		});
		if(flag) {
			$("#ckboxall").prop("checked", true);
		};
		checkstate();
	});

	function checkstate() {
		var $length = $(".processingtable table tbody").find("input[type=checkbox]:checked").length;
		if($length == 1) {
			$(".filedel").prop("disabled", false);
			$(".gatwrapper").removeClass("bg");
		} else if($length > 1) {
			var da = true;
			$(".processingtable table tbody").find("input[type=checkbox]:checked").each(function(index, ele) {
				var td = $(ele).parent().parent().next();
				if(td.find("span").hasClass("filefolder")) da = false;
			});
			if(da) {
				$(".filedel").prop("disabled", false);
				$(".gatwrapper").removeClass("bg");
			} else {
				$(".filedel").prop("disabled", true);
				$(".gatwrapper").addClass("bg");
			}
		} else {
			$(".filedel").prop("disabled", true);
			$(".gatwrapper").removeClass("bg");
		}
	}
	//点击文件管理列表项目文件夹
	$("body").on("click", ".offolder", function(e) {
		$("#fileList").html(template("directory", []));
		$(".goback_uper").find("i").text($(this).text());
		e.stopPropagation();
	});
	//返回上级
	$("body").on("click", ".goback_uper", function(e) {
		e.stopPropagation();
		$("#fileList").html(template("appendtr", []));
	});
	//预览、设置
	var td;
	$("body").on("click", ".imgpreview", function(e) {
		previews($(this), $(this).next().val(), $(this).text());
		e.stopPropagation();
	});
	$("body").on("click", ".filesetup", function(e) {
		previews($(this), $(this).parent().siblings().find(".contype").val(), $(this).parent().siblings().find(".imgpreview").text());
		e.stopPropagation();
	});

	$("body").on("click", "#previewcolse", function() {
		$(this).removeAttr("id");
		var picturestyle = $(".picturestyle option:selected").val();
		console.log(picturestyle); //获得图片样式select值
	});

	function previews(obj, type, str) {
		td = obj.parent();
		td.parent().addClass("selected");
		td.parent().siblings().removeClass("selected");
		td.parent().siblings().find("input[type=checkbox]").prop("checked", false);
		td.siblings().find("input[type=checkbox]").prop("checked", true);
		showpanel();
		$(".slide-panel").css("width", "500px");
		$(".panel-body").html(template("preview_panel", []));
		$("#contenttype").text(type);
		$(".panel-title h4").text("预览");
		$(".panel-body").find(".filename").text(str);
		$(".panel-header .panel-close").attr("id", "previewcolse");
	}
	$("body").on("mouseover", ".preview-con", function() {
		$(".prev-arrow,.next-arrow").css({
			"display": "block",
			"top": ($(".preview-con").outerHeight() - $(".prev-arrow").height()) / 2 + "px"
		});
	});
	$("body").on("mouseout", ".preview-con", function() {
		$(".prev-arrow,.next-arrow").css("display", "none");
	});
	//上一个
	$("body").on("click", ".prev-arrow", function() {
		showtxt(td.parent().prev());
	});
	//下一个
	$("body").on("click", ".next-arrow", function() {
		showtxt(td.parent().next());
	});

	function showtxt(obj) {
		$(".panel-body").addClass("hide");
		$(".loadBox").removeClass("hide");
		var prevtr = obj;
		var fileroute = prevtr.find(".imgpreview").text();
		prevtr.addClass("selected");
		prevtr.find("input[type=checkbox]").prop("checked", true);
		prevtr.siblings().removeClass("selected");
		prevtr.siblings().find("input[type=checkbox]").prop("checked", false);
		$(".panel-body").find(".filename").text(fileroute);
		$(".panel-body").removeClass("hide");
		$(".loadBox").addClass("hide");
		prevtr.addClass("selected").siblings().removeClass("selected");
		td = prevtr.find("td");
	}
	$("body").on("mouseover", ".panelpover", function() {
		$(this).css("cursor", "pointer").parent().siblings(".filealert").addClass("bg");
	});
	$("body").on("mouseout", ".panelpover", function() {
		$(this).css("cursor", "default").parent().siblings(".filealert").removeClass("bg");
	});

	//链接有效时间：
	$("body").on("keyup", "#timeOut", function() {
		inputoption($(this).val(), $("#mhjdv"), 1, 28800);
	});
	//使用 HTTPS
	var HTTPS;
	$("body").on("click", "#HTTPS_label", function() {
		var $url = $(".filetext").text();
		if($("#HTTPS").is(":checked")) {
			HTTPS = false;
			$url = $url.replace("https", "http");
		} else {
			HTTPS = true;
			$url = $url.replace("http", "https");
		}
		$(".filetext").text($url)
	});
	//打开文件url
	$("body").on("click", ".openurl", function() {
		window.open($(".filetext").text());
	});

	//文件管理列表－－上传文件
	function hidepanel() {
		$(".show-panel").removeClass("hhien_bg").addClass("hhien");
		$(".show-panel .slide-panel-mask").addClass("hide");
		$(".show-panel .slide-panelbox").removeClass("bg");
	}

	function showpanel() {
		$(".show-panel").removeClass("hhien").addClass("hhien_bg");
		$(".show-panel .slide-panel-mask").removeClass("hide");
		$(".show-panel .slide-panelbox").addClass("bg");
	}

	$(".panel-close").on("click", function() {
		hidepanel();
	});

	var uploader;
	$("#uploadfiles").on("click", function() {
		showpanel();
		$(".slide-panel").css("width", "595px");
		$(".panel-body").html(template("uploadfiles_panel", []));
		$(".panel-title h4").text("上传文件");
		$(".directory-control").append('<span class="current-path">/</span>');
		//选择文件上传
		var $wrap = $('#uploader'),
			fileCount = 0,
			loadingCount = 0,
			complateCount = 0,
			faileCount = 0;
		state = 'pedding',
			$progress = $(".fileprogress"),
			percentages = {},
			// 判断浏览器是否支持图片的base64
			isSupportBase64 = (function() {
				var data = new Image();
				var support = true;
				data.onload = data.onerror = function() {
					if(this.width != 1 || this.height != 1) {
						support = false;
					}
				}
				data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
				return support;
			})(),
			// 检测是否已经安装flash，检测flash的版本
			flashVersion = (function() {
				var version;

				try {
					version = navigator.plugins['Shockwave Flash'];
					version = version.description;
				} catch(ex) {
					try {
						version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
							.GetVariable('$version');
					} catch(ex2) {
						version = '0.0';
					}
				}
				version = version.match(/\d+/g);
				return parseFloat(version[0] + '.' + version[1], 10);
			})(),

			supportTransition = (function() {
				var s = document.createElement('p').style,
					r = 'transition' in s ||
					'WebkitTransition' in s ||
					'MozTransition' in s ||
					'msTransition' in s ||
					'OTransition' in s;
				s = null;
				return r;
			})();

		if(!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {

			// flash 安装了但是版本过低。
			if(flashVersion) {
				(function(container) {
					window['expressinstallcallback'] = function(state) {
						switch(state) {
							case 'Download.Cancelled':
								alert('您取消了更新！')
								break;

							case 'Download.Failed':
								alert('安装失败')
								break;

							default:
								alert('安装已成功，请刷新！');
								break;
						}
						delete window['expressinstallcallback'];
					};

					var swf = './expressInstall.swf';
					// insert flash object
					var html = '<object type="application/' +
						'x-shockwave-flash" data="' + swf + '" ';
					if(WebUploader.browser.ie) {
						html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
					}
					html += 'width="100%" height="100%" style="outline:0">' +
						'<param name="movie" value="' + swf + '" />' +
						'<param name="wmode" value="transparent" />' +
						'<param name="allowscriptaccess" value="always" />' +
						'</object>';

					container.html(html);

				})($wrap);
				// 压根就没有安转。
			} else {
				$wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
			}

			return;
		} else if(!WebUploader.Uploader.support()) {
			alert('Web Uploader 不支持您的浏览器！');
			return;
		}
		// 实例化
		uploader = WebUploader.create({
			swf: 'webupload/Uploader.swf',
			server: 'http://192.168.1.125:8092/uploads/fileupload.php',
			pick: '#filePicker',
			resize: false,
			dnd: '#dndArea',
			disableGlobalDnd: true,
			compress: false,
			chunked: true,
			chunkSize: 10 * 1024 * 1024,
			threads: 1,
			auto: true,
			accept: {
				extensions: "txt,jpg,jpeg,,gif,bmp,png,zip,rar,war,pdf,cebx,doc,docx,ppt,pptx,xls,xlsx,mov,rm,rmvb,wmv,mpg,gdf,mp4,avi,3gp,cd,ogg,mp3,asf,wma,wav,mp3pro,rm,real,ape,module,midi,vqf,html,xml,js,css,java,php,asp,jsp,less,sass,scss,ts,json,aspx,coffee,erb,rb",
				mimeTypes: '.txt,.jpg,.jpeg,.gif,.bmp,.png,.zip,.rar,.war,.pdf,.cebx,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mov.rm.rmvb.wmv.mpg.gdf.mp4.avi.3gp,.cd,.ogg,.mp3,.asf,.wma,.wav,.mp3pro,.rm,.real,.ape,.module,.midi,.vqf,.html,.xml,.js,.css,.java,.php,.asp,.jsp,.less,.sass,.scss,.ts,.json,.aspx,.coffee,.erb,.rb',
			},
			fileNumLimit: 300,
			fileSizeLimit: 200 * 1024 * 1024, // 200 M
			fileSingleSizeLimit: 50 * 1024 * 1024 // 50 M
		});

		function addFile(file) {
			var $tr = $('<tr id="' + file.id + '"><td><span class="up-filename">' + file.name + '</span><input type="hidden" class="fileext" value="' + file.ext + '" /><input type="hidden" class="filetype" value="' + file.type + '" /><input type="hidden" class="fileid"  value="' + file.id + '" /></td><td><span class="filesize">' + file.size + '</span></td><td class="filespeed"><p class="fileprogress"><span></span></p></td><td class="text-right"></td></tr>'),
				$prgress = $tr.find("p.fileprogress span"),
				showError = function(code) {
					switch(code) {
						case 'interrupt':
							text = '上传暂停';
							break;
						case 'cancelled':
							text = '上传取消';
							break;
						default:
							text = '上传失败，请重试';
							break;
					}
					layer.msg(text, {
						time: 2000,
						icon: 5
					})
				};
			if(file.getStatus() === 'invalid') {
				showError(file.statusText);
				faileCount++;
				fileCount--;
			} else {
				percentages[file.id] = [file.size, 0];
				file.rotation = 0;
			}
			file.on('statuschange', function(cur, prev) {
				if(prev === 'progress') {
					$prgress.hide().width(0);
				} else if(prev === 'queued') {}
				if(cur === 'error' || cur === 'invalid') {
					console.log(file.statusText);
					showError(file.statusText);
					percentages[file.id][1] = 1;
					faileCount++;
					fileCount--;
					$prgress.parents("td.filespeed").addClass("text-impo").text("上传失败").next().html('<a href="javascript:" class="filedeldate">清除</a>');
				} else if(cur === 'interrupt') {
					showError('interrupt');
				} else if(cur === 'queued') {
					$prgress.css('display', 'block');
					percentages[file.id][1] = 0;
				} else if(cur === 'progress') {
					$prgress.css('display', 'block');
				} else if(cur === 'complete') {
					$prgress.hide().width(0);
					$prgress.parents("td.filespeed").addClass("text-success").text("上传成功").next().html('<a href="javascript:" class="filedeldate">清除</a>');
				}
				$tr.removeClass('state-' + prev).addClass('state-' + cur);
				var stats = uploader.getStats();
				var _length01 = $("#tasktablebody .text-success").length;
				complateCount = _length01;
				loadingCount = stats.progressNum;
				faileCount += stats.uploadFailNum;
				$(".taskdata").find(".tk_complate").text(complateCount);
				$(".taskdata").find(".tk_error").text(faileCount);
				$(".taskdata").find(".tk_uploading").text(loadingCount);
			});
			$("#tasktablebody").append($tr);
		}
		// 负责view的销毁
		function removeFile(file) {
			var $li = $('#' + file.id);
			delete percentages[file.id];
		}
		var fileflag = true;
		uploader.onBeforeFileQueued = function(file) {
			var _length = $(".directory-control").find(".specified_directory").length;
			var _small = $(".specified_directory").next();
			if(_length == 1) {
				if(!_small.hasClass("hide")) fileflag = false;
				else fileflag = true;
			}
		}
		uploader.onFileQueued = function(file) {
			fileCount++;
			if(fileCount === 1) {
				$(".slide-panel").css("width", "640px");
				$(".panel-body").html(template("uploadtask", []));
				$(".panel-title h4").text("上传任务");
				$(".panel-header .panel-close").attr("id", "taskcolse");
			}
			addFile(file);
			$(".taskdata").find(".tk_total").text(fileCount);
		};
		uploader.onStartUpload = function() {
			var stats = uploader.getStats();
			$(".taskdata").find(".tk_uploading").text(stats.progressNum);
		}
		uploader.onUploadStart = function(file) {
			console.log(file.ext + ":" + file.type);
			var $li = $('#' + file.id);
			if(fileflag) {
				$li.find("td:last").html('<a href="javascript:" class="filecancel">取消</a>');
			} else {
				faileCount++;
				uploader.removeFile(file.id, true);
				$li.find("td:last").html('<a href="javascript:" class="filedeldate">清除</a>');
				$li.find("p.fileprogress span").hide().width(0);
				$li.find(".filespeed").find(".fileprogress").addClass("text-impo").text("上传失败");
				$(".taskdata").find(".tk_error").text(faileCount);
			}
		}
		uploader.onUploadProgress = function(file, percentage) {
			var $li = $('#' + file.id),
				$percent = $li.find('.fileprogress span');
			$percent.css({
				"width": percentage * 100 + '%',
				"display": "block"
			});
			percentages[file.id][1] = percentage;
		};
		uploader.onUploadComplete = function(file) {
			var _length01 = $("#tasktablebody .text-success").length;
			var stats = uploader.getStats();
			complateCount = _length01;
			loadingCount = stats.progressNum;
			faileCount += stats.uploadFailNum;
			$(".taskdata").find(".tk_complate").text(complateCount);
			$(".taskdata").find(".tk_error").text(faileCount);
			$(".taskdata").find(".tk_uploading").text(loadingCount);
			$(".taskdata").find(".tk_total").text(fileCount);
		};
		//取消上传
		$("body").on("click", ".filecancel", function() {
			var fileItem = $(this).parents("tr");
			uploader.removeFile($(fileItem).attr("id"), true);
			var _length01 = $("#tasktablebody .text-success").length;
			var stats = uploader.getStats();
			fileCount = stats.queueNum + _length01;
			$(this).parent().prev().find(".fileprogress").addClass("text-muted").text("上传取消");
			$(this).attr("class", "filedeldate").text("清除");
			$(".taskdata").find(".tk_total").text(fileCount);
		});
		//清除
		$("body").on("click", ".filedeldate", function() {
			var fileItem = $(this).parents("tr");
			fileItem.remove();
			var _length = $("#tasktablebody tr").length;
			var _length01 = $("#tasktablebody .text-success").length;
			fileCount = $("#tasktablebody .text-success").length + $("#tasktablebody .text-impo").length;
			complateCount = _length01;
			faileCount = $("#tasktablebody .text-impo").length;
			$(".taskdata").find(".tk_total").text(fileCount);
			$(".taskdata").find(".tk_complate").text(complateCount);
			$(".taskdata").find(".tk_error").text(faileCount);
			var empty_tr = $('<tr class="emptytr"><td colspan="4" class="taskemptytd"><div class="taskempty">暂无数据</div></td></tr>');
			if(_length == 0) {
				$("#tasktablebody").append(empty_tr);
				$(".taskdata").find("em").text("0");
			};
		});
		//
	});
	$("body").on("click", ".catalog a", function() {
		$(this).addClass("active").siblings().removeClass("active");
		if($(this).hasClass("specified")) $(".directory-control").empty().append('<input type="text" class="specified_directory" data-toggle="popover" /><small class="text-impo hide"></small>');
		else $(".directory-control").empty().append('<span class="current-path">/</span>');
		var popovu = "<ul><li>1.填写您文件存储到 Bucket 上的绝对路径地址，为空代表根目录，首尾可不写斜杠（/）</li><li>2.长度限制在 1-254 之间</li><li>3.斜杠不能连续出现，斜杠与斜杠之间必须要有内容分开</li></ul>"
		$(".specified_directory").popover({
			animation: true,
			content: popovu,
			html: true,
			placement: "bottom",
			trigger: "hover"
		});
	});
	$("body").on("mouseenter", ".specified_directory", function() {
		$(this).css("borderColor", "#969a9c");
	});
	$("body").on("mouseleave", ".specified_directory", function() {
		$(this).css("borderColor", "#d7d8d9");
	});
	$("body").on("mouseover", ".tasktable tbody tr", function() {
		$(this).addClass("hovered")
	});
	$("body").on("mouseout", ".tasktable tbody tr", function() {
		$(this).removeClass("hovered")
	});
	//文件目录
	var reg_01 = /^[..]/;
	var reg_02 = /^[/]/;
	var reg_03 = /([/])(\1){1,}/;

	function directoryreg(str, obj) {
		if(str) {
			if($.trim(str) == "") {
				obj.siblings("small").removeClass("hide").text("不能为空");
			} else if(reg_01.test($.trim(str))) {
				obj.siblings("small").removeClass("hide").text("目录路径中不允许出现名为「..」的子目录");
			} else if(reg_02.test($.trim(str))) {
				obj.siblings("small").removeClass("hide").text("目录路径不允许以「/」打头");
			} else if(reg_03.test($.trim(str))) {
				obj.siblings("small").removeClass("hide").text("目录路径不允许出现连续的「/」");
			} else if(str.length > 254) {
				obj.siblings("small").removeClass("hide").text("总长度需在 1-254 之间");
			} else {
				obj.siblings("small").addClass("hide");
				//console.log(str.replace(/\s+/g, ""));
			}
		} else {
			obj.siblings("small").removeClass("hide").text("不能为空");
			return;
		}
	}

	$("body").on("keyup", ".specified_directory", function() {
		var pathval = $(this).val();
		directoryreg(pathval, $(this));
	});
	//关闭上传任务
	$("body").on("click", "#taskcolse", function() {
		uploader.reset();
		var fileCount = 0,
			fileList = "",
			filename_arr = [],
			fileext_arr = [],
			filetype_arr = [],
			filesize_arr = [],
			fileid_arr = [];
		if($("#tasktablebody").find(".text-success").length) {
			$("#tasktablebody").find(".text-success").each(function(index, ele) {
				var _name = $(ele).siblings().find(".up-filename").text(),
					_ext = $(ele).siblings().find(".fileext").val(),
					_type = $(ele).siblings().find(".filetype").val(),
					_size = $(ele).siblings().find(".filesize").text();
				_id = $(ele).siblings().find(".fileid").val();
				filename_arr.push(_name);
				fileext_arr.push(_ext);
				filetype_arr.push(_type);
				filesize_arr.push(_size);
				fileid_arr.push(_id);
				return filename_arr, fileext_arr, filetype_arr, filesize_arr, fileid_arr;
			})
			$("#ckboxall").attr("disabled", false);
		}
		$.each(filename_arr, function(index, ele) {
			var oclass;
			switch(fileext_arr[index]) {
				case "bmp":
				case "gif":
				case "jpg":
				case "png":
					oclass = "fileimage";
					break;
				case "xml":
				case "html":
				case "js":
				case "css":
				case "php":
				case "json":
				case "asp":
				case "jsp":
				case "less":
				case "sass":
				case "scss":
				case "ts":
					oclass = "filecss";
					break;
				case "mov":
				case "rm":
				case "rmvb":
				case "wmv":
				case "avi":
				case "3gp":
				case "mp4":
					oclass = "filemkv";
					break;
				case "mp3":
					oclass = "fileaudo";
					break;
				case "pdf":
					oclass = "filepdf";
					break;
				case "docx":
				case "doc":
					oclass = "fileword";
					break;
				case "ppt":
				case "pptx":
					oclass = "fileppt";
					break;
				case "xlsx":
					oclass = "filexml";
					break;
				case "txt":
					oclass = "filetxt";
					break;
				case "cebx":
				case "war":
				case "rar":
				case "zip":
					oclass = "filezip";
					break;
				default:
					oclass = "file--";
			}
			fileList = $('<tr><td><span><input type="checkbox" name="filesign" class="checkboxui" id="' + fileid_arr[index] + '"><label for="' + fileid_arr[index] + '" class="checkboxui-label"></label></span></td><td><span class="imgfile"></span></td><td class="col-name"><a href="javascript:" class="imgpreview">' + filename_arr[index] + '</a><input type="hidden" class="contype" value="' + filetype_arr[index] + '" /></td><td>' + filesize_arr[index] + '</td><td>标准存储</td><td>' + getNowFormatDate() + '</td><td class="text-right"><a href="javascript:" class="filesetup">设置</a></td></tr>');
			$("#fileList").find(".emptytr").remove();
			$("#fileList").prepend(fileList);
			$("input#" + fileid_arr[index]).parent().parent().next().find(".imgfile").addClass(oclass);
		});
		$(this).removeAttr("id");
	});
	//文件管理列表－－新建目录
	$("#new_directory").click(function() {
		showpanel();
		$(".slide-panel").css("width", "510px");
		$(".panel-body").html(template("newdirectory", []));
		$(".panel-title h4").text("新建目录");
	});
	$("body").on("mouseover", "#directory_name", function() {
		$(this).css("cursor", "pointer");
		$(".directory_alert").addClass("bg");
	});
	$("body").on("mouseout", "#directory_name", function() {
		$(this).css("cursor", "default");
		$(".directory_alert").removeClass("bg");
	});
	$("body").on("keyup", ".directory_name", function() {
		var pathval = $(this).val();
		directoryreg(pathval, $(this));
		$(".directoryleng").find("i").text(pathval.length);
	});
	//新建目录确定
	$("body").on("click", ".direcfoot .btn-primary", function() {
		if(!$(".directory_name").val()) {
			$(".directory_name").next().removeClass("hide").text("不能为空");
			return;
		} else {
			if($(".directory_name").next().hasClass("hide")) {
				$(".panel-close").trigger("click");
				var directory = $(".directory_name").val().replace(/\s+/g, "");
				var directory_arr = [];
				var randomId = getRandom(1000);
				var folder_tr;
				if(directory.indexOf("/") > -1) { //大于一级
					directory_arr = directory.split("/");
					//egg: a/b
					folder_tr = $('<tr><td><span><input type="checkbox" name="filesign" class="checkboxui" id="' + randomId + '"><label for="' + randomId + '" class="checkboxui-label"></label></span></td><td><span class="imgfile filefolder"></span></td><td class="col-name"><a href="javascript:" class="offolder">' + directory_arr[0] + '/</a></td><td></td><td></td><td></td><td class="text-right"></td></tr>');
					$("body").on("click", ".offolder", function(e) {
						var $this = $(this);
						var randomId01 = getRandom(1000);
						var folder_tr01 = $('<tr><td><span><input type="checkbox" name="filesign" class="checkboxui" id="' + randomId01 + '"><label for="' + randomId01 + '" class="checkboxui-label"></label></span></td><td><span class="imgfile filefolder"></span></td><td class="col-name"><a href="javascript:" class="offolder">' + directory_arr[1] + '/</a></td><td></td><td></td><td></td><td class="text-right"></td></tr>');
						$("#fileList").html(template("directory", []));
						$(".goback_uper").find("i").text($this.text());
						$("#fileList").append(folder_tr01);
						$("#ckboxall").attr({
							"disabled": false,
							"checked": false
						});
						$("body").on("click", ".offolder", function(e) {
							var _this = $(this);
							$("#fileList").html(template("directory", []));
							$(".goback_uper").find("i").text($this.text() + _this.text());
							$("#ckboxall").attr({
								"disabled": true,
								"checked": false
							});
							e.stopPropagation();
						});
						e.stopPropagation();
					});
				} else { //一级目录
					folder_tr = $('<tr><td><span><input type="checkbox" name="filesign" class="checkboxui" id="' + randomId + '"><label for="' + randomId + '" class="checkboxui-label"></label></span></td><td><span class="imgfile filefolder"></span></td><td class="col-name"><a href="javascript:" class="offolder">' + directory + '/</a></td><td></td><td></td><td></td><td class="text-right"></td></tr>');
				}
				$("#fileList").find(".emptytr").remove();
				$("#fileList").prepend(folder_tr);
				$("#ckboxall").attr({
					"disabled": false,
					"checked": false
				});
			} else return;
		}
	});
	//新建目录取消
	$("body").on("click", ".direcfoot .btn-default", function() {
		$(".panel-close").trigger("click");
	});
	//文件管理列表－－删除
	$(".filedel").click(function() {
		$("#myModalLabel").text("删除文件");
		$(".modal-body").html("");
		$(".modal-footer").css("borderTop", "none");
		$(".modal-footer").find(".btn-primary").attr("id", "selectid");
		var select_line = [];
		$("#fileList input[type=checkbox]:checked").each(function() {
			var _parentsib = $(this).parent().parent().next();
			select_line.push(_parentsib.next().find("a").text());
			return select_line;
		});
		if(select_line.length == 1) {
			var odiv = $('<div class="clearfix"> <i class = "iconfont icon-wenhao2" style = "color:#F90;font-size: 40px;line-height: 40px;display: inline-block;float: left;"></i><div style = "color:#00C1DE;font-size: 14px;padding-left: 50px;"><p style = "color: #73777A;">确定删除这些目录么？ 目录删除需要一些时间， 请勿重复操作。</p><ol style ="padding: 10px;font-size: 14px;line-height: 18px;color: #9b9ea0;"><li style = "overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + select_line[0] + '</li></ol></div></div>');
		} else {
			var _li = "";
			$.each(select_line, function(index) {
				_li += ('<li style = "overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + select_line[index] + '</li>');
			});
			var odiv = $('<div class="clearfix"> <i class = "iconfont icon-wenhao2" style = "color:#F90;font-size: 40px;line-height: 40px;display: inline-block;float: left;"></i><div style = "color:#00C1DE;font-size: 14px;padding-left: 50px;"><p style = "color: #73777A;">确定删除这些文件么？</p><ol style ="padding: 10px;font-size: 14px;line-height: 18px;color: #9b9ea0;">' + _li + '</ol></div></div>');
		}
		$(".modal-body").append(odiv);
	});
	$("body").on("click", "#selectid", function() {
		$("#fileList input[name=filesign]:checked").parents("tr").remove();
		$('#myModal').modal('hide')
		delinit();
		$(".filedel").prop("disabled", true);
		$(this).removeAttr("id");
		if($("#fileList").find("input[name=filesign]").length == 0) $("#fileList").html(template("emptyline", []));
		layer.msg('删除成功', {
			time: 2000,
			icon: 1
		})
	});
	//文件管理列表－－刷新
	var loadbox = $('<div class="loadBox"><div class="loader">Loading...</div></div>');
	$("#filerefresh").click(function() {
			$("#ckboxall").prop("checked", false);
			$(".processingtable table").addClass("hide");
			$(".processingtable").append(loadbox);
			$("#fileList").html(template("appendtr", []));
			$(".processingtable table").removeClass("hide");
			loadbox.remove();
			delinit();
		})
		/*样式处理*/
	function styleListinit() {
		if($("#imgstyleList").find("tr:not(.emptytr)").length) {
			$("#exportstyle").prop("disabled", false);
		} else $("#exportstyle").prop("disabled", true);
	}
	styleListinit();
	$("body").on("mouseover", "#imgstyleList tr", function() {
		$(this).addClass("hovered")
	});
	$("body").on("mouseout", "#imgstyleList tr", function() {
		$(this).removeClass("hovered")
	});
	//新建样式 
	var viewimg_width = viewimg_height = 0;
	var the_preview_src;
	$("#newstyle").on("click", function() {
		showpanel();
		$(".slide-panel").css("width", "900px");
		$(".panel-body").css("paddingRight", "10px").html(template("imagestyle", []));
		$(".panel-title h4").text("图片样式");
		$(".basicedit").addClass("active");
		$("#edittype").html(template("basicedit", []));
		adaptive_direction = $("#direction").prop("checked");
		rangsilder(0, 100, $('#imgquality-slider'), $(".imgquality_rangval"), $(".imgquality_up"), $(".imgquality_down"));
		setTimeout(function() {
			the_preview_src = $("#the_preview").find("img").attr("src");
			viewimg_width = $("#the_preview").find("img").width();
			viewimg_height = $("#the_preview").find("img").height();
		}, 210);
	});
	var rule_reg = /[a-zA-Z0-9_.-]+/;
	var space_reg = /[\s]+/;
	$("body").on("keyup", ".rule_name", function() {
		var rule_name = $(this).val();
		if(!rule_name || space_reg.test(rule_name) || !rule_reg.test(rule_name)) {
			$(this).next().removeClass("hide");
			$(".imgstylefoot .btn-primary").prop("disabled", true);
			return;
		} else {
			$(this).next().addClass("hide");
			$(".imgstylefoot .btn-primary").prop("disabled", false);
		}
	});
	//新建样式--确定按钮 
	$("body").on("click", "#imgstyle_primary", function() {
		if($(".basicedit").hasClass("active")) { //基本编辑
			if($(".rule_name").val() == "") {
				$(".rule_name").next().removeClass("hide");
				$(this).prop("disabled", true);
				return;
			} else {
				var style_tr = $('<tr><td class="stylerulename">' + $(".rule_name").val() + '</td><td>image/auto-orient,1/quality,q_90</td><td class="text-right"><a href="javascript:" class="imgstyle_edit">编辑</a>&nbsp;&nbsp;<a href="javascript:" class="imgstyle_del">删除</a></td></tr>');
				$("tr").remove(".emptytr");
				$("#imgstyleList").append(style_tr);
				$("#exportstyle").prop("disabled", false);
				hidepanel();
				mcttip("新建样式成功！");
			}
		} else { //高级编辑
			if($(".rule_name").val() == "") {
				$("#myModal").modal("show");
				$(".modal-body").html("");
				$("#myModalLabel").text("错误提示").css("font-size", "18px");
				var explaintxt = $('<p style="font-size:14px">图片样式名称错误，只能包含数字、字母、下划线(_)、短横线(-)以及小数点(.)；长度必须在1-63字节之间</p>');
				$(".modal-body").append(explaintxt);
				$(".modal-header,.modal-footer").css("border", "none");
				return;
			} else {
				var style_tr = $('<tr><td>' + $(".rule_name").val() + '</td><td>' + $(".senioreditarea").val() + '</td><td class="text-right"><a href="javascript:" class="imgstyle_edit">编辑</a>&nbsp;&nbsp;<a href="javascript:" class="imgstyle_del">删除</a></td></tr>');
				$("tr").remove(".emptytr");
				$("#imgstyleList").append(style_tr);
				$("#exportstyle").prop("disabled", false);
				hidepanel();
				mcttip("新建样式成功！");
			}
		}
	});
	//select	
	$("body").on("click", "[name='nice-select']", function(e) {
		$('[name="nice-select"]').removeClass("action").find('ul').removeClass("action");
		$(this).addClass("action");
		$(this).find('ul').addClass("action");
		e.stopPropagation();
	});
	$("body").on("mouseover", "[name='nice-select'] li", function(e) {
		$(this).addClass('on').siblings().removeClass("on");
		e.stopPropagation();
	});
	$("body").on("mouseout", "[name='nice-select'] li", function(e) {
		$("[name='nice-select'] li").removeClass('on');
		e.stopPropagation();
	});
	$("body").on("click", "[name='nice-select'] li", function(e) {
		var val = $(this).text();
		var dataVal = $(this).attr("data-value");
		$(this).parents('[name="nice-select"]').find('input').val(val);
		$(this).addClass("selected").siblings().removeClass("selected");
		$('[name="nice-select"]').removeClass("action").find('ul').removeClass("action");
		e.stopPropagation();
	});
	$(document).click(function() {
		$('[name="nice-select"]').removeClass("action").find('ul').removeClass("action");
	});
	$("body").on("mouseenter", ".numpihandl span ", function() {
		$(this).addClass("spahove1").siblings().addClass("spahove2");
	});
	$("body").on("mouseleave", ".numpihandl span ", function() {
		$(this).removeClass("spahove1").siblings().removeClass("spahove2");
	});
	//编辑类型
	$("body").on("click", ".edit_type .imgedittype", function() {
		$(this).addClass("active").siblings().removeClass("active");
		if($(".basicedit").hasClass("active")) {
			$("#edittype").html(template("basicedit", []));
			rangsilder(0, 100, $('#imgquality-slider'), $(".imgquality_rangval"), $(".imgquality_up"), $(".imgquality_down"));
		} else $("#edittype").html(template("senioredit", []));
	});
	//水印类型
	$("body").on("click", ".img_water_mark .imgedittype", function() {
		$(this).addClass("active").siblings().removeClass("active");
		if($(".img_mark").hasClass("active")) {
			$("#imgmarktype").html(template("img_mark", []));
			imgMask_url();
			rangsilder(-100, 100, $('#brightness-slider'), $(".brightness_rangval"), $(".imgbrightness_up"), $(".imgbrightness_down"));
			rangsilder(-100, 100, $('#compare-slider'), $(".compare_rangval"), $(".compare_up"), $(".compare_down"));
			rangsilder(0, 100, $('#img_transparency-slider'), $(".img_transparency_rangval"), $(".img_transparency_up"), $(".img_transparency_down"));
			imhsiez = $("#imhsiez").val();
			imgmarkdirection = $(".img_mark_position").find(".direction-grid.is-active").attr("value");
			img_vertical_margin = $(".img_vertical_margin").val();
			img_horizonal_margin = $(".img_horizonal_margin").val();
		} else if($(".words_mark").hasClass("active")) {
			$("#imgmarktype").html(template("words_mark", []));
			rangsilder(0, 100, $('#wordstxt_transparency-slider'), $(".wordstxt_transparency_rangval"), $(".wordstxt_transparency_up"), $(".wordstxt_transparency_down"));
			rangsilder(0, 100, $('#words_transparency-slider'), $(".words_transparency_rangval"), $(".words_transparency_up"), $(".words_transparency_down"));
			wordsmarkcon = $(".words_mark_con").val();
			wordsmark_fam = $("#wordsmark_fam").find("li.selected").attr("value");
			wordsmarksize = $(".words_mark_con_size").val();
			wordsmarkcolor = $(".words_mark_con_color").val();
			wordsmarkshadow = $("#textshadow").prop("checked");
			wordsmarkposition = $(".words_mark_position").find(".direction-grid.is-active").attr("value");
			words_vertical_margin = $(".words_vertical_margin").val();
			words_horizonal_margin = $(".words_horizonal_margin").val();
		} else $("#imgmarktype").html("");
	});
	$("body").on("click", ".direction-grid", function() {
		$(this).addClass("is-active").siblings().removeClass("is-active");
	});

	function imgMask_url() {
		$(".modal-header").find("#myModalLabel").text("选择图片路径");
		$(".modal-body").html(template("imgmarsk_url", []));
		//默认，tbody里面是文件管理和图片处理里面的所有图片;
		
		$(".imgsource").change(function() {//点击select筛选
			getdata($(this).find("option:selected").val());
		});
		//$('[data-toggle="tooltip"]').tooltip();
	}

	function getdata(selected) {
		$.ajax({
			type: "get",
			url: "json/imglist.js",
			dataType: 'json',
			success: function(data) {
				if(data) {
					renderSelect(data, selected);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("error");
				alert(XMLHttpRequest.responseText);
			},
		});
	}

	function renderSelect(data, selected) {
		var _html = "",
			val = data[selected];
		if(val) {
			for(var i = 0, len = val.length; i < len; i++) {
				console.log("name"+":"+val[i].name);
				_html += '<tr><td><input type="radio" name="imgurl" /></td><td>' + val[i].name + '</td><td>' + val[i].size + '</td><td>' + val[i].type + '</td><td>' + val[i].creationtime + '</td></tr>';
			}
			$("#branchlist").html(_html);
		}
	}
	//全屏显示图片
	$("body").on("click", "#fullscreen", function() {
		window.open('example.jpg.html?' + viewimg_width + ',' + viewimg_height, 'top=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no')
	});
	//缩略方式
	var img_ratio = 3 / 2; //图片比例
	var isnumber = /^[1-9]\d*$/; //匹配正整数
	var isw = true;
	var breviary; //缩略方式
	var breviary_items;
	$("body").on("click", "#abbreviation li", function() {
		var _this = $(this);
		breviary = _this.attr("value");
		switch(breviary) {
			case "abbreviations_equal": //等比例
				$("div").remove(".abbreviationcon");
				var osel = $('<div class="nice-select inline-block abbreviation_sel abbreviationcon" name="nice-select" id="equal_scale" ><input type="text" value="宽度固定，高度自适应" readonly><ul style="top:29px;"><li class="selected" value="width_fixed"><i></i>宽度固定，高度自适应</li><li class="" value="height_fixed"><i></i>高度固定，宽度自适应</li><li class="" value="short_side"><i></i>限定宽高，按短边缩放</li><li class="" value="long_side"><i></i>限定宽高，按长边缩放</li></ul></div>');
				$("#abbreviation").after(osel);
				$(".thumbnail_type").removeClass("hide");
				$("#thumbnail_width").prop("disabled", false).parent().removeClass("disabled");
				$("#thumbnail_height").prop("disabled", true).parent().addClass("disabled");
				widthfixed();
				break;
			case "abbreviations_fixedsiaze": //固定宽高缩放
				$("div").remove(".abbreviationcon");
				var osel = $('<div class="nice-select inline-block abbreviation_sel abbreviationcon" name="nice-select" id="fixedsize_scale"><input type="text" value="按短边缩放，居中裁剪" readonly><ul style="top:29px;"><li class="selected" value="_fill"><i></i>按短边缩放，居中裁剪</li><li class="" value="_pad"><i></i>按长边缩放，缩略填充</li></ul></div>');
				$("#abbreviation").after(osel);
				$(".thumbnail_type").removeClass("hide");
				$("#thumbnail_width").prop("disabled", false).parent().removeClass("disabled");
				$("#thumbnail_height").prop("disabled", false).parent().removeClass("disabled");
				//init 按短边缩放，居中裁剪
				break;
			case "no_abbreviations": //不使用缩略
				$("div").remove(".abbreviationcon");
				$(".thumbnail_type").addClass("hide");
				break;
		}
	});
	//等比例缩放
	$("body").on("click", "#equal_scale li", function() {
		breviary_items = $(this).attr("value");
		switch(breviary_items) {
			case "width_fixed":
				console.log("宽度固定，高度自适应");
				$("#thumbnail_width").prop("disabled", false).parent().removeClass("disabled");
				$("#thumbnail_height").prop("disabled", true).parent().addClass("disabled");
				widthfixed();
				break;
			case "height_fixed":
				console.log("高度固定，宽度自适应");
				$("#thumbnail_width").prop("disabled", true).parent().addClass("disabled");
				$("#thumbnail_height").prop("disabled", false).parent().removeClass("disabled");
				heightfixed();
				break;
			case "short_side":
				console.log("限定宽高，按短边缩放");
				$("#thumbnail_width").prop("disabled", false).parent().removeClass("disabled");
				$("#thumbnail_height").prop("disabled", false).parent().removeClass("disabled");
				//init
				viewimg_width = $("#thumbnail_width").val();
				viewimg_height = $("#thumbnail_height").val();
				if(!isnumber.test(viewimg_width) || !isnumber.test(viewimg_height)) {
					$("#the_preview").find("img").attr("src", "").css({
						"width": "310px",
						"height": "auto"
					});
					return;
				} else {
					$("#the_preview").find("img").attr("src", the_preview_src);
					//do somethings.....
				}
				break;
			case "long_side":
				console.log("限定宽高，按长边缩放");
				$("#thumbnail_width").prop("disabled", false).parent().removeClass("disabled");
				$("#thumbnail_height").prop("disabled", false).parent().removeClass("disabled");
				//init
				viewimg_width = $("#thumbnail_width").val();
				viewimg_height = $("#thumbnail_height").val();
				if(!isnumber.test(viewimg_width) || !isnumber.test(viewimg_height)) {
					$("#the_preview").find("img").attr("src", "").css({
						"width": "310px",
						"height": "auto"
					});
					return;
				} else {
					$("#the_preview").find("img").attr("src", the_preview_src);
					//do somethings.....
				}
				break;
		}
	});
	//固定宽高缩放
	$("body").on("click", "#fixedsize_scale li", function() {
		breviary_items = $(this).attr("value");
		switch(breviary_items) {
			case "_fill":
				console.log("按短边缩放，居中裁剪");
				//init
				viewimg_width = $("#thumbnail_width").val();
				viewimg_height = $("#thumbnail_height").val();
				if(!isnumber.test(viewimg_width) || !isnumber.test(viewimg_height)) {
					$("#the_preview").find("img").attr("src", "").css({
						"width": "310px",
						"height": "auto"
					});
					return;
				} else {
					$("#the_preview").find("img").attr("src", the_preview_src);
					//do somethings.....
				}
				break;
			case "_pad":
				console.log("按长边缩放，缩略填充");
				//init
				viewimg_width = $("#thumbnail_width").val();
				viewimg_height = $("#thumbnail_height").val();
				if(!isnumber.test(viewimg_width) || !isnumber.test(viewimg_height)) {
					$("#the_preview").find("img").attr("src", "").css({
						"width": "310px",
						"height": "auto"
					});
					return;
				} else {
					$("#the_preview").find("img").attr("src", the_preview_src);
					//do somethings.....
				}
				break;
		}
	});
	//缩略尺寸设置：
	function setupsize(obj, max, isw) {
		obj.on("keyup", function() {
			var setcon = obj.val();
			if(!setcon || !isnumber.test(setcon)) {
				$("#the_preview").find("img").attr("src", "").css({
					"width": "310px",
					"height": "auto"
				});
				return;
			} else {
				if(setcon > max) setcon = max;
				if(isw) {
					viewimg_width = setcon;
					viewimg_height = viewimg_width / img_ratio;
					$("#the_preview").find("img").css({
						"width": viewimg_width + "px",
						"height": viewimg_height + "px"
					});
				} else {
					viewimg_height = setcon;
					viewimg_width = viewimg_height * img_ratio;
					$("#the_preview").find("img").css({
						"width": viewimg_width + "px",
						"height": viewimg_height + "px"
					});
				}
				$("#the_preview").find("img").attr("src", the_preview_src);
			}
		});
	};
	// 宽度固定，高度自适应
	function widthfixed() {
		viewimg_width = $("#thumbnail_width").val();
		if(isnumber.test(viewimg_width)) {
			if(viewimg_width >= 310) viewimg_width = 310;
			viewimg_height = viewimg_width / img_ratio;
			$("#the_preview").find("img").attr("src", the_preview_src).css({
				"width": viewimg_width + "px",
				"height": viewimg_height + "px"
			});
		} else {
			$("#the_preview").find("img").attr("src", "").css({
				"width": "310px",
				"height": "auto"
			});
			return;
		}
		//设置
		setupsize($("#thumbnail_width"), 310, isw);
	};
	// 高度固定，宽度自适应
	function heightfixed() {
		viewimg_height = $("#thumbnail_height").val();
		if(isnumber.test(viewimg_height)) {
			if(viewimg_height >= 207) viewimg_height = 207;
			viewimg_width = viewimg_height * img_ratio;
			$("#the_preview").find("img").attr("src", the_preview_src).css({
				"width": viewimg_width + "px",
				"height": viewimg_height + "px"
			});
		} else {
			$("#the_preview").find("img").attr("src", "").css({
				"width": "310px",
				"height": "auto"
			});
			return;
		}
		//设置
		setupsize($("#thumbnail_height"), 207, !isw);
	};

	//缩略限制
	var breviary_limit;
	$("body").on("click", "#thumbnail_limit li", function() {
		breviary_limit = $(this).attr("value");
		if(breviary_limit == "unrestricted") {
			console.log("缩略限制：不限制");
		} else if(breviary_limit == "limited_picture") {
			console.log("缩略限制：限制图片放大");
		}
	});
	//自适应方向
	var adaptive_direction;
	$("body").on("click", "#direction_label", function() {
		if($("#direction").is(":checked")) {
			adaptive_direction = false;
			console.log("不自适应方向" + ":" + adaptive_direction);
		} else {
			adaptive_direction = true;
			console.log("自适应方向" + ":" + adaptive_direction);
		}
	});
	//保存格式
	var save_format;

	function pngbmpformat() {
		$(".gradualdisplay").addClass("hide");
		$("#imgqualityselect").find("li[value=uncompressed]").addClass("selected").siblings().removeClass("selected");
		$("#imgqualityselect").removeAttr("name").addClass("disabled");
		$("#imgqualityselect").find("input").val("不压缩").prop("disabled", true).css("cursor", "not-allowed");
		$("#imgqualityselect").next().addClass("hide");
	};

	function outherformat() {
		$("#imgqualityselect").attr("name", "nice-select").removeClass("disabled");
		$("#imgqualityselect").find("input").val("不压缩").prop("disabled", false).css("cursor", "pointer");
		$("#imgqualityselect").next().removeClass("hide");
	}
	$("body").on("click", "#save_format li", function() {
		save_format = $(this).attr("value");
		if(save_format == "original") {
			outherformat();
			console.log("原图格式");
		} else if(save_format == "jpg") {
			outherformat();
			$(".gradualdisplay").removeClass("hide");
			gradualdisplay = $("#gradual_display").prop("checked");
			console.log("jpg");
		} else if(save_format == "png") {
			pngbmpformat();
			console.log("png");
		} else if(save_format == "webp") {
			outherformat();
			console.log("webp");
		} else if(save_format == "bmp") {
			pngbmpformat();
			console.log("bmp");
		}
	});
	//渐进显示
	var gradualdisplay;
	$("body").on("click", "#gradual_display_label", function() {
		if($("#gradual_display").is(":checked")) {
			gradualdisplay = false;
			console.log("渐进显示关闭" + ":" + adaptive_direction);
		} else {
			gradualdisplay = true;
			console.log("渐进显示开启" + ":" + adaptive_direction);
		}
	});
	//图片质量
	var imgquality;
	$("body").on("click", "#imgqualityselect li", function() {
		imgquality = $(this).attr("value");
		if(imgquality == "relative_quality") {
			$(this).parent().parent().next().removeClass("hide");
			console.log("相对质量");
		} else if(imgquality == "absolute_quality") {
			$(this).parent().parent().next().removeClass("hide");
			console.log("绝对质量");
		} else {
			$(this).parent().parent().next().addClass("hide");
			console.log("不压缩");
		}
	});
	//图片水印
	var imgmarkurl;
	$("body").on("keyup", "#img_mark_url", function() {
		imgmarkurl = $(this).val();
		if(!imgmarkurl || !isurl.test(imgmarkurl)) {
			$("#the_preview").find("img").attr("src", "").css({
				"width": "310px",
				"height": "auto"
			});
		} else {
			$("#the_preview").find("img").attr("src", the_preview_src).css({
				"width": viewimg_width + "px",
				"height": viewimg_height + "px"
			});
		}
	});
	//图片尺寸
	var imhsiez;
	var isnumber01 = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/; // 0、正数
	var isnumber01_1 = /^-[0-9]*[1-9]\d*$/; //负整数
	var isnumber01_2 = /^-[0-9]+(.[0-9]+)?/; //负小数

	$("body").on("blur", "#imhsiez", function() {
		imhsiez = $(this).val();
		if(!imhsiez) $("#imhsiez").val("");
		else if(isnumber01.test(imhsiez)) {
			if(imhsiez == 0) $("#imhsiez").val("1");
			else if(imhsiez > 0 && imhsiez < 1) $("#imhsiez").val("1");
			else $("#imhsiez").val(Math.round(imhsiez));
		} else if(isnumber01_1.test(imhsiez) || isnumber01_2.test(imhsiez)) $("#imhsiez").val("1");
		else $("#imhsiez").val("");
	});
	//图片水印位置
	var imgmarkdirection;
	var img_vertical_margin = img_horizonal_margin = 0;
	$("body").on("click", ".direction-grid", function() {
		$(".direction-grid").removeClass("is-active");
		$(this).addClass("is-active");
		imgmarkdirection = $(this).attr("value");
	});

	//文字水印内容
	var wordsmarkcon;
	$("body").on("keyup", ".words_mark_con", function() {
		wordsmarkcon = $(this).val().trim();
		if(wordsmarkcon == "") {
			alert("文字水印必须含有文字内容，长度在16个字符内");
			return;
		} else {
			$("p").remove(".words_box");
			if(wordsmarkcon.length > 16) {
				wordsmarkcon = wordsmarkcon.substring(0, 15);
				$(this).val(wordsmarkcon);
			}
			$(this).siblings("span").find("i").text(wordsmarkcon.length);
			var words_box = $("<p class='words_box'>" + wordsmarkcon + "</p>");
			$("#the_preview").append(words_box);
		}
	});
	//文字字体
	var wordsmark_fam;
	//文字大小
	var wordsmarksize;
	//文字颜色
	var wordsmarkcolor;
	//文字阴影
	var wordsmarkshadow;
	$("body").on("click", "#textshadow-label", function() {
		if($("#textshadow").is(":checked")) {
			wordsmarkshadow = false;
			$(".wordshadow").addClass("hide");
			console.log("文字阴影不开启" + ":" + wordsmarkshadow);
		} else {
			wordsmarkshadow = true;
			$(".wordshadow").removeClass("hide");
			console.log("文字阴影开启" + ":" + wordsmarkshadow);
		}
	});
	//文字水印位置
	var wordsmarkposition;
	var words_vertical_margin = words_horizonal_margin = 0;

	//导入样式
	$("#fileEle").on("change", function(e) {
		var file = e.target.files[0];
		var type = file.name.split('.')[1];
		if(type != "txt") {
			alert('请上传txt文件');
			return;
		}
	});
	//导出样式
	$("#exportstyle").on("click", function() {});
	//图片处理－－访问设置
	var suffix_item; //存储设置的原图保护后缀
	var delim_item; //存储设置的自定义分隔符
	var noitem = $('<span class="next-select-placeholder">请选择</span>');
	$("#visitset").on("click", function() {
		showpanel();
		$(".slide-panel").css("width", "595px");
		$(".panel-title h4").text("访问设置");
		$(".panel-body").html(template("access_settings", []));
		suffix_item = new Array();
		delim_item = new Array();
	});
	$("body").on("click", "#protection_original_label", function(e) {
		if(!$("#protection_original").is(":checked")) {
			$(".suffixbox").removeClass("hide");
			$(".protection_suffix_inner").append(noitem);
		} else {
			$(".suffixbox").addClass("hide");
			$(".next-select-placeholder").remove();
		}
		e.stopPropagation();
	});
	$("body").on("click", ".protection_suffix", function(e) {
		$(this).addClass("opened");
		$(this).find(".protection_suffix_arrow").toggleClass("bg");
		$(".protection_suffix_menu").toggleClass("hide");
		e.stopPropagation();
	});

	$("body").on("mouseenter", ".protection_suffix_menu li", function(e) {
		$(this).addClass("focused");
		e.stopPropagation();
	});
	$("body").on("mouseleave", ".protection_suffix_menu li", function(e) {
		$(this).removeClass("focused");
		e.stopPropagation();
	});
	//图片处理－－访问设置 原图保护后缀设置）
	$("body").on("click", ".protection_suffix_menu li", function(e) {
		$(this).toggleClass("selected");
		var suffix_menu = $(this).attr("value");
		if($(this).hasClass("selected")) {
			var suffix_menu_item = $('<span class="protection_suffix_inner_item"><label>' + suffix_menu + '</label><a href="javascript:"><i class="iconfont icon-uniEA3 suffix_item_cole"></i></a></span>');
			$(".next-select-placeholder").remove();
			$(".protection_suffix_inner").append(suffix_menu_item);
			suffix_item.push(suffix_menu);
		} else {
			$(".protection_suffix_inner_item").each(function(index, ele) {
				if($(ele).find("label").text() == suffix_menu) {
					$(".protection_suffix_inner_item").eq(index).remove();
					suffix_item.splice(index, 1);
				}
			});
			if($(".protection_suffix_inner_item").length == 0) {
				$(".protection_suffix_inner").append(noitem);
			}
		}
		e.stopPropagation();
	});
	$(document).click(function() {
		$(".protection_suffix_menu").addClass("hide");
		$(".protection_suffix").removeClass("opened");
		$(".protection_suffix").find(".protection_suffix_arrow").removeClass("bg");
	});
	//访问设置－－确定
	$("body").on("click", "#access_primary", function() {
		$(".delimiter_item").each(function(index, ele) {
			var chbox = $(ele).find("input[type=checkbox]");
			if(chbox.is(":checked")) {
				delim_item.push(chbox.parent().next().text());
			}
		});
		console.log(suffix_item);
		console.log(delim_item);
		hidepanel();
	});
	//图片处理列表刷新
	$("#styleref").on("click", function() {
		$(".processingtable table").addClass("hide");
		$(".processingtable").append(loadbox);
		$("#imgstyleList").html(template("appendtr", []));
		$(".processingtable table").removeClass("hide");
		loadbox.remove();
		styleListinit();
	});
	//删除样式
	var delatebox = $('<div class="gateway-wrapper balloonmedium"><p>确定要删除该样式吗？</p><span class="balloonmedium_btns"><button type="button" id="balloonmedium_primary">确定</button><button type="button" id="balloonmedium_cancel">取消</button></span></div>');
	$("body").on("click", ".imgstyle_del", function(e) {
		var _parent = $(this).parent();
		var delatebox_lf = _parent.offset().left - _parent.width();
		var delatebox_top = _parent.offset().top + _parent.innerHeight();
		$("body").append(delatebox);
		$(".gateway-wrapper").css({
			"left": delatebox_lf + "px",
			"top": delatebox_top + "px",
		});
		setTimeout(function() {
			$(".gateway-wrapper").addClass("bg");
		}, 5);
		_parent.parent().attr("value", "to_be_deleted").siblings().removeAttr("value");
		e.stopPropagation();
	});
	//确定－－删除样式
	$("body").on("click", "#balloonmedium_primary", function(e) {
		$("tr[value=to_be_deleted]").remove();
		if($("#imgstyleList").find("tr").length == 0) {
			$("#imgstyleList").html(template("stylempty", []));
			$("#exportstyle").prop("disabled", true);
		}
		coledecon();
		e.stopPropagation();
	});
	$("body").on("click", "#balloonmedium_cancel", function(e) {
		coledecon();
		e.stopPropagation();
	});
	$(document).click(function() {
		coledecon();
	});

	function coledecon() {
		$(".gateway-wrapper").removeClass("bg");
		setTimeout(function() {
			$(".gateway-wrapper").remove();
		}, 210)
	}

	//编辑样式
	$("body").on("click", ".imgstyle_edit", function() {
		showpanel();
		$(".slide-panel").css("width", "900px");
		$(".panel-body").css("paddingRight", "10px").html(template("imagestyle", []));
		$(".panel-title h4").text("图片样式");
		$(".basicedit").addClass("active");
		$("#edittype").html(template("basicedit", []));
		$(".rule_name").val($(".stylerulename").text()).attr("disabled", true);
		if(adaptive_direction == true) $("#direction").attr("checked", true);
		else $("#direction").attr("checked", false);
		rangsilder(0, 100, $('#imgquality-slider'), $(".imgquality_rangval"), $(".imgquality_up"), $(".imgquality_down"));
		//silder.jRange('setValue', rangval)
	});

	//面板取消
	$("body").on("click", ".imgstylefoot .btn-default", function() {
		hidepanel();
	});

	/*图片展示*/
	$("#picfilt li").click(function() {
		var dataVal = $(this).attr("value");
		$(".picfilter[data-value='" + dataVal + "']").removeClass("hide").siblings(".picfilter").addClass("hide");
	});
	var mydate = new Date();
	var hour = mydate.getHours();
	hour = hour < 10 ? "0" + hour : hour;
	var minutes = mydate.getMinutes();
	minutes = minutes < 10 ? "0" + minutes : minutes;
	$("#cdn-date-range-picker").val(getBeforeDate(7) + " " + hour + ":" + minutes + " - " + getBeforeDate(0) + " " + hour + ":" + minutes);
	//新建图片展示
	$("#builtpic").click(function() {
		showpanel();
		$(".slide-panel").css("width", "500px");
		$(".panel-body").html(template("builtpicshow", []));
		$(".panel-title h4").text("新建图片展示");
	});
	$("body").on("click", "#builtpicok", function() {
		if(!$("#picshowname").val()) {
			$(this).siblings("small").removeClass("hide").text("请输入图片展示名称");
			return;
		} else if(!$("#choosepic_url").val()) {
			$(this).siblings("small").removeClass("hide").text("请选择图片");
			return;
		} else {
			$(this).siblings("small").addClass("hide").text("");
			$(".filepanel").find("small").addClass("hide");
			console.log($(".showtype").find("li.selected").text());
			hidepanel();
			mcttip("新建图片展示成功！");
		}
	});
	//
	var otype;
	$("body").on("click", "#choose_pic", function() {
		$("#myModalLabel").text("图片展示文件管理");
		$(".modal-body").html(template("choosepic", []));
		$(".modal-footer .btn-primary").attr("id", "chosepicok");
		otype = $(".pictype").find("li.selected").attr("value");
		chopic(otype);
	});
	$("body").on("click", ".pictype li", function() {
		$(".loadBox").removeClass("hide").siblings(".picfolder").addClass("hide");
		otype = $(this).attr("value");
		chopic(otype);
		$(".loadBox").addClass("hide").siblings(".picfolder").removeClass("hide");
	});
	//刷新
	$("body").on("click", ".chobrowse", function() {
		$(".loadBox").removeClass("hide").siblings(".picfolder").addClass("hide");
		$.ajax({
			type: "get",
			url: "json/choosepic.js",
			dataType: 'json',
			success: function(data) {
				$("#picfolder_item").html("").html(template("picfolderitem", data));
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("error");
				alert(XMLHttpRequest.responseText);
			},
		});
		$(".loadBox").addClass("hide").siblings(".picfolder").removeClass("hide");
	});
	//进入下级目录
	$("body").on("click", ".foldername", function() {
		var foldername = $(this).text().split("/")[0];
		var namebox = $('<span><i>/</i><strong>' + foldername + '</strong></span>');
		$(".picb1").append(namebox);
		var tr = $('<tr><td width="18"></td><td colspan="4" class="text-muted"><a href="javascript:" class="goback">. . /</a>返回上一级</td></tr>');
		$("#picfolder_item").html("").append(tr);
	});
	//返回上级目录
	$("body").on("click", ".goback", function() {
		$(".picb1").find("span").remove();
		otype = $(".pictype").find("li.selected").attr("value");
		chopic(otype);
	});
	//
	$("body").on("click", "#chosepicok", function() {
		console.log("文件分类" + ":" + otype);
		$("#choosepic_url").val($(".picb1").find("span").text());
		$("#myModal").modal('hide');
		$(this).removeAttr("id");
	});

	function chopic(str) {
		var trs;
		switch(str) {
			case "cultivation":
				var cultivationarray = [{
					"name": "Act-Snapshot/",
					"size": "-",
					"type": "文件夹",
					"creationtime": "-"
				}, {
					"name": "Act-Snapshot/",
					"size": "-",
					"type": "文件夹",
					"creationtime": "-"
				}, {
					"name": "Act-Snapshot/",
					"size": "-",
					"type": "文件夹",
					"creationtime": "-"
				}];
				$.each(cultivationarray, function(index) {
					trs += '<tr><td width="18"></td><td><a href="javascript:" class="foldername">' + cultivationarray[index].name + '</a></td><td class="text-muted">' + cultivationarray[index].size + '</td><td class="text-muted">' + cultivationarray[index].type + '</td><td class="text-muted">' + cultivationarray[index].creationtime + '</td></tr>';
				});
				$("#picfolder_item").html("").append(trs);
				break;
			case "photograph":
				var photographarray = [{
					"name": "Act-sd-m3u8-hd/",
					"size": "-",
					"type": "文件夹",
					"creationtime": "-"
				}, {
					"name": "Act-sd-m3u8-hd/",
					"size": "-",
					"type": "文件夹",
					"creationtime": "-"
				}];
				$.each(photographarray, function(index) {
					trs += '<tr><td width="18"></td><td><a href="javascript:" class="foldername">' + photographarray[index].name + '</a></td><td class="text-muted">' + photographarray[index].size + '</td><td class="text-muted">' + photographarray[index].type + '</td><td class="text-muted">' + photographarray[index].creationtime + '</td></tr>';
				});
				$("#picfolder_item").html("").append(trs);
				break;
		}
	};
	//预览
	$(".picname").click(function() {
		showpanel();
		$(".slide-panel").css("width", "500px");
		$(".panel-body").html(template("preview_show", []));
		$(".panel-title h4").text("预览");
		showcarouse();
	});

	function showcarouse() {
		var index = 0;
		var timer = null;
		var leftimer = null;
		var $key = true;
		var $length = $(".lisbody").find("img").length;
		var $width = parseFloat($(".lisbody").find("img").css("width"));
		$(".lisbody").css("width", $length * $width);
		$("#shownext").on("click", function() {
			clearInterval(leftimer);
			index++;
			if(index > $length - 1) {
				index = 1;
				$("#lisbody").css("left", "0");
			}
			leftimer = setInterval(function() {
				direction($("#lisbody"), 0 - index * $width, $key);
			}, 60);
		});
		$("#showprev").on("click", function() {
			clearInterval(leftimer);
			index--;
			if(index < 0) {
				index = $length - 2;
				$("#lisbody").css("left", 0 - ($length - 1) * $width);
			}
			leftimer = setInterval(function() {
				direction($("#lisbody"), 0 - index * $width, !$key);
			}, 60);
		});

		function showplay() {
			timer = setInterval(function() {
				$("#shownext").trigger("click");
			}, 3000);
		};
		showplay();
		$(".pic_previewitem").on({
			mouseover: function() {
				clearInterval(timer);
			},
			mouseout: function() {
				showplay();
			}
		});

		function direction(obj, num, $key) {
			if($key) {
				var $left = parseFloat(obj.css("left"));
				var speed = Math.ceil(Math.abs(num - $left) / 4);
				$left -= speed;
				if($left <= num) {
					$left = num;
					clearInterval(leftimer);
				}
			} else {
				var $left = parseFloat(obj.css("left"));
				var speed = Math.ceil(Math.abs(num - $left) / 4);
				$left += speed;
				if($left >= num) {
					$left = num;
					clearInterval(leftimer);
				}
			}
			obj.css("left", $left);
		};
		//
	};

	//图片展示管理
	var curentIndex = 0;
	var check = $('<i class="iconfont icon-xuanzhong1"></i>');
	$(".picedit a").eq(0).addClass("active").append(check);
	var srcinit = $(".picedit a").eq(0).find("img").attr("src");
	$(".picitem_cl").attr("href", srcinit).find("img").attr("src", srcinit);
	$(".picedit a").click(function() {
		var $index = $(".picedit a").index(this);
		$(".picedit a").removeClass("active").find("i").remove();
		$(this).addClass("active").append(check);
		var src = $(this).find("img").attr("src");
		$(".picitem_cl").attr("href", src).find("img").attr("src", src);
		var con = UM.getEditor('myEditor').getContent(); //取得点击前图片对应的富文本内容
		console.log(con);
		if($index != curentIndex) {
			//当前的图片和点击前图片的index不一致
			UM.getEditor('myEditor').setContent(""); //假如当前的图片此前没有编辑过，则设置富文本的内容为空，/若编辑过，需要把之前编辑的内容放进富文本（"hello  world"）
		} else {
			//当前的图片和点击前图片的index一致
			UM.getEditor('myEditor').setContent(con);
		}
	});
	//确定
	$("#picshow_btn").click(function() {});

}); //

var isurl = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1,
		strDate = date.getDate(),
		strHour = date.getHours(),
		strMins = date.getMinutes();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if(strHour >= 0 && strHour <= 9) {
		strHour = "0" + strHour;
	}
	if(strMins >= 0 && strMins <= 9) {
		strMins = "0" + strMins;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + strHour + seperator2 + strMins;
	return currentdate;
}
var isnumber02 = /^([1-9]\d*|[0]{1,1})$/; //整数、0
function inputoption(num, obj, min, max) {
	if(num) {
		if(!isnumber02.test(num)) obj.removeClass("hide");
		else {
			if(num < min || num > max) obj.removeClass("hide");
			else obj.addClass("hide");
		}
	} else obj.addClass("hide");
}

function getRandom(n) {
	return Math.floor(Math.random() * n)
}

function rangsilder(min, max, silder, inputobj, upbtn, downbtn) {
	silder.jRange({
		from: min,
		to: max,
		step: 1,
		format: '%s',
		width: 364,
		showLabels: true,
		showScale: false,
	});
	inputobj.val(silder.val());
	silder.on("change", function() {
		inputobj.val($(this).val());
	});
	inputobj.on("keyup", function() {
		var rangval = $(this).val();
		if(!rangval) {
			silder.jRange('setValue', "0");
		} else {
			if(isnumber02.test(rangval)) {
				if(rangval > max) {
					$(this).val(max);
					silder.jRange('setValue', max);
				} else silder.jRange('setValue', rangval);
			} else {
				$(this).val("");
				silder.jRange('setValue', min);
			}
		}
	});
	var svalue;
	upbtn.on("click", function() {
		svalue = parseInt(silder.val());
		svalue += 1;
		if(svalue >= max) {
			svalue = max;
		}
		inputobj.val(svalue);
		svalue = svalue.toString();
		silder.jRange("setValue", svalue);
	})
	downbtn.on("click", function() {
		svalue = parseInt(silder.val());
		svalue -= 1;
		if(svalue <= min) svalue = min;
		inputobj.val(svalue);
		svalue = svalue.toString();
		silder.jRange("setValue", svalue);
	});
};

function mcttip(str) {
	var tipdiv = $('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + str + '</div>');
	$(".growl").append(tipdiv).addClass("on");
	setTimeout(function() {
		$(".growl").empty(tipdiv).removeClass("on");
	}, 2000);
}
(function() {
	//'use strict'
	//----------------数组方法--------------------
	//搜寻
	//	Array.prototype.find = function(value) {
	//		for(var i = 0; i < this.length; i++) {
	//			if(this[i] == value) return this[i];
	//		}
	//		return null;
	//	}
	//	//移除
	//	Array.prototype.remove = function(item) {
	//		for(var i = 0; i < this.length; i++) {
	//			if(this[i] == item) {
	//				this.splice(i, 1);
	//				return;
	//			}
	//		}
	//		return null;
	//	}
	//----------------JQ扩展--------------------	
	$.fn.extend({
		print: function(str) {
			$(this).text(str);
		},
		putInput: function(className,val) {
			var input = $(this).put('input',className);
			input.attr('type', 'number');
			input.val(val);
		},
		putMenu: function(array) {
			var select_box = $(this).putDiv('select_box');
			var select = select_box.putDiv('select');
			var span=select.put('span', 'label','default');
			var ul = select.put('ul', 'option');
			for(var i = 0; i < array.length; i++) {
				var option = ul.put('li', '', array[i]);
			}
		},
		getParent: function(num) {
			var parent;
			while(num--) {
				if(parent) parent = parent.parent();
				else parent = $(this).parent();
			}
			return parent;
		},
		putParam: function(area) {
			for(var i in area) {
				if($.type(area[i]) == 'object') {//二级菜单
					var menul = $(this).putDiv('menul ' + i);//整体容器
					var menu = menul.putDiv('menu ' + i, i);//显示出来的部分
					var fold = menul.putDiv('fold');//隐藏的子菜单容器
					var ss=menu.put('span','ss','›');//旋转符号
					for(var j in area[i]) {
						if($.type(area[i][j]) == 'number') {//输入框
							var menuItem = fold.putDiv('menu item ' + j, j);
							menuItem.putInput('number',area[i][j]);
						}
						else{
							var menuItem = fold.putDiv('menu item ' + j, j);
							menuItem.putMenu(area[i][j]);
						}
					}
				} else {//一级菜单
					var menu = $(this).putDiv('menu ' + i, i);
					if($.type(area[i]) == 'number') {
						menu.putInput('number',area[i]);
					}
					else{
						menu.putMenu(area[i]);
					}
				}

			}
		},
		htmlCode:function(target){
			//获取HTML源码
			var str = target.html();
			//批量转义HTML特殊符号
			var mark = /[&<>]/g, mark_val = {"&":"&amp;","<":"&lt;",">":"&gt;"};
			str = str.replace(mark, function(c){
				return mark_val[c];
			});
			//缩进、处理内联样式
			str=str.trim().replace(/&lt;div class="coor"&gt;&lt;\/div&gt;/g,'')
			.replace(/style="(.*?)"/g, '')
			.replace(/&lt;(?!\/)(.*?)&gt;/g,function(f){
				return "<blockquote>"+f;
			}).replace(/&lt;\/(.*?)&gt;/g,function(b){
				return b+"</blockquote>";
			});
			//标签上色
			str=str.replace(/&lt;(.*?)&gt;/g,function(tag){
				//属性上色
				tag=tag.replace(/\w+(?==)/g,function(attr){
					return "<span class='attr'>"+attr+"</span>";
				});
				//引号上色
				//设置span的class全部使用单引号，再次替换引号内容即可互不干扰
				tag=tag.replace(/("(.*?)")/g,function(sign){
					return "<span class='sign'>"+sign+"</span>";
				});
				return "<span class='tag'>"+tag+"</span>"
			});
			$(this).html(str);	
		},	   
	});

	//----------------系统流程--------------------
	$(document).ready(function() {
		$(document).on("contextmenu", function(e) {
			return false;
		});
		//----------------header-----------------------	
		$('.new').click(function(){
			var bool=ui.showConfrim('是否清空预览界面？',function(){
				 ui.clear();
			});
		});
		$('.share,.explore,.download').click(function(){
			ui.showAlert('功能仍在开发中...');
		});
		//----------------component--------------------	
		$('.main .item').attr({
			'draggable': 'true',
			'ondragstart': 'drag(event)'
		});
		$('.front').attr({
			'ondrop': 'drop(event)',
			'ondragover': 'allowDrop(event)'
		});
		$('.tab_item').click(function() {
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			var id = $(this).index(); //当前操作的元素索引值 
			var number1 = 25 + id * 110;
			var number2 = -id * 350;
			$('.slider').animate({
				marginLeft: number1
			});
			$('.main').animate({
				marginLeft: number2
			});
		})
		//----------------preview--------------------	
		//拖拽
		$(document).mousemove(function(e) {
			if(!!this.move) {
				var posix = !document.move_target ? {
						'x': 0,
						'y': 0
					} : document.move_target.posix,
					callback = document.call_down || function() {
						$(this.move_target).css({
							'top': e.pageY - posix.y,
							'left': e.pageX - posix.x,
						});
						//						console.log($(this.move_target).position());
					};

				callback.call(this, e, posix);
				return false;
			}
		}).mouseup(function(e) {
			if(!!this.move) {
				var callback = document.call_up || function() {};
				callback.call(this, e);
				$.extend(this, {
					'move': false,
					'move_target': null,
					'call_down': false,
					'call_up': false
				});
			}
		});
		$('.front').on('mousedown', '.default', function(e) {
			//右键清除目标
			if(e.which == 3) {
				$(this).fadeOut('slow', function() {
					$(this).remove();
				});
				return false;
			}
			$('.default.active').removeClass('active');
			$(this).addClass('active');
			var $box = $(this);
			var position = $box.position();
			this.posix = {
				'x': e.pageX - position.left,
				'y': e.pageY - position.top
			};
			$.extend(document, {
				'move': true,
				'move_target': this
			});
			$box.on('mousedown', '.coor', function(e) {
				var posix = {
					'w': $box.width(),
					'h': $box.height(),
					'x': e.pageX,
					'y': e.pageY
				};
				$.extend(document, {
					'move': true,
					'call_down': function(e) {
						var width=Math.max(30, e.pageX - posix.x + posix.w);
						var height=Math.max(30, e.pageY - posix.y + posix.h);
						$box.css({
							'width': width,
							'height': height
						});
						//动态显示值
						$('.width').find('input').val(width);
						$('.height').find('input').val(height);
					}
				});
				return false;
			});
			return false;
		})
		//控制台
		function run() {
			var text = $('.command_input').val();
			$('.command_input').val('');
			eval(text);
		}
		$('.command_input').keydown(function(e) {
			if(e.which == 13) run();
		});
		$('.command_btn').click(run);

		//双击翻转查看代码
		$('.front').dblclick(function(e) {
			$('.code').htmlCode($('.front'));
			$('.front').css('transform', 'rotateY(180deg)');
			$('.back').css('transform', 'rotateY(0deg)');
			return false;
		});
		$('.back').dblclick(function(e) {
			$('.front').css('transform', 'rotateY(0deg)');
			$('.back').css('transform', 'rotateY(180deg)');
		});
		//----------------param--------------------	
		var param;
		$('.basic').putParam(style_basic);
		$('.advance').putParam(style_advance);
		//彻底解决冒泡问题
		$('*').on('click', function(e) {
			console.log($(this));
			return false;
		})
		//菜单点击
		$('.menu').on('click', function(e) {
			$(this).find('.ss').toggleClass('rotate');
			$(this).siblings('.fold').slideToggle();
		})
		//手风琴下拉菜单
		$('.label').click(function() {
			var ul=$(this).siblings('ul');
			var Ul=$('.select.active').find('ul').not(ul);
			Ul.slideUp();
			Ul.parent().removeClass('active');
			ul.slideToggle();
			ul.parent().toggleClass('active');
			
		});
		//悬浮选项
		$('li').hover(function() {
			var active = $('.default.active');
			if(!active.length){
				console.log('当前没有活跃元素');
				return;
			}
			var menu = $(this).getParent(4);
			var select_box = $(this).getParent(3);
			var select = $(this).getParent(2);
			
			var type = menu.attr('class').split(' ')[0];
			var name = menu.attr('class').split(' ')[1];
			var value=$(this).text();
			//区分普通菜单和折叠菜单
			if(type=='menu'){
				active.css(name,value);
				var label=select.find('.label');
				label.text(value);
				label.attr('value',value);
				
			}
			else{
				var style='';
				console.log('fold');
				
			}
		});
		$('li').click(function() {
			var ul = $(this).parent();
			ul.slideUp();
			return false;
		})
		$('.number').on('input propertychange',function(){
			var active = $('.default.active');
			if(!active.length){
				console.log('当前没有活跃元素');
				return;
			}
			var menu=$(this).parent();
			var type = menu.attr('class').split(' ')[0];
			var name = menu.attr('class').split(' ')[1];
			var value=$(this).val();
			if($(this).val()=='') value=0;
			if(type=='menu'){
				console.log(name+'  '+value);
				active.css(name,value+'px');
				menu.attr('value',value);
				
			}
			else{
				var style='';
				console.log('fold');
			}
			
		})
	});
}());
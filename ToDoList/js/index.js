;(function(){
	'use strict';
	var $task_enter = $('.task-enter')
	,task_list = []
	,task_list_delete = []
	,index
	,container_class;
	renew();
	//绑定点击和Enter事件，添加任务
	$task_enter.find('button[name=new-submit]').click(function(){
			form_submit();
	});
	$task_enter.find('input[name=text-enter]').keypress(function(e){
		if(e.which == 13){
			form_submit();
		}
	})
	//绑定清空任务列表事件
	$task_enter.find('button[name=delete-all]').click(function(){
		if(confirm("确定要删除所有任务么？")){
			store.clear();
			renew();
		}
	});
	//绑定任务删除功能
	$('.container').on('click','.item-delete',function(event){
		event.stopPropagation();
		if(confirm("确定要删除么？")){
			var $task_item = $(this).parent().parent();
			container_class = $task_item.parent().attr("class");
			index = $task_item.index();
			if(container_class == 'task-items'){
				task_list.splice(index,1);
			}
			else{
				task_list_delete.splice(index,1);
			}
			upload();
			renew();
		}
	});
	////////////////////任务详情页面控制////////////////////
	//打开任务详细说明
	$('.container').on('click','.task-item',function(){
		index = $(this).index();
		container_class = $(this).parent().attr("class");
		if(container_class == 'task-items'){
			$('input[name=detail-name]').val(task_list[index].content);
			$('textarea[name=detail-content]').val(task_list[index].detail);
			$('input[name=detail-date]').val(task_list[index].date);
		}
		else{
			$('input[name=detail-name]').val(task_list_delete[index].content);
			$('textarea[name=detail-content]').val(task_list_delete[index].detail);
			$('input[name=detail-date]').val(task_list_delete[index].date);
		}
		$('.item-detail-mask').show()
							  .animate({opacity:'1'},300);
		$('.item-detail').animate({left:'60%'},300);
	});
	//设置并关闭任务详细说明
	$('body').on('click','button[name=detail-submit]',function(){
		detail_submit();
	});
	$('body').on('click','.item-detail-mask',function(){
		detail_submit();
	});
	
	//上传数据
	function upload(){
		store.set('taskList',task_list);
		store.set('taskListDelete',task_list_delete);                                 
	}
	//下载数据
	function download(){
		task_list = store.get('taskList')||[];
		task_list_delete = store.get('taskListDelete')||[];
	}
	//刷新页面
	function renew(){
		download();
		$('.task-item').remove();
		refresh(task_list);
		refresh(task_list_delete);
	}	
	function refresh(item_list){
		if(item_list == []){
			return;
		}
		for(var i =0;i < item_list.length;i++){
			var item_html = '<div class="task-item"><input type="checkbox" ' 
			+ (item_list[i].item_check?'checked':'') 
			+ ' name="item-choose"/><span class="i-title">' 
			+ item_list[i].content 
			+ '</span><span class="fr"><span class="item-delete">delete</span><span class="item-details">details</span></span></div>';
			if(item_list[i].item_check == false){
				$('.task-items').append(item_html);
			}
			else{
				$('.task-items-delete').append(item_html);
			}
		}
	}
	//提交新任务
	function form_submit(){
		var $input_new = $task_enter.find('input[name=text-enter]');
		var new_task = {
			content : $input_new.val(),
			item_check : false,
			reminded :false
		};
		if(!new_task.content){
			return;
		}
		add_task(new_task);
		$input_new.val("");
	}
	function add_task(new_task){
		task_list.push(new_task);
		upload();
		renew();
	}
	//提交任务详情
	function detail_submit(){
		$('.item-detail-mask').animate({opacity:'0'},300,function(){
			$('.item-detail-mask').hide();
		});
		$('.item-detail').animate({left:'100%'},300);
		if(container_class == 'task-items'){
			task_list[index] = {
			content : $('input[name=detail-name]').val(),
			detail : $('textarea[name=detail-content]').val(),
			date : $('input[name=detail-date]').val(),
			item_check : false,
			reminded :false
			};
		}
		else{
			task_list_delete[index] = {
			content : $('input[name=detail-name]').val(),
			detail : $('textarea[name=detail-content]').val(),
			date : $('input[name=detail-date]').val(),
			item_check : true,
			reminded :false
			};
		}
		upload();
		renew();
	}
	////////////////////点击checkbox完成任务////////////////////
	$('.task-items').on('click','input[type=checkbox]',function(){
		if($(this).parent().parent().attr('class') == 'task-items'){
			index = $(this).parent().index();
			var tmp = task_list.splice(index,1);
			tmp[0].item_check = true; 
			tmp[0].reminded = true;
			task_list_delete.push(tmp[0]);
			upload();
			renew();
		}
	});
	//////////////////点击checkbox撤销完成任务//////////////////
	$('.task-items-delete').on('click','input[type=checkbox]',function(){
		if($(this).parent().parent().attr('class') == 'task-items-delete'){
			index = $(this).parent().index();
			var tmp = task_list_delete.splice(index,1);
			tmp[0].item_check = false; 
			tmp[0].reminded = false;
			task_list.push(tmp[0]);
			upload();
			renew();
		}
	});
	//////////////////////设定定时提醒功能//////////////////////
	$('#datetimepicker').datetimepicker();
	task_time_check();
	$('.reminder .known').on('click',function(){
		$('.reminder').animate({top:'-30px'},300);
	});
	function task_time_check(){
		var current_time,task_time;
		var itl = setInterval(function(){
			for(var i = 0;i < task_list.length;i++){
				var item = task_list[i];
				if(!item || !item.date){
					continue;
				}
				current_time = (new Date()).getTime();
				task_time = (new Date(item.date)).getTime();
				if(current_time - task_time > 0 && item.reminded == false){
					notify(item);
				}
			}
		},500);
	}
	function notify(item){
		item.reminded = true;
		upload();
		renew();
		$('.reminder .reminder-content').html(item.content);
		$('#alert-music')[0].play();
		$('.reminder').animate({top:'0'},300);
	}
	//////////////////////自定义Alert//////////////////////
	function my_alert(arg){
		var conf = {}
		,$body = $('body')
		,$box
		,$mask;
		if(!arg){
			console.error('my_alert title is required.')
		}
		if(typeof arg == 'string'){
			conf.title = arg;
		}
		else{
			$.extend(conf,arg);
		}
		$mask = $('<div></div>')
				.css({
					position: 'fixed'
					,top: 0
					,left: 0
					,right: 0
					,bottom: 0
					,background: 'rgba(0,0,0,0.4)'
					,display: 'flex'
					,justifyContent: 'center'
					,alignItems: 'center'
				});
		$box = $('<div></div>')
				.css({
					width: '500px'
					,height: '200px'
					,background: '#9283ec'
					,transform: 'translateY(-30px)'
					,borderRadius: '5px'
					,boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
				});
		$mask.appendTo($body);
		$box.appendTo($mask);
		
	}




})();
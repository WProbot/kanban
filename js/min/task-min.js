function Task(e){this.record=e,this.build_el()}Task.prototype.board=function(){return boards[this.record.board_id]},Task.prototype.add_to_board=function(){var e=$("#status-{0}-tasks".sprintf(this.record.status_id));this.$el.prependTo(e)},Task.prototype.build_el=function(){this.record.status=this.board().record.status_records()[this.record.status_id]?this.board().record.status_records()[this.record.status_id]:{},this.record.project=this.board().record.project_records[this.record.project_id]?this.board().record.project_records[this.record.project_id]:{},this.record.estimate=this.board().record.estimate_records()[this.record.estimate_id]?this.board().record.estimate_records()[this.record.estimate_id]:{},this.record.user_assigned=this.board().record.allowed_users()[this.record.user_id_assigned]?this.board().record.allowed_users()[this.record.user_id_assigned]:{},this.record.hour_count_formatted=format_hours(this.record.hour_count);var e=templates[this.board().record.id()]["t-task"].render({task:this.record,estimate_records:obj_order_by_prop(this.board().record.estimate_records(),"position"),project_records:this.board().record.project_records,allowed_users:this.board().record.allowed_users(),current_user_can_write:this.board().current_user().has_cap("write")});this.$el=$(e),encode_urls_emails($(".task-title",this.$el)),this.dom(),$(document).trigger("/task/added/",this)},Task.prototype.dom=function(){var self=this;return self.update_progress(),self.board().current_user().has_cap("write")?(self.$el.on("click",".btn-task-delete",function(){var e=$(this);return $(".glyphicon",e).show(),self["delete"](),!1}),self.$el.on("shown.bs.dropdown",".dropdown",function(){var e=$(this);$(".task.active",self.board().$el).not(self.$el).removeClass("active"),self.$el.addClass("active")}).on("hidden.bs.dropdown",function(){self.$el.removeClass("active")}),self.$el.on("show.bs.dropdown",".task-project",function(){var e=$(this),t=$(".dropdown-menu",e).empty(),r=0;for(var o in self.board().record.project_records){var s=self.board().record.project_records[o],a=templates[self.board().record.id()]["t-task-project-dropdown"].render(s);$(a).prependTo(t),r++}return 0==r?!1:void 0}).on("hide.bs.dropdown",".task-project",function(){var e=$(this),t=$("[contenteditable]",e);return t.is(":focus")?!1:void 0}).on("keydown",".task-project [contenteditable]",function(e){var t=$(this),r=t.closest(".dropdown");if(27===e.keyCode){var o=t.data("orig");return t.html(o),t.blur(),clearTimeout(t.data("save_timer")),void(r.hasClass("open")&&r.removeClass("open"))}return 13===e.keyCode?(t.blur(),void(r.hasClass("open")&&r.removeClass("open"))):32===e.keyCode?(t.html(t.html()+"&nbsp;"),placeCaretAtEnd(t.get(0)),!1):void 0}).on("blur",".task-project [contenteditable]",function(){if(window.getSelection().removeAllRanges(),!self.board().current_user().has_cap("write"))return!1;var e=setTimeout(function(){self.parse_project()},100);$(this).data("save_timer",e)}).on("focus",".task-project [contenteditable]",function(){if(!self.board().current_user().has_cap("write"))return!1;var e=$(this);e.data("orig",e.text())}),self.$el.on("click",".btn-project-assign",function(){var e=$(this),t=e.closest(".dropdown"),r=$("[contenteditable]",t);clearTimeout(r.data("save_timer"));var o=e.attr("data-id");self.project_save(o)}),self.$el.on("focus",".task-title",function(e){if(!self.board().current_user().has_cap("write"))return!1;var t=$(this);return $(e.target).is("a")?!1:(t.data("orig",t.html()),void strip_tags(t))}).on("keydown",".task-title",function(e){if(!self.board().current_user().has_cap("write"))return!1;var t=$(this);if(27===e.keyCode){var r=t.data("orig");return t.html(r),void t.blur()}return 13!==e.keyCode||e.shiftKey?void 0:void t.blur()}).on("keyup",".task-title",function(){if(!self.board().current_user().has_cap("write"))return!1;var e=$(this);clearTimeout(e.data("save_timer"));var t=setTimeout(function(){self.save_title()},3e3);e.data("save_timer",t)}).on("blur",".task-title",function(){return window.getSelection().removeAllRanges(),self.board().current_user().has_cap("write")?void self.save_title():!1}),self.$el.on("mouseenter",".btn-task-action",function(){var e=$(this),t=e.closest(".dropdown");if(t.is(".open"))return!1;var r=setTimeout(function(){return t.is(".open")?!1:void e.trigger("click")},500);e.data("timer-open",r)}).on("mouseleave",".btn-task-action",function(){var e=$(this),t=e.closest(".dropdown");if(clearTimeout(e.data("timer-open")),t.is(".open")){var r=setTimeout(function(){t.removeClass("open")},500);t.data("timer-close",r)}}).on("mouseenter",".dropdown-menu",function(){var e=$(this),t=e.closest(".dropdown");clearTimeout(t.data("timer-close"))}),self.$el.on("show.bs.dropdown",".row-task-actions .dropdown",function(e){var t=$(e.relatedTarget),r=t.closest(".dropdown"),o=$(".dropdown-menu",r);o.css("maxWidth",self.$el.outerWidth())}),self.$el.on("click",".btn-task-move",function(){var e=$(this),t=e.attr("data-target"),r=$(t);$(".task-id",r).val(self.record.id),$(".task-title",r).html(self.record.title)}),self.$el.on("click",".btn-task-estimate",function(){var e=$(this),t=e.attr("data-id"),r=self.board().record.estimate_records()[t],o=text.task_estimate_updated.sprintf(self.board().current_user().record().short_name,r.title);if("undefined"!=typeof self.board().record.estimate_records()[self.record.estimate_id]){var s=self.board().record.estimate_records()[self.record.estimate_id];if(t==self.record.estimate_id)return!0;o+=text.task_estimate_updated_previous.sprintf(s.title)}self.record.estimate_id=t,self.save(o),$(".task-estimate",self.$el).html(r.title),self.update_progress()}),self.$el.on("click",".btn-task-assigned",function(){var e=$(this),t=e.attr("data-id");if(t==self.record.user_id_assigned)return!0;var r=self.board().record.allowed_users()[t],o=text.task_assigned_to.sprintf(self.board().current_user().record().short_name,r.short_name);if("undefined"!=typeof self.board().record.allowed_users()[self.record.user_id_assigned]){var s=self.board().record.allowed_users()[self.record.user_id_assigned];if(t==self.record.user_id_assigned)return!0;o+=text.task_assigned_to_previous.sprintf(s.short_name)}self.record.user_id_assigned=t,self.save(o),self.update_assigned_to(t)}),void self.$el.on("click",".btn-task-hour",function(){var $btn=$(this),operator=$btn.attr("data-operator");if("+"!=operator&&"-"!=operator)return!1;var current="undefined"!=typeof self.record.hour_count?parseFloat(self.record.hour_count):0,interval=self.board().record.settings().hour_interval;return current=eval(current+operator+interval),current=Math.round(1e3*current)/1e3,0>current&&(current=0),self.record.hour_count=current,$(".task-hours",self.$el).html(format_hours(self.record.hour_count)),self.update_progress(),self.log_work_hour(operator),!1})):!1},Task.prototype.update_progress=function(){var e=0;if("undefined"!=typeof this.record.estimate_id||"undefined"!=typeof this.record.hour_count){var t=this.board().record.estimate_records()[this.record.estimate_id];if("undefined"!=typeof t){e=100*parseFloat(this.record.hour_count)/parseFloat(t.hours);var r="success";e>133?r="danger":e>100&&(r="warning"),e>100&&(e=100),$(".progress-bar",this.$el).css({width:e+"%"}).removeClass("progress-bar-success progress-bar-warning progress-bar-danger").addClass("progress-bar-"+r)}}},Task.prototype.save=function(e,t){if(!this.board().current_user().has_cap("write"))return!1;var r=this,o={task:this.record,action:"save_task",kanban_nonce:$("#kanban_nonce").val()};"undefined"!=typeof e&&null!==e&&""!==e&&(o.comment=e),"undefined"==typeof t&&(t=!0),o.message=t,$.ajax({method:"POST",url:ajaxurl,data:o}).done(function(e){return e.success?void r.board().update_UI():(growl(text.task_save_error),!1)})},Task.prototype["delete"]=function(e){if(!this.board().current_user().has_cap("write"))return!1;var t=this,r={task:this.record,action:"delete_task",kanban_nonce:$("#kanban_nonce").val(),comment:text.task_deleted.sprintf(t.board().current_user().record().short_name)};$.ajax({method:"POST",url:ajaxurl,data:r}).done(function(e){return e.success?($(document).trigger("/task/deleted/",t),void t.delete_el()):(growl(text.task_delete_error),!1)})},Task.prototype.delete_el=function(){var e=this;e.$el.slideUp("fast",function(){e.$el.remove(),e.board().update_UI(),e.board().update_task_positions(),delete e.board().record.tasks[e.record.id]})},Task.prototype.update_status=function(e){if(!this.board().current_user().has_cap("write"))return!1;var t=this.board().record.status_records()[e];$(".task-handle",this.$el).css({background:t.color_hex})},Task.prototype.update_position=function(e){if(!this.board().current_user().has_cap("write"))return!1;if(e==this.record.position)return!1;e=parseInt(e);var t=this.record.position+"",r=text.task_moved_to_position.sprintf(this.board().current_user().record().short_name,e);""!==t&&(r+=text.task_moved_to_position_previous.sprintf(parseInt(t))),this.record.position=e,this.save(r,!1)},Task.prototype.update_assigned_to=function(e){if(!this.board().current_user().has_cap("write"))return!1;var t=this,r=t.board().record.allowed_users()[e];t.$el.attr("data-user_id-assigned",e);var o=$(".task-assigned-initials",t.$el).removeClass("empty");"undefined"!=typeof r.avatar?o.html(r.avatar):o.text(r.initials),$(".task-assigned-name",t.$el).text(r.short_name)},Task.prototype.save_title=function(){var e=$(".task-title",this.$el);clearTimeout(e.data("save_timer"));var t=this.record.title+"";sanitize(e);var r=e.html().replace(/\\/gi,"&#92;").replace(/&nbsp;/gi," "),o=$("input:focus, textarea:focus, [contenteditable]:focus");if(0==o.length&&encode_urls_emails(e),r===t)return!1;var s=text.task_title_updated.sprintf(this.board().current_user().record().short_name,r);""!==t&&(s+=text.task_title_updated_previous.sprintf(t)),""===r&&(s=null),this.record.title=r,this.save(s)},Task.prototype.project_update_title=function(e){$(".task-project [contenteditable]",this.$el).text(e)},Task.prototype.project_save=function(e){this.$el.attr("data-project-id",e);var t=this.board().record.project_records[e];if("undefined"==typeof t?this.project_update_title(""):this.project_update_title(t.title),e!=this.record.project_id){if("undefined"==typeof t)var r=text.task_removed_from_project.sprintf(this.board().current_user().record().short_name);else var r=text.task_added_to_project.sprintf(this.board().current_user().record().short_name,t.title);var o=this.record.project_id,s=this.board().record.project_records[o];"undefined"!=typeof s&&(r+=text.task_added_to_project_previous.sprintf(s.title)),this.record.project_id=e,this.save(r)}},Task.prototype.parse_project=function(){var e=this,t=$(".task-project [contenteditable]",this.$el);sanitize(t),strip_tags(t,[]);var r=t.html().replace(/\\/gi,"&#92;").replace(/&nbsp;/gi," ");if("undefined"!=typeof r&&""!==r&&null!==r){var o=null;for(var s in this.board().record.project_records){var a=this.board().record.project_records[s];if(r===$.trim(a.title)){o=a.id;break}}if(null!==o)return void this.project_save(o);var i=text.project_added.sprintf(this.board().current_user().record().short_name,r),d={action:"save_project",post_type:"kanban_project",kanban_nonce:$("#kanban_nonce").val(),project:{title:r,board_id:e.board().record.id()},comment:i};$.ajax({method:"POST",url:ajaxurl,data:d}).done(function(t){e.board().record.project_records[t.data.project.id]=t.data.project,e.project_save(t.data.project.id)})}},Task.prototype.log_work_hour=function(e){if(!this.board().current_user().has_cap("write"))return!1;var t={task:this.record,action:"add_task_hour",kanban_nonce:$("#kanban_nonce").val(),operator:e};$.ajax({method:"POST",url:ajaxurl,data:t})};
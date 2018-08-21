define(
	[
		"jquery",
		"backbone",
		"templates/posts/comments",
		"views/components/comment_form",
		"core/ui/animations"
	],
	function($, Backbone, Template, CommentForm, Animations) {
		var PostCommentsView = Backbone.View.extend({
			api: null,
			template: Template,
			commentForm: null,
			events: {
				"click a.vote": "vote",
				"click a.link-reply": "replyComment",
				"click a.link-edit": "editComment",
				"click a.link-remove": "removeComment"
			},
			initialize: function(data) {
				this.listenTo(this.model, "sync change reset", function() {
					this.render(this.model.toJSON());
				});
			},

			render: function(data) {
				this.$el.empty();
				this.appendTemplate(data);
				$(".comments .content .text").each(function(idx, el) {
					// console.log(el.content);
					var element = $(el);
					element.html(element.html().replace(/(@(\w+))/g, "<a href='/users/$2'>$1</a>"));

				});
				this.navigateLocationHash();
			},

			replyComment: function(e) {
				var self = this;
				var comment = this.getCurrentComment(e);
				var content = "";
				if(comment.get("user_id") != self.getAPI().user.get("id")) {
					content = "@" + comment.get("author") + ": ";
				}
				var form = this.showForm(e, {
					content: content
				});
				form.on("comment/submit", function(e) {
					e.parent_id = comment.id;
					e.lvl = comment.lvl + 1;
					self.trigger("comment/reply", e);
				});
			},

			editComment: function(e) {
				var self = this;
				var comment = this.getCurrentComment(e);
				var form = this.showForm(e, {
					content: comment.get("content")
				});
				form.on("comment/submit", function(e) {
					e.id = comment.id;
					self.trigger("comment/edit", e);
				});
			},

			removeComment: function(e) {
				var $commentDiv = $(e.target).closest(".comment");
				this.trigger("comment/delete", $commentDiv.data("id"));
			},

			removeCurrentForm: function() {
				if(this.$currentForm) {
					this.$commentForm.remove();
					delete this.$commentForm;
				}
			},

			showForm: function(e, options) {
				var $commentDiv = $(e.target).closest(".comment");
				var $commentForm  = $commentDiv.find(".comment-form");

				if(!$commentForm.length) {
					$commentForm = $("<div class='row comment-form'></div>");
					$commentDiv.append($commentForm);
				}
				this.removeCurrentForm();
				this.commentForm = $commentForm;
				var id = $commentDiv.data("id");
				var comment = this.model.get(id);
				var form = new CommentForm({
					el: this.commentForm,
					destroyOnCancel: true
				});
				form.render({
					initialText: options.content
				});
				form.focus();
				$(window).scrollTop($commentDiv.offset().top - 100);
				$commentDiv.flash();
				return form;
			},
			getCurrentComment: function(e) {
				var id = $(e.target).closest(".comment").data("id");
				return this.model.get(id);
			}
		});

		return PostCommentsView;
	}
);

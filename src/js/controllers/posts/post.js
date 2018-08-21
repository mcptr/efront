define([
	"underscore",
	"core/controller",
	"models/posts/post",
	"views/posts/post",
	"models/posts/comments",
	"views/posts/comments",
	"views/posts/related",
	"views/components/comment_form",
], function(_, Controller, PostModel, PostView,
			CommentsModel, CommentsView,
			RelatedPostsView, CommentForm) {

	var PostController = Controller.extend({
		initialize: function(id) {
			var self = this;

			this.postModel = new PostModel(id);

			var $mainView = $("#main-content .main-view");

			this.view = new PostView({
				el: $mainView,
				model: this.postModel
			});

			self.view.setLoadingIndicator();

			this.postModel.fetch().then(
				function() {
					self.initializeRelatedPosts();
					self.initializeNewCommentForm();
					self.initializeCommentsView();
				},
				function(response) {
					self.view.renderError(response.status);
				}
			).always(function() {
				self.view.removeLoadingIndicator();
			});
		},

		initializeNewCommentForm: function() {
			var self = this;
			this.commentsModel = new CommentsModel(this.postModel.id);

			this.newCommentForm = new CommentForm({
				el: "#main-content .main-view .post-comments .comment-form",
			});

			this.newCommentForm.on(
				"comment/submit",
				_.bind(this.onCommentCreate, this)
			);

			this.newCommentForm.render();
			this.commentsModel.fetch();
		},

		initializeCommentsView: function() {
			this.commentsView = new CommentsView({
				el: "#main-content .main-view .post-comments .comments",
				model: this.commentsModel
			});

			this.commentsView.on(
				"comment/reply",
				_.bind(this.onCommentReply, this)
			);

			this.commentsView.on(
				"comment/delete",
				_.bind(this.onCommentDelete, this)
			);

			this.commentsView.on(
				"comment/edit",
				_.bind(this.onCommentEdit, this)
			);
		},

		initializeRelatedPosts: function() {
			var view = new RelatedPostsView({
				el: "#main-content .main-view .posts-related",
				model: this.postModel
			});

			view.render(this.postModel.attributes.related);
		},

		onCommentCreate: function(data) {
			var self = this;
			var commentData = _.extend({}, data);
			commentData["user_id"] = self.api.session.get("user_id");
			commentData["post_id"] = self.postModel.id;
			var createOptions = {
				wait: true,
				success: function(model, response, options) {
					self.api.event.trigger("navigateHash", "comment-" + model.id);
					self.newCommentForm.resetWidget();
				},
				error: self.newCommentForm.handleError
			};

			this.commentsModel.create(commentData, createOptions);
		},

		onCommentEdit: function(data) {
			var self = this;
			var comment = this.commentsModel.get(data.id);
			comment.save(
				{
					content: data.content
				},
				{
				wait: true,
				patch: true,
				success: function(model, response, options) {
					self.api.event.trigger("navigateHash", "comment-" + comment.id);
					self.newCommentForm.resetWidget();
				}
			});
		},

		onCommentDelete: function(id) {
			var self = this;
			var data = {
				id: id,
				user_id: self.api.session.get("user_id"),
				post_id: self.postModel.id
			};

			var deleteOptions = {
				wait: true,
				success: function(model, response, options) {
					self.api.event.trigger("navigateHash", "comment-" + model.id);
					self.newCommentForm.resetWidget();
				},
				error: self.newCommentForm.handleError
			};

			self.view.setLoadingIndicator()
			this.commentsModel.get(id).destroy();
			this.commentsModel.fetch().always(function() {
				self.view.removeLoadingIndicator();
			});
		},

		onCommentReply: function(data) {
			var self = this;
			var commentData = _.extend({}, data);
			commentData["user_id"] = this.api.session.get("user_id");
			commentData["post_id"] = this.postModel.id;
			var createOptions = {
				wait: true,
				success: function(model, response, options) {
					self.commentsView.removeCurrentForm();
					self.commentsModel.fetch().then(function() {
						self.api.event.trigger("navigateHash", "comment-" + model.id);
					});
				},
				error: self.commentsView.commentForm.handleError

			};
			console.log(commentData, createOptions);
			var model = this.commentsModel.create(commentData, createOptions);
			console.log("CREATE RESULT", model);
			// return model;
		}

    });

	return PostController;
});

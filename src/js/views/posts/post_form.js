define(
	[
		"backbone",
		"templates/posts/post_form",
		"models/categories/post_categories",
		"models/tags/tags",
		"models/posts/post"
	],
	function(Backbone, Template, CategoriesModel, TagsModel, PostModel) {
		var PostForm = Backbone.View.extend({
			api: null,
			template: Template,
			id: "",
			className: "",
			events: {
				"submit form[name='new-post-form']": "onSubmit",
				"click .image-controls .remove": "onRemoveImageClick",
				"click .image-controls .upload": "onImageClick",
				"click .image": "onImageClick",
				"change input[name='image']": "onImageChange",
				"click #post-form-button-preview": "onPreviewClick",
				"click #post-form-button-publish": "onPublishClick",
			},

			initialize: function(data) {
				var self = this;
				this.categoriesModel = new CategoriesModel();
				this.tagsModel = new TagsModel();
				this.postModel = new PostModel();

			},

			render: function(data) {
				var self = this;
				this.$el.empty();
				this.appendTemplate(data);
				this.$form = this.$el.find("form[name='new-post-form']");
				this.$imageNode = this.$el.find(".image");
				this.$controls =  this.$el.find(".image-controls");
				this.$removeImageButton = this.$controls.find(".remove");

				this.$formImageUploadInput = this.$el.find("input[name='image']");

				$("#post-form-category").selectize({
					valueField: "id",
					labelField: "category",
					searchField: ["ident", "category"],
					sortField: ["ident"],
					maxItems: 1,
					create: false,
					closeAfterSelect: true,
					hideSelected: true,
					preload: true,
					selectOnTab: true,
					loadThrottle: 300,
					load: function(q, cb) {
						self.categoriesModel.fetch({
							data: $.param({pattern: q, limit: 5})
						}).then(function(response) {
							cb(response);
						});
					}
				});

				$("#post-form-tags").selectize({
					valueField: "id",
					labelField: "ident",
					searchField: ["ident"],
					sortField: ["ident"],
					maxItems: 16,
					create: true,
					closeAfterSelect: true,
					hideSelected: true,
					selectOnTab: true,
					addPrecedence: true,
					loadThrottle: 300,
					load: function(q, cb) {
						if(q.length > 2) {
							self.tagsModel.fetch({
								data: $.param({pattern: q})
							}).then(function(response) {
								cb(response);
							});
						}
					}
				});

			},

			onImageClick: function(e) {
				var self = this;
				self.$imageForm = $("<form></form>");
				self.$imageInput = $("<input type='file' name='image'/>");
				self.$imageForm.append(self.$imageInput);
				$("#forms").append(self.$imageForm);

				self.$imageInput.change(function(e) {
					self.$imageNode.toggleClass("ajax-upload");
					var filename = self.$imageInput.val();
					self.$imageForm.ajaxSubmit({
						encode: true,
						contentType: false, //"multipart/form-data",
						type: "post",
						url: "/api/media/",
						timeout: 30000,
						success: function(response) {
							self.$imageNode.empty();
							self.$imageForm.resetForm();
							self.$imageNode.removeClass("empty");
							var $img = $("<img/>");
							$img.prop("src", response[filename].url);
							$img.addClass("img-responsive");
							$img.addClass("center-block");
							self.$imageNode.append($img);
							self.$formImageUploadInput.val(response[filename].id).change();
						},
						error: function(xhr, status) {
							self.$imageNode.addClass("error");
						},
						complete: function() {
							self.$imageNode.children().show();
							self.$imageNode.toggleClass("ajax-upload");
							$("#forms").append(self.$imageForm);
						},
						uploadProgress: function(e, position, total, percent) {
						}
					});
				});
				self.$imageInput.click();
			},

			onImageChange: function(e) {
				var val = $(e.target).val();
				if(val.length) {
					this.$controls.removeClass("hidden");
				}
				else {
					this.$controls.addClass("hidden");
				}
			},

			onRemoveImageClick: function(e) {
				var self = this;
				e.preventDefault();
				this.removeCurrentImage();
			},

			onTitleClick: function(e) {
				console.log(e);
			},

			onSubmit: function(e) {
				e.preventDefault();
			},

			removeCurrentImage: function(options) {
				options = (options || {});
				var self = this;
				var mediaId = parseInt(this.$formImageUploadInput.val());
				if(mediaId) {
					this.$removeImageButton.addClass("disabled");
					self.$imageNode.addClass("ajax-upload");
					$.ajax({
						type: "delete",
						url: "/api/media/" + mediaId,
						data: {
							id: mediaId
						},
						complete: function(e) {
							self.$imageNode.empty();
							self.$formImageUploadInput.val();
							self.$controls.addClass("hidden");
							self.$imageNode.addClass("empty");
							self.$removeImageButton.removeClass("disabled");
							self.$imageNode.removeClass("ajax-upload");
						}
					});
				}
			},

			onPublishClick: function() {
				var self = this;
				console.log("PUBLISH", this.$form.serializeObject());
				self.postModel.save(this.$form.serializeObject()).then(function(e) {
					console.log("CREATED", e);
				});
				
			},
			onPreviewClick: function() {
				console.log("PREVIEW", this.$form.serialize());
			},
		});

		return PostForm;
	}
);

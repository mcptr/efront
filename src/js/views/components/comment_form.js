define(
	[
		"underscore",
		"backbone",
		"templates/components/comment_form",
		"views/error"
	],
	function(_, Backbone, Template, ErrorView) {
		var CommentForm = Backbone.View.extend({
			api: null,
			template: Template,
			events: {
				"keyup textarea[name='comment']": "onTextChange",
				"change textarea[name='comment']": "onWidgetChange",

				//buttons
				"click button[data-id='BOLD']": "handleBoldHelper",
				"click button[data-id='ITALIC']": "handleItalicHelper",
				"click button[data-id='QUOTE']": "handleQuoteHelper",
				"click button[data-id='CODE']": "handleCodeHelper",
				"click button[data-id='LINK']": "handleLinkHelper",
				"click button[data-id='IMAGE']": "handleImageHelper",
				"click button[data-id='IMAGE_UPLOAD']": "handleImageUploadHelper",

				//actions
				"click button[data-id='CANCEL']": "handleCancelAction",
				"click button[data-id='SUBMIT']": "handleSubmitAction"
			},

			initialize: function(options) {
				this.submitHandler = options.submitHandler;
				this.content = options.content;
				this.destroyOnCancel = (options.destroyOnCancel || false);
			},

			render: function(data) {
				data = (data || {});
				this.$el.empty();
				this.appendTemplate(data);
				this.$textWidget = this.$el.find("textarea[name='comment']");

				this.errorView = new ErrorView({
					el: this.$el.find(".error-box")
				});

				this.moveCursor(this.getValue().length);
				return this;
			},

			getValue: function() {
				return this.$textWidget.val();
			},

			onTextChange: _.debounce(function(e) {
				this.onWidgetChange();
			}, 300),

			onWidgetChange: function() {
				this.updateHeight();
				var len = this.$textWidget.val().replace(/^\s*/, "").length;
				var submitButton = this.$el.find("button[data-id='SUBMIT']");
				submitButton.attr("disabled", !len);
			},

			updateHeight: function() {
				var maxHeight = 300;
				var text = this.$textWidget.val();
				var rows = text.split("\n");
				var h = (rows.length * 33);
				this.$textWidget.height(h < maxHeight ? h : maxHeight);
			},

			handleBoldHelper: function(e) {
				this.replaceText(
					(this.getStrippedSelection() || "BOLD_TEXT"),
					"**"
				);
			},

			handleItalicHelper: function(e) {
				this.replaceText(
					(this.getStrippedSelection() || "ITALIC_TEXT"),
					"_"
				);
			},

			handleQuoteHelper: function(e) {
				this.replaceText(
					(this.getStrippedSelection() || "QUOTE"),
					"\n> ", "\n"
				);
			},

			handleCodeHelper: function(e) {
				this.replaceText(
					(this.getStrippedSelection() || "CODE"),
					"`"
				);
			},

			handleLinkHelper: function(e) {
				this.insertURL("TEXT", "[", "]");
			},

			handleImageHelper: function(e) {
				this.insertURL("TEXT", "![", "]");
			},

			handleImageUploadHelper: function(e) {
				console.log("Image upload: NOT IMPLEMENTED");
			},

			handleCancelAction: function() {
				if(!this.uploadInProgress) {
					this.resetWidget();
				}
				if(this.destroyOnCancel) {
					this.$el.empty();
					delete this;
				}
			},

			handleSubmitAction: function() {
				this.uploadInProgress = true;
				this.disableButtons();
				var data = {
					content: this.$textWidget.val(),
					post_id: this.postId
				};
				this.trigger("comment/submit", data);
			},

			replaceText: function(text, prefix, postfix) {
				if(this.isTextWidgetDisabled()) {
					return;
				}
				text = (text || this.getStrippedSelection() || "TEXT");
				prefix = (prefix || "");
				postfix = (postfix || prefix);

				var $tr = this.$textWidget.textrange();
				var previous = $tr.length;
				this.$textWidget.textrange(
					"replace",
					prefix + text + postfix
				);
				var $currentTr = this.$textWidget.textrange();
				if(previous) {
					this.moveCursor($currentTr.position + $currentTr.length);
				}
				else {
					this.$textWidget.textrange(
						"set",
						$currentTr.position + prefix.length,
						text.length
					);
				}
				this.$textWidget.trigger("change");
			},

			insertURL: function(text, prefix, postfix, url) {
				if(this.isTextWidgetDisabled()) {
					return;
				}
				text = (text || "TEXT");
				prefix = (prefix || "[");
				postfix = (postfix || "]");
				var urlText = (
					prefix + text +
					postfix + (url || "(http://example.com)")
				);

				this.$textWidget.textrange("replace", urlText);
				var tr = this.$textWidget.textrange();
				this.$textWidget.textrange(
					"set",
					tr.position + prefix.length,
					text.length
				);
				this.$textWidget.focus();
				this.$textWidget.trigger("change");
			},

			getStrippedSelection: function() {
				var value = this.$textWidget.textrange().text;
				return value
					.replace(/^(\*|\_)*/, "")
					.replace(/(\*|\_)*$/, "");
			},

			moveCursor: function(pos) {
				this.$textWidget.textrange(
					"setcursor", pos
				);
			},

			isTextSelected: function() {
				return this.$textWidget.textrange().text
					.replace(/^\s*/, "")
					.replace(/\s*$/, "")
					.length > 0;
			},

			isTextWidgetDisabled: function() {
				return this.$textWidget.attr("disabled");
			},

			disableButtons: function() {
				this.$textWidget.attr("disabled", true);
				this.$el.find("button").addClass("disabled");
			},

			enableButtons: function() {
				this.$textWidget.attr("disabled", false);
				this.$el.find("button").removeClass("disabled");
			},

			handleError: function(model, response, options) {
				this.setError({
					message: "Could not create comment",
					details: [response.responseJSON.message],
				});

				this.$textWidget.attr("disabled", false);
				this.uploadInProgress = false;
				this.enableButtons();
				this.$textWidget.focus();
			},

			resetWidget: function() {
				this.$textWidget.val("");
				this.$textWidget.attr("disabled", false);
				this.uploadInProgress = false;
				this.enableButtons();
				this.$textWidget.trigger("change");
			},

			setError: function(data) {
				data = _.extend({replace: true}, data);
				this.errorView.render(data);
			},

			focus: function() {
				this.$textWidget.focus();
			},

		});

		return CommentForm;
	}
);

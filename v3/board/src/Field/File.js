var Field = require('../Field')
var Dropzone = require('dropzone')

function Field_File(record) {

	Field.call(this, record);

	this._self.options = $.extend(
		this._self.options,
		{
			allow_multiple: false
		});

	this.render = function (fieldvalue, card) {
		var self = this;

		if ( 'undefined' === typeof fieldvalue ) {
			fieldvalue = {};
		}

		if ( 'undefined' === typeof card ) {
			return false;
		}

		var fieldvalueRecord = 'undefined' === typeof fieldvalue.record ? {} : fieldvalue.record();

		if ( 'undefined' === typeof fieldvalueRecord.content ) {
			fieldvalueRecord.content = [];
		}

		var attachmentsHtml = "";

		if ( fieldvalueRecord.content.length > 0 ) {
			for (var i in fieldvalueRecord.content) {
				var attachment = fieldvalueRecord.content[i];

				attachmentsHtml += kanban.templates['field-file-attachment'].render({
					attachment: attachment,
					field: self.record(),
					card: card.record()
				});
			}
		}

		return kanban.templates['field-file'].render({
			field: self.record(),
			attachmentsHtml: attachmentsHtml,
			card: 'undefined' === typeof card.record ? {} : card.record(),
			isCardWrite: kanban.app.current_user().hasCap('card-write')
		});
	}; // render

	this.addFunctionality = function ($field) {
		var self = this;

		if ( $field.hasClass('func-added') ) {
			return false;
		}

		$field.one(
			'mouseover',
			function () {

				$('.attachment', $field)
				.on(
					'click',
					function () {
						var href = $(this).attr('data-href');

						window.open(href);

						return false;
					}
				);

				var $dropzone = $('.dropzone:first', $field);

				if ($dropzone.length > 0) {

					var myDropzone = new Dropzone(
						$dropzone.get(0),
						{
							createImageThumbnails: true,
							thumbnailWidth: 15,
							thumbnailHeight: 15,
							thumbnailMethod: 'crop',
							parallelUploads: 1,
							paramName: 'kanban-file',
							url: kanban.ajax.url(),
							params: {
								type: 'comment',
								action: 'upload',
								'kanban_nonce': kanban.ajax.nonce(),
								card_id: $field.attr('data-card-id')
							}
						}
					);

					myDropzone.on('success', function (file, response) {

						var attachment = {
							name: file.name,
							href: response.data.url
						};

						var attachmentHtml = kanban.templates['field-file-attachment'].render({
							attachment: attachment
						});

						$(attachmentHtml).appendTo($dropzone);
						$('.attachment-placeholder', $dropzone).remove();

						var content = self.getValue($field);
						self.updateValue($field, content);

						$(file.previewElement).slideUp(function () {
							$(this).remove();
						});
					}); // success

				} // $dropzone
			}
		);

		$field.addClass('func-added');

	}; // addFunctionality

	this.deleteAttachment = function (el) {

		var self = this;

		var $el = $(el);
		var $field = $el.closest('.field');
		$el.closest('.list-group-item').remove();

		var content = self.getValue($field);
		self.updateValue($field, content);

	}; // deleteAttachment

	this.getValue = function ($field) {
		// console.log('getValue');

		var self = this;

		var attachments = [];
		$field.find('.attachment').each(function(){
			var $attachment = $(this);
			attachments.push({
				name: $attachment.attr('value'),
				href: $attachment.attr('data-href')
			});
		});

		return attachments;
	}; // getValue

	this.formatContentForComment = function (content) {
		var self = this;
		var attachments = self.record().content;

		var toReturn = [];
		for(var i in attachments ){
			toReturn.push(attachments[i].name);
		}

		return toReturn.join(', ');
	}; // formatContentForComment

} // Field_File

// inherit Field
Field_File.prototype = Object.create(Field.prototype);

// correct the constructor pointer because it points to Field
Field_File.prototype.constructor = Field_File;

module.exports = Field_File
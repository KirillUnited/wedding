/*Review Photo uploading initializing*/
var uploadImageCount = 0;
function InitUploadReviewImage(limitUploadFilesCount, formId) {

    MAX_SIZE_OF_UPLOADED_IMAGE_IN_BYTES = 15 * (1 << 20),
        MIN_IMAGE_FILESIZE = 55 * (1 << 10);
    $('#addReviewPhoto').fileupload({
        url: '/vendor-reviews/upload',
        dataType: 'json',
        sequentialUploads: true,
        limitMultiFileUploads: limitUploadFilesCount,
        add: function (e, data) {
            var msg = '';
            var file = data.files[0];
            if (uploadImageCount == limitUploadFilesCount)
                msg = "Amount of photographs is " + limitUploadFilesCount + ".";
            if (!file || file.name === '')
                msg = "Empty file name received";
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg')
                msg = "We only accept JPG/JPEG images. We do not accept " + file.type + " files.";
            if (file.size > MAX_SIZE_OF_UPLOADED_IMAGE_IN_BYTES)
                msg = "Uploaded file is too large. We allow files of max " + (MAX_SIZE_OF_UPLOADED_IMAGE_IN_BYTES >> 20) + " Mb in size.";
            if (file.size < MIN_IMAGE_FILESIZE)
                msg = "Uploaded file is too small and would result in a sub-optimal user experience on the site.";
            if (msg != '') {
                $('.message').append(formatAlertMessage(msg, 'warning'));
            } else {
                data.submit();
                uploadImageCount++;
            }
        },
        done: function (event, data) {
            if (data.result.isUploaded) {
                var id = $('input[name^="Files["]').length;
                $('#' + formId).append('<input type="hidden" name="Files[' + id + ']" value="' + data.result.filename + '"/>');
                $('.gallery-item-add').before('<div class="col-md-3 gallery-item" uid="' + id + '">\
            <img src="/'+ data.result.filePath + '" class="img-fluid" alt= "" >\
            <div class="gallery-item-del">\
            <a href="javascript:" onclick="DeletePhoto('+ id + ');">\
            <i class="fa fa-trash"></i>\
             </a>\
            </div>\
            </div>');
            }
        },
        fail: function (event, data) {
            if (data.files[0].error) {
                alert(data.files[0].error);
            }
        }
    });
    var formatAlertMessage = (message, type) => `<div class="alert alert-${type}" role="alert">${message}</div>`;

}

function DeletePhoto(id) {
    var path = $('input[name="Files[' + id + ']"]').val();
    $.ajax({
        url: "/vendor-reviews/DeletePhoto?path=" + path,
        type: "POST",
        dataType: 'json',
        success: function (result) {
            if (result.Deleted) {
                $('.gallery-item[uid="' + id + '"]').remove();
                $('input[name="Files[' + id + ']"]').val('');
                uploadImageCount--;
            }
        }
    });
}


//on page load
$(function () {
    //get array of all packages
    var listArray = $('.list');
    //for each package
    for (var i = 0; i < listArray.length; i++) {
        //get package ul li elements
        var rowArray = $(listArray[i]).children('li');
        //check if more then 8
        if (rowArray.length > 8) {
            //more then 8 elements array
            var addons = [];
            //for all ul li from 8
            for (var s = 8; s < rowArray.length; s++) {
                //detach li
                var item = $(rowArray[s]).detach();
                //insert in array
                addons.push(item);
            }
            //insert bootstrap element after package ul
            $(listArray[i]).after('<div class="collapse" id="collapseList-' + i
                + '"><ul class="list small color-white list-addon-' + i
                + '"></ul></div ><span class="more-list" type="button" data-toggle="collapse" data-target="#collapseList-' + i
                + '" aria-expanded="false" aria-controls="collapseList-' + i + '">Read more</span>');
            //for each li in addons array
            for (d = 0; d < addons.length; d++) {
                //insert element to html
                $('.list-addon-' + i).append(addons[d]);
            }
        }
        //change text functions
        $('#collapseList-' + i).on('show.bs.collapse', function () {
            $(this).siblings('span').text('Read less');
        });
        $('#collapseList-' + i).on('hide.bs.collapse', function () {
            $(this).siblings('span').text('Read more');
        });
    }
});
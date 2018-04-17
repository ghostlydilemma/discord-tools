$('document').ready(function () {
    $('.toolContainer span').on('click', function () {
        let classes = $(this).parent().attr('class').split(" ");
        for (let i = 0; i < classes.length; i++) {

            if (classes[i] == 'toolContainer') {
                classes[i] = '.toolContainerInner';
            } else if (classes[i] == 'open') {

            } else {
                classes[i] = `.${classes[i]}`;
            }
            console.log(classes[i]);
        }
    });
});
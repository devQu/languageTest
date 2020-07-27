'use strict';

$(function() {

    var selMas = [];

    for (var i=0;i<$('select').length;i++) {
        selMas.push($('select').eq(i)[0].children);
    }

    var nlBlock;
    for (var i=0;i<$('.nl-field').length;i++) {
        $('.nl-field').eq(i).html(function() {
            var asd = `<a class="nl-field-toggle">`+ selMas[i][0].innerHTML +`</a>`;
            asd += `<ul>`;
            
            for (var m=0;m<selMas[i].length;m++) {
                if (selMas[i][m].selected == true) {
                    asd += `<li class="nl-dd-checked">`+ selMas[i][m].innerHTML +`</li>`;
                } else {
                    asd += `<li>`+ selMas[i][m].innerHTML +`</li>`;
                }   
            }
            asd += `</ul>`;
            return asd;
        });
    }
    
    /* Set <ul> styles after click  */
    for (var i=0;i<$('.nl-field .nl-field-toggle').length;i++) {
        $('.nl-field .nl-field-toggle').eq(i).on('click', function(e) {
            $(this).closest(".nl-field").children('ul')[0].style.visibility = 'visible';
            $(this).closest(".nl-field").children('ul')[0].style.opacity = 1;
            e.preventDefault();
        });
    }

    /* Hide <ul> block after click outside */
    $(document).click(function (e) {
        if (!$('.nl-field .nl-field-toggle').closest(".nl-field").children('ul').children('li').is(e.target) && e.target.className != 'nl-field-toggle') {
            for (var i=0;i<$('.nl-field .nl-field-toggle').closest(".nl-field").children('ul').length;i++) {
                $('.nl-field .nl-field-toggle').closest(".nl-field").children('ul')[i].style.visibility = 'hidden';
                $('.nl-field .nl-field-toggle').closest(".nl-field").children('ul')[i].style.opacity = 0;
            }
        } else if ($('.nl-field .nl-field-toggle').closest(".nl-field").children('ul').children('li').is(e.target)) {
            
            $(e.target.parentElement).find('.nl-dd-checked').removeClass('nl-dd-checked');
            $(e.target.parentElement).prev()[0].innerHTML = e.target.innerHTML;
            $(e.target.parentElement)[0].style.visibility = 'hidden';
            $(e.target.parentElement)[0].style.opacity = 0;
            e.target.className = 'nl-dd-checked';
            console.log($(e.target).index());
            //console.log($(e.target.parentElement.parentElement).next()[0][$(e.target).index()].selected = true);
            $(e.target.parentElement.parentElement).next()[0][$(e.target).index()].selected = true;

        }
    });
    

});


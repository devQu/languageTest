'use strict';

$(document).ready(function() {

    $('#filterForm').submit(function(e) {

        e.preventDefault();
        registr();

        function registr() {

            let res, i, loading_img;
            let title_cont = $('input[name="title_contains"]').val();
            let category_cont = $('input[name="categories_contains"]').val();
            let difficulty_cont = $('input[name="difficulty_contains"]').val();

            $(document).ajaxStart(function() {
                $('.container__main').html(function(){
                    var loading_img = `<div class="container__main__loader"><img src="/static/assets/images/svg/i_spinner.svg" alt="Loading.."></div>`;
                    return loading_img;
                })
            });

            $.ajax({
                type: 'GET',
                url: 'filt/?title_contains=' + title_cont + '&categories_contains=' + category_cont + '&difficulty_contains=' + difficulty_cont,
                success: function(data) {
                    
                    res = JSON.parse(data);

                    if (res.length == 0) {

                        let none_block;
                        $('.container__main').html(function(){
                            none_block = `<div class="container__main__message">
                                            <div class="block_null">
                                                <img src="/static/assets/images/svg/i_exclamation.svg" alt="">
                                                <span>Не найдено..</span>
                                            </div>
                                        </div>`;
                            return none_block;
                        });

                    } else {

                        $('.container__main').html(function(){

                            let container_main_block = "";
                            let block_item = "";
    
                            for(i=0; i<res.length; i++) {
                                block_item = `
                                    <div class="container__main__block" style="opacity: 0">
                                        <a href="` + "runtest/"+ res[i].fields.slug + `" class="container__main__block__link">
                                            <div class="container__main__block__link__subblock">
                                                <span class="container__main__block__link__subblock__pic">
                                                    <img src="` + "/media/" + res[i].fields.logo_test + `" alt="">
                                                </span>
                                                <div class="container__main__block__link__subblock__text">
                                                    <p>`+ res[i].fields.title + `</p>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path d="M0 0h32v32H0z"></path>
                                                                <rect width="6" height="10" x="5" y="17" fill="currentColor" rx="2"></rect>
                                                                <rect width="6" height="16" x="13" y="11" fill="currentColor" rx="2"></rect>
                                                                <rect width="6" height="22" x="21" y="5" fill="currentColor" rx="2" opacity=".3"></rect>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div class="container__main__block__link__subblock__progress avatar-container p-10">
                                                    <img src="/static/assets/images/cup.png" alt="" class="avatar"/>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                `;
                                container_main_block += block_item;
                            }
                            return container_main_block;
                        });
    
                        $('.container__main__block').animate({
                            opacity: 1
                        }, 1000);
                    }
                }
            });
        }
    });
})
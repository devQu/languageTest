'use strict';
/*
function httpGet(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (this.status == 200) {resolve(this.response)}
            else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function() {
            reject(new Error("NETWORK ARMAGEDDON"));
        };
        xhr.send();
    });
}

httpGet('/runtest/passecompose/')
    .then(
        response => {
            console.log(response)},
        error => console.log(error)
    );
*/

$(document).ready(function() {
    
    /* Run test */
    $('#gotest').bind('click', function() {
        setTimeout(()=> {
            $('#form_questions').submit();
        }, 2000);
    });

    /* Test processing */
    $('#form_questions').submit(function(e) {
        e.preventDefault();

        let countCicle = 0;
        let masFields = [];
        let masInput = [];
        let urlGetString = '';
        let status = $('input[name="status_hidden"]').val();
        let type_form = $('input[name="type_form"]').val();
        //let str0num0 = $('input[name="str0num0"]').val();
        //let str0num1 = $('input[name="str0num1"]').val();
        //let str1num0 = $('input[name="str1num0"]').val();
        //let str1num1 = $('input[name="str1num1"]').val();

        /* Create get url string ---> urlGetString */
        if (status == 'form_insert') {
            
            /* Fill massif of names GET parameters */
            if (type_form == 'insert' || type_form == 'choise') {
                for(let i=0;i<$('.itemText').length;i++) {
                    for(let j=0;j<$('.itemText')[i].children.length;j++) {
    
                        if (type_form == 'insert') {
                            masFields[countCicle] = $('.itemText')[i].children[j].firstElementChild.name;
                        } else if (type_form == 'choise') {
                            masFields[countCicle] = $('.itemText')[i].children[j].lastElementChild.id;
                        }
                        countCicle ++;
                    }
                }
            } else if (type_form == 'order') {
                for (let i=0;i<$('.words-order')[0].children.length;i++) {
                    masFields[$('.words-order')[0].children.item(i).style.order-1] = $('.words-order')[0].children.item(i).innerHTML;
                }
            }
        
            /* Create url GET string */
            for(let i=0;i<masFields.length;i++) {

                if (type_form == 'insert') {
                    masInput[i] = $(`input[name=${masFields[i]}]`).val().trim();
                } else if (type_form == 'choise') {
                    masInput[i] = $(`#${masFields[i]}`).find(":selected").text();
                }
                if (type_form == 'insert' || type_form == 'choise') {
                    if (i == 0) {
                        urlGetString += (`${masFields[i]}=${masInput[i]}`);
                    } else {
                        urlGetString += (`&${masFields[i]}=${masInput[i]}`);
                    }
                } else if (type_form == 'order') {
                    if (i == 0) {
                        urlGetString += (`num0=${masFields[i]}`);
                    } else {
                        urlGetString += (`&num${i}=${masFields[i]}`);
                    }
                }
            }

        } else {
            urlGetString = ``;
        }
        /* *************************************** */

        //var urlcurr = window.location.href;
	    var test;

        $(document).ajaxStart(function() {
            if ($('.container__startblock')[0] != undefined) {
                $('.container__startblock').remove();
            }
            $('.container__content')[0].style.display = null;
            $('.container__progress-bar')[0].style.display = null;
            
            $('#form_questions').html(function(){
                let loading_img = `<div class="container__main__loader"><img src="/static/assets/images/svg/i_spinner.svg" alt="Loading.."></div>`;
                return loading_img;
            });
        });

        $.ajax({
            type: 'GET',
            //url: 'go/?str0num0=' + str0num0 + '&str0num1=' + str0num1 + '&str1num0=' + str1num0 + '&str1num1=' + str1num1 + '&status=' + status,
            url: `go/?${urlGetString}&status=${status}&type_form=${type_form}`,
            success: function(data) {
                test = JSON.parse(data);
                if (document.readyState == 'complete') {
                    if (test.statusFinal == false) {
                        progressBarParse(test);
                        if (test.stat == 'set_result') resultParse(test);
                        else if (test.stat == 'set_form') formParse(test);
                        else if (test.stat == 'set_theory') theoryParse(test, test.position-1, "Далее"); /* 2nd argument is a pos */
                        else formParse(test);
                    } 
                    else finalResultParse(test);
                }
            }
        });
    });
});

/* Generate <ul><li> <-- <select><option> */
function choise_handler() {

    let selMas = [];

    for (let i=0;i<$('select').length;i++) {
        selMas.push($('select').eq(i)[0].children);
    }

    //var nlBlock;
    for (let i=0;i<$('.nl-field').length;i++) {
        $('.nl-field').eq(i).html(function() {
            let asd = `<a class="nl-field-toggle">${selMas[i][0].innerHTML}</a>`;
            asd += `<ul>`;
            
            for (let m=0;m<selMas[i].length;m++) {
                if (selMas[i][m].selected == true) {
                    asd += `<li class="nl-dd-checked">${selMas[i][m].innerHTML}</li>`;
                } else {
                    asd += `<li>${selMas[i][m].innerHTML}</li>`;
                }   
            }
            asd += `</ul>`;
            return asd;
        });
    }
    
    /* Set <ul> styles after click  */
    for (let i=0;i<$('.nl-field .nl-field-toggle').length;i++) {
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
            $(e.target.parentElement.parentElement).next()[0][$(e.target).index()].selected = true;

        }
    });
}

/* Change width of insert input */
function insert_handler() {

    const inpA = document.querySelectorAll('.input-word');
    const inpB = document.querySelectorAll('.input-hidden');
    let currStyle = getComputedStyle(inpA[0], null).getPropertyValue('font-size');
    let number = inpA.length;
    let inputItem = [];
    let divItem = [];

    for (let i = 0; i < number; i++) {
        inputItem[i] = "a" + i;
        inpA[i].id = inputItem[i];
        divItem[i] = "b" + i;
        inpB[i].id = divItem[i];
        inpB[i].textContent = inpA[i].placeholder;
        inpB[i].style.fontSize = currStyle;
        inpA[i].style.width = inpB[i].offsetWidth + 'px';
        inpA[i].style.minWidth = inpB[i].offsetWidth + 'px';
    }

    for (let i = 0; i < number; i++) {
        let idInp = document.querySelector('#a' + i);
        let idDiv = document.querySelector('#b' + i);
        const WIINP = idInp.style.width;
        idInp.addEventListener("input", function(e) {
            
            idDiv.innerHTML = e.target.value;
            let wiDiv = getComputedStyle(idDiv, null).getPropertyValue('width');
            if (Number(wiDiv.replace('px','')) > Number(WIINP.replace('px',''))) {
                e.target.style.width = wiDiv;
            }
            
        });
    }
}

/* Script for make an order of words */
function order_handler(testLen) {

    const words = document.querySelector('.words-desorder'); // first class
    const words_speech = document.querySelector('.words-order'); // last class
    const item_words = document.querySelectorAll('.word-item'); // all items
    let phrase = [];
    
    for (let i = 0;i < item_words.length; i++) {
        item_words[i].id = 'id' + i;
        let it = document.createElement( 'div' );
        it.className = 'word-item';
        it.id = item_words[i].id;
        it.style.display = 'none';
        it.innerHTML = item_words[i].textContent;
        words_speech.append(it); // fill last class of div's copy transparent
    }

    for (let i = 0;i < item_words.length; i++) {
        let itemNow = document.querySelectorAll('#id' + i)[0];
        let itemNowSpeech = document.querySelectorAll('#id' + i)[1];
        itemNow.addEventListener('click', function(el) {
            
            el.target.style.display = 'none';
            words_speech.querySelector('#'+ el.target.id).style.display = 'inline-block';
            words_speech.querySelector('#'+ el.target.id).classList.add("visible");
            words_speech.querySelector('#'+ el.target.id).style.order = document.querySelectorAll(".visible").length;
            phrase.push(words_speech.querySelector('#'+ el.target.id).textContent);

            if (phrase.length == testLen) {
                $('.container__content__block__button')[0].style.display = "block";
                $('.container__content__block__button').animate({ opacity: 1 }, 1000);
            } else {
                $('.container__content__block__button')[0].style.display = "none";
                $('.container__content__block__button')[0].style.opacity = 0;
            } 
        });
        itemNowSpeech.addEventListener('click', function(el) {
            
            el.target.style.display = 'none';
            words_speech.querySelector('#'+ el.target.id).classList.remove("visible");
            words_speech.querySelector('#'+ el.target.id).style.order = 0;
            words.querySelector('#'+ el.target.id).style.display = 'inline-block';
            phrase.splice(-1, 1);

            if (phrase.length == testLen) {
                $('.container__content__block__button')[0].style.display = "block";
                $('.container__content__block__button').animate({ opacity: 1 }, 1000);
            } else {
                $('.container__content__block__button')[0].style.display = "none";
                $('.container__content__block__button')[0].style.opacity = 0;
            }

        });
    }
}

/* Create progress bar elements */
function progressBarParse(test) {

    $('.container__progress-bar').html(function() {

        let classItem, classTheory;
        let text_block = `<section class="progress-line" ><ol class="progress-bar-ol">`;
        for (let i=0;i<test.quantity;i++) {
            classItem = ``, classTheory = ``;
            if (test.list_type[i] == "theory") {
                classTheory = 'theory';
            }
            if (i<test.accomplish_list.length) {
                if (test.accomplish_list[i] == true) {
                    classItem = 'complete';
                } else {
                    classItem = 'wasted';
                }
                text_block += `<li class="${classItem} ${classTheory}"><span>Шаг ${i+1}</span></li>`;
            } else if (test.accomplish_list.length == test.quantity-1) {
                text_block += `<li class="active ${classTheory}"><span>Финиш!</span></li>`;
            } else if (i == test.accomplish_list.length) {
                text_block += `<li class="active ${classTheory}"><span>Шаг ${i+1}</span></li>`;
            } else if (i > test.accomplish_list.length) {
                text_block += `<li class="${classTheory}"><span>Шаг ${i+1}</span></li>`;
            }
        }
        text_block +=`</ol></section>`;
        text_block +=  `<section class="progress-point">
                            <a href="#" class="back-arrow"></a>
                            <div class="progress-point__item">Шаг ${test.position}</div>
                            <!--<a href="#" class="next-arrow"></a> -->
                            <div class="progress-point__aide">
                                <a href="#">Теория</a>
                            </div>
                        </section><div class="progress-percent"></div>`;
        return text_block;
    });
    $('.container__content__theory').html(function() {
        let text_block = ``;
        for (let i=0;i<test.theory_list.length;i++) {
            text_block += `<div class="theory-item" id="${test.theory_list[i][0]}">#${i+1}: ${test.theory_list[i][1]}</div>`;
        }
        return text_block;
    });
    $('.progress-percent')[0].style.width = Math.floor(test.accomplish_list.length/test.quantity*100) + '%';

    $('.container__content__theory')[0].addEventListener('click', function(e) {
        if (e.target.closest('div').className != 'theory-item') return; /* If click between elements */
        theoryParse(test, e.target.id, "Вернуться к заданию"); /* Parse theory html */
    });
}

/* Parse theory html block */
function theoryParse(test, pos, buttonStat) {

    $('.container__content')[0].style.height = "auto";
    $('#form_questions').html(function() {

        function replaceSlash(str, mas) {
            let appendItem = ``;
            mas.forEach((item, index) => { appendItem = str.replace(/\^/, `<span class="disting">${item}</span>`); str = appendItem; });
            return `<span class="sp-block">${appendItem}</span>`;
        }

        let insert_block = ``;

        $.each(test.theory_dict[pos], function(key, element) {

            let fkey = Object.keys(element)[0];
            let fval = Object.values(element)[0];
            // Check type od item block
            if (fkey == "_header") {
                insert_block += `<h1 class="theory_header">${fval}</h1>`;
            } else if (fkey == "_image") {
                insert_block += `<div class="theory_img"><img src="/media/${fval}"></div>`;
            } else if (fkey == "_subheader") {
                insert_block += `<h2 class="theory_headerTwo">${fval}</h2>`;
            } else if (fkey == "_attention") {
                insert_block += `<div class="theory_attention">`;
                $.each(fval, function(key, e) {
                    insert_block += replaceSlash(e._attention_domain, e._attention_append);
                });
                insert_block += `</div>`;
            } else if (fkey == "_text") {
                if (fval._text_domain.includes("^")) {
                    insert_block += `<div class="theory_text">${replaceSlash(fval._text_domain, fval._text_append)}</div>`;
                } else insert_block += `<div class="theory_text"><span class="sp-block">${fval._text_domain}</span></div>`;
            } else if (fkey == "_example") {
                insert_block += `<div class="theory_example">`;
                $.each(fval, function(key, e) {
                    insert_block += replaceSlash(e._example_domain, e._example_append);
                });
                insert_block += `</div>`;
            }
        });
        insert_block += `<input type="hidden" value="theory_done" name="status_hidden">`;
        insert_block += `<div class="container__content__block__button button-center">
                            <div class="circles">
                                <button id="go" class="particles-button" type="submit">${buttonStat} ></button>
                            </div>
                        </div>`;
        return insert_block;
    });
}

/* Parse result html block */
function resultParse(test){

    $('.container__content')[0].style.height = "70vh";
    $('#form_questions').html(function() {

        let insert_block;
        
        if (test.count_errors == 0) {
            insert_block = `<div class="result-success">Отлично!</div>`;
        } else {
            insert_block = `<div class="result-num-err">Ошибок
                                <span class="num">${test.count_errors}</span>
                            </div>`;
        }
    
        if (test.type_question == 'insert' || test.type_question == 'choise') {
            for(let i=0;i<test.texts.length;i++) {
                insert_block += `<div class="itemText">`; // Start block
                for(let j=0;j<test.texts[i].length;j++) {
                    insert_block += test.texts[i][j];
                    if (j != test.texts[i].length - 1){
                        if (test.answers_user[i][j] != test.answers[i][j]) {
                            insert_block += `<div class="result-false">
                                                ${test.answers_user[i][j]}
                                            </div>&nbsp;`;
                        }
                        insert_block += `<div class="result-true">
                                            ${test.answers[i][j]}
                                        </div>`;
                    }
                }
                insert_block += `</div>`; // End block
            }
        } else if (test.type_question == 'order') {
            insert_block += `<div class="itemText">`; // Start block
            for (let i=0;i<test.order_list.length;i++) {
                if (test.order_list[i] == test.order_user[i]) {
                    insert_block += `<div class="result-true">
                                        ${test.order_list[i]}
                                    </div>&nbsp;`;
                } else {
                    insert_block += `<div class="result-false-order">
                                        ${test.order_list[i]}
                                    </div>&nbsp;`;
                }
            }
            insert_block += `</div>`; // End block
        }
        
        insert_block += `<input type="hidden" value="result_insert" name="status_hidden">`;
        insert_block += `<input id="type_form" type="hidden" value="${test.type_question}" name="type_form">`;
        insert_block += `<div class="container__content__block__button margin">
                            <div class="circles">
                                <button id="go" class="particles-button" type="submit">Далее ></button>
                            </div>
                        </div>`;

        return insert_block;
    });

    /* Remove undefined element */
    if ($('#form_questions').contents().get(0).textContent == "undefined") {
        $('#form_questions').contents().get(0).remove();
    }

    /* Add class for determine style of .itemText */
    if (test.style_type == "D") {
        for (let i=0;i<$('.itemText').length;i++) {
            $('.itemText')[i].classList.add('dialog');
        }
    } else if (test.style_type == "C") {
        for (let i=0;i<$('.itemText').length;i++) {
            $('.itemText')[i].classList.add('center');
        }
    } else if (test.style_type == "T") {
        for (let i=0;i<$('.itemText').length;i++) {
            $('.itemText')[i].classList.add('text');
        }
    }

    $('.margin')[0].style.marginTop = "auto";
}

/* Parse form insert/choise/order html blocks */
function formParse(test){
    
    if (test.type_question == "choise") {
        $('#form_questions')[0].classList.add('nl-form');
    }
    $('#form_questions').html(function(){
        let rand;
        let text_block = ``;
        /* Question block */
        text_block += `<div class="question" id="question">
                            ${test.question}
                        </div>`;
        /* Example block */
        text_block += `<div class="example">`;
        for (let i=0;i<test.examples.length;i++) {
            text_block += `<span class="sign"></span><p id="example">${test.examples[i]}</p>`;
        }
        text_block += `</div>`;
        /* Generate form html content for insert */
        if (test.type_question == "insert") {
            for(let i=0;i<test.texts.length;i++) {
                text_block += `<div class="itemText">`;
                for(let j=0;j<test.texts[i].length;j++) {
                    text_block += test.texts[i][j];
                    if (j != test.texts[i].length-1){
                        
                        text_block += `<div class="input-box">
                                            <input type="text" name="str${i}num${j}" required="" spellcheck="false" autocomplete="off" placeholder="${test.insert_list[i][j]}" maxlength="15" class="input-word">
                                            <div class="input-hidden"></div>
                                        </div>`;
                    }
                }
                text_block += `</div>`;
            }
        /* Generate form html content for choise */
        } else if (test.type_question == "choise") {
            for(let i=0;i<test.texts.length;i++) {
                text_block += `<div class="itemText">`;
                for(let j=0;j<test.texts[i].length;j++) {
                    text_block += test.texts[i][j];
                    if (j != test.texts[i].length-1){
                        
                        text_block += `<div class="input-box"><div class="nl-field nl-dd"></div><select style="display:none" id="str${i}num${j}">`;
                        rand = Math.floor(Math.random() * ((test.choise_list[i][j].length+1)-1))+2;
                        let among = true;
                        
                        for(let n=0;n<test.choise_list[i][j].length;n++) {
                            if (n+1 == rand) {
                                among = false;
                                text_block += `<option value="${rand}">${test.answers[i][j]}</option>`;    
                            } 
                            if (among == true) {
                                text_block += `<option value="${n+1}">${test.choise_list[i][j][n]}</option>`;
                            } else {
                                text_block += `<option value="${n+2}">${test.choise_list[i][j][n]}</option>`;
                            }
                        }
                        if (among == true) {
                            text_block += `<option value="${rand}">${test.answers[i][j]}</option>`;
                        }
                        text_block +=`</select></div>`;
                        
                    }
                }
                text_block += `</div>`;
            }
        /* Generate form html content for order */
        } else if (test.type_question == "order") {
            text_block += `<div class="words-desorder">`;
            for (let i=0;i<test.order_random_list.length;i++) {
                text_block += `<div class="word-item">${test.order_random_list[i]}</div>`;
            }
            text_block += `</div>`;
            text_block += `<div class="words-order"></div>`;
        }
        
        text_block += `<input type="hidden" value="form_insert" name="status_hidden">`;
        text_block += `<input id="type_form" type="hidden" value="${test.type_question}" name="type_form">`;
        text_block += `<div class="container__content__block__button button-center">
                            <div class="circles">
                                <button id="go" class="particles-button" type="submit">Готово</button>
                            </div>
                        </div>`;
        return text_block;
    });

    if (test.type_question == 'order') {
        $('.container__content__block__button')[0].style.display = "none";
        $('.container__content__block__button')[0].style.opacity = 0;
    }

    if (test.style_type == "D") {
        for (let i=0;i<$('.itemText').length;i++) {
            $('.itemText')[i].classList.add('dialog');
        }
    } else if (test.style_type == "C") {
        for (let i=0;i<$('.itemText').length;i++) {
            $('.itemText')[i].classList.add('center');
        }
    } else if (test.style_type == "T") {
        for (let i=0;i<$('.itemText').length;i++) {
            $('.itemText')[i].classList.add('text');
        }
    }

    if (test.type_question == "insert") insert_handler();
    else if (test.type_question == "order") order_handler(test.order_random_list.length); 
    else if (test.type_question == "choise") choise_handler();
    
}

/* Parse final test html container */
function finalResultParse(test) {

    $('#form_questions').html(function(){
        let text_block;

        text_block = `<div class="container__startblock__content">`;
        text_block += `<span class="container__startblock__content__result">
                            ${test.resultString}
                        </span>`;
        text_block += `<span class="container__startblock__content__notification">
                            Ваш результат: ${test.countSuccess} из ${test.quantity} 
                        </span>`;
        text_block += `<input type="hidden" value="restart" name="status_hidden">`;
        text_block += `<div class="container__content__block__button ">
                            <div class="circles">
                                <button id="go" class="particles-button" type="">Пройти заново</button>
                            </div>
                        </div>`;
        text_block += `</div>`;
        return text_block;
    });

    $('.container__startblock__content')[0].style.height = '60vh';
    $('.container__startblock__content')[0].style.justifyContent = 'center';
}
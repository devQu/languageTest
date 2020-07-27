//import Particles from './particles.js';
'use strict';

/* Script cool button for input form !!! with libraries anime.min.js, particles.js */

$(function() {
    const arrOpts = [
        {},
        {
            direction: 'bottom',
            duration: 400,
            easing: 'easeInExpo',
        }
    ];
    const bttn = document.querySelector('button.particles-button');
    let particlesOpts = arrOpts[1];
    let buttonVisible = true;
    const particles = new Particles(bttn, particlesOpts);
    bttn.addEventListener('click', () => {
        if ( !particles.isAnimating() && buttonVisible ) {
            particles.disintegrate();
            buttonVisible = !buttonVisible;
        }
    });
});

/* Clear search field */

(function() {
    document.getElementById('search_contains').value = "";
})();

/* Terrible script for input drop-down list button */

(function() {

    const select = document.querySelector('.container__top__select__main');
    const selectCloseConst = document.querySelector('.select_close');
    //const selectOpenConst = document.querySelector('.select_open');
    const selectArea = document.querySelector('.container__top__select__area');
    let selectBoolean = false;

    document.addEventListener('click', function(event) {

        const selectAreas = document.querySelectorAll('.container__top__select__area__item');

        if (event.target.id == 'select_main' || event.target.id == 'select_main_svg') {

            if(!selectBoolean) {
                select.classList.add('open');
                selectCloseConst.classList.toggle('select_open');
                selectCloseConst.classList.toggle('select_close');
                selectArea.style.opacity = 1;
                selectArea.style.transform = "scaleY(1) translateZ(0)";
                selectBoolean = true;

                for(let i = 0; i < selectAreas.length; i++) {
                    
                    selectAreas[i].addEventListener('click', function() {

                        for(let i = 0; i< selectAreas.length; i++) {
                            selectAreas[i].classList.remove('open-area');    
                        }
                        selectAreas[i].classList.add('open-area');

                        if (i == 0) {
                            $("#select_main").val("Грамматические тесты");
                        } else if (i == 1) {
                            $("#select_main").val("Тематические курсы");
                        } else if (i == 2) {
                            $("#select_main").val("Словари");
                        }

                        select.classList.remove('open');
                        selectCloseConst.classList.toggle('select_open');
                        selectCloseConst.classList.toggle('select_close');
                        selectArea.style.opacity = 0;
                        selectArea.style.transform = "scaleY(0) translateZ(0)";
                        selectBoolean = false;
                    });
                }
            } else {
                select.classList.remove('open');
                selectCloseConst.classList.toggle('select_open');
                selectCloseConst.classList.toggle('select_close');
                selectArea.style.opacity = 0;
                selectArea.style.transform = "scaleY(0) translateZ(0)";
                selectBoolean = false;
            };

        } else if (event.target.id == '' && select.classList.contains('open')) {
            select.classList.remove('open');
            selectCloseConst.classList.toggle('select_open');
            selectCloseConst.classList.toggle('select_close');
            selectArea.style.opacity = 0;
            selectArea.style.transform = "scaleY(0) translateZ(0)";
            selectBoolean = false;
        };
    });
})();

/* Script for menu-hamburger button */

(function() {
    const hamburger = document.querySelector('.menu__burger');
    const menuBtn = document.querySelector('.menu');
    const nav = document.querySelector('.nav');
    const menuNav = document.querySelector('.ul-nav');
    const navItems = document.querySelectorAll('.ul-nav__item');

    menuBtn.addEventListener('click', function() {
        hamburger.classList.toggle('open');
        nav.classList.toggle('open');
        menuNav.classList.toggle('open');
        navItems.forEach(item => item.classList.toggle('open'));
    });
})();

/* Script for filter of levels */

(function() {
    let input_dif = document.querySelector('#select_diff');
    input_dif.value = "all";
    let filterItem = document.querySelectorAll('.container__top__filter__option');
    
    for (let i = 0; i < filterItem.length; i++) {
        filterItem[i].addEventListener("click", function() {
            for (let i = 0; i < filterItem.length; i++) {
                filterItem[i].classList.remove("open");
                filterItem[i].style.borderLeftColor = "#dfdfdf";
            }
            this.classList.add("open");
            if (i == 0) {
                input_dif.value = "all";
            } else if (i == 1) {
                input_dif.value = "1";
            } else if (i == 2) {
                input_dif.value = "2";
            } else if (i == 3) {
                input_dif.value = "3";
            }
            if (i <= 2) {
                filterItem[i+1].style.borderLeftColor = "#4f96ff";
                this.style.borderLeftColor = "#4f96ff";
            } else {
                this.style.borderLeftColor = "#4f96ff";
            }
        });
    }
})();

/* Script add word in user's dictionary button

(function() {
    const dict = document.querySelector('.add');
    const sign = document.querySelector('.add__sign');
    const button = document.querySelector('.add__button');
    let j = false;
    dict.addEventListener('click', function() {
        if (j == false) {
            sign.innerHTML = "-";
            button.innerHTML = "Удалить из словаря";
            j = true;
        } else {
            sign.innerHTML = "+";
            button.innerHTML = "Добавить в словарь";
            j = false;
        }
    });
})();
*/
/* Script to play a short sound 

(function() {
    const wrap_sound = document.querySelector('#iSound');
    const ilink = document.querySelector(".sound-link");
    ilink.addEventListener('click', function() {
        wrap_sound.volume = 0.7;
        wrap_sound.play();
    });
})();
*/



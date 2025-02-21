$(document).ready(function(){


    $('.elem__question').on('click', function(e){
        if ($(this).find("input[type='checkbox']")) {
            if ($(this).find("input:checked").length) {
                $(this).find('input').prop('checked' ,false);
                $(this).removeClass("current");
            } else {
                $(this).addClass('current');
                $(this).find('input').prop('checked' ,true);
            }
            if ($(this).closest(".questions__checks").find("input[type='checkbox']:checked").length != 0) {
                $(this).closest('.elem__quiz').find('.submit__quiz>button').removeClass("disabled").attr("tabindex" , "0")
            } else {
                $(this).closest('.elem__quiz').find('.submit__quiz>button').addClass("disabled").attr("tabindex" , "-1");
            }
        }
        if ($(this).find("input[type='radio']").length) {
            if (!$(this).hasClass('current')) {
                $(this).closest(".questions__radio").find(".current").removeClass('current');
                $(this).find('input').prop('checked' ,true);
                $(this).addClass('current');
                $(this).closest('.elem__quiz').find('.submit__quiz>button').removeClass("disabled").attr("tabindex" , "0")
            }
            
        }
    });


    if ($("#doughnut-result").length) {

        //draw the doughnut
        var doughnutArray = [ document.getElementById('doughnut-result').getContext('2d')];
        for (var i = 0; i < doughnutArray.length; i++) {
          doughnutArray[i].lineWidth = 1; //thickness of the line
          doughnutArray[i].fillStyle = '#eaeaea';
          doughnutArray[i].strokeStyle = "#eaeaea";
          doughnutArray[i].beginPath();
          doughnutArray[i].arc(260, 260, 225, 2.7, 9.3, false);
          doughnutArray[i].stroke();
        }
        // window.onload = function() {
        //     loadResult();
        //   }

        /* function*/
        


    }
    function whiteOverlay(threshold) {
        let ctx = document.getElementById('white-overlay').getContext('2d');
        let al = 0;
        let start = 2.60;
        let temp = (((threshold / 100) * Math.PI * 2 * 10).toFixed(2))/2;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = "white";
        ctx.lineWidth = 9
        ctx.beginPath();
        ctx.arc(260, 260, 231, start, temp / 7.5 + start, false); //.arc(x, y , radius, startAngle, endAngle, anticlockwise)
        ctx.stroke();
        $('#greybuffer').show();
        $('#whitecircle').show();
    }
    function loadResult(value) {
          var ctx = document.getElementById('result-display').getContext('2d');
          //var ctx_passing = document.getElementById('passing').getContext('2d');
            var al = 0;
            var start = 2.60;
            var cw = ctx.canvas.width;
            var ch = ctx.canvas.height;
            var diff;
            var perstange = value;
            var threshold  = $("#threshold").text()
            whiteOverlay(threshold);
            if(threshold>= 50) {
                var temp = (((threshold / 100) * Math.PI * 2 * 10).toFixed(2))/2
                let char_x = 310 + 225 * (Math.cos(start + temp/ 7.5)) + 16;
                let char_y = 260 + 225 * (Math.sin(start + temp/7.5)) - 29;
                $("#passing").css({top: char_y, left: char_x, position:'absolute', display: "block"});
                $("body").get(0).style.setProperty("--beforeStatus", "display");
                $("body").get(0).style.setProperty("--afterStatus", "none");
            }
            if(threshold < 50) {
                var temp = (((threshold / 100) * Math.PI * 2 * 10).toFixed(2))/2
                let char_x = 310 + 225 * (Math.cos(start + temp/ 7.5)) + 16 - 202;
                let char_y = 260 + 225 * (Math.sin(start + temp/7.5)) - 29;
                $("#passing").css({top: char_y, left: char_x, position:'absolute', display: "block"});
                $("body").get(0).style.setProperty("--beforeStatus", "none");
                $("body").get(0).style.setProperty("--afterStatus", "display");
            }
            
            function progressSim() {
                diff = (((al / 100) * Math.PI * 2 * 10).toFixed(2))/2; //change the arc by multiplying .. * Math.PI*2* --> 7.5=75, 5=50 etc.
                ctx.clearRect(0, 0, cw, ch);
                ctx.lineWidth = 3; 
                
                if( perstange < threshold ){
                ctx.fillStyle = 'red';
                ctx.strokeStyle = "red";
                $('.success-checkmark').addClass('dp-none');
                $('.fail-checkmark').removeClass('dp-none');
                }
                else if(perstange >= threshold){
                ctx.fillStyle = '#375F9A';
                ctx.strokeStyle = "#375F9A";
                $('.success-checkmark').removeClass('dp-none');
                $('.fail-checkmark').addClass('dp-none');
                }

                ctx.textAlign = 'center';
                ctx.font = "19px poppins";
                ctx.fillStyle = '#375F9A'
                console.log("cw and ch", cw, ch)

                ctx.beginPath();
                ctx.arc(260, 260, 225, start, diff / 7.5 + start, false); //.arc(x, y , radius, startAngle, endAngle, anticlockwise)
                ctx.stroke();
                if (al >= perstange) {    // stop the recreation at your desired point, i.e change 100 to 75 if you need just 75%.
                clearTimeout(sim); // Add scripting here that will run when progress completes
                }
                al++;
            }
            var sim = setInterval(progressSim, 20); //speed
            
            // ctx.fillText( al + '%', char_x, char_y);
            
        }


      function generateResult(){
        let total = $('.elem__quiz.calculated').length;
        let correct = 0;
        $('.elem__quiz.calculated').each(function(index,elem){
            if ($(elem).attr("data-answer") == "correct") {
                correct++;
            }
        });
        let result = correct/total;
        let newresult = (result*100).toFixed(0);
        let threshold  = $("#threshold").text()
        loadResult(newresult);
        $("#countup").countTo({
            from: 0,
            to: newresult,
            speed: 1500,
            refreshInterval: 10,
            formatter: function (value, options) {
              return value.toFixed(options.decimals);
            },
            onUpdate: function (value) {
              console.debug(this);
            },
            onComplete: function (value) {
                if (newresult < threshold) {
                    $('#main__progress>span>img').attr('src' ,"img/incorrect.png");
                } else {
                    $('#main__progress>span>img').attr('src' ,"img/success.png");                    
                }
                $("#main__progress").addClass("calculated");
                setTimeout(function(){
                    $('.again').addClass("active");
                    setTimeout(function(){
                        $('.elem__quiz.final .btn__').addClass('active');
                    }, 400);
                }, 400);
            }
          });
    }
    

    function changeTabIndex(){
        $(".slides__box *").each(function(index,elem){
            if ($(elem).attr("tabindex")) {
                $(elem).attr("tabindex" , "-1")
            }
        });
        
        $('.elem__quiz.current *').each(function(index,elem){
            if ($(elem).attr("tabindex")) {
                $(elem).attr("tabindex" , "0")
            }
        });
    }


    changeTabIndex();


    document.addEventListener("keypress", function(event) {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        if ($("label:focus").length) {
            $('label:focus').click();
        }
        if ($("img:focus").length) {
            $('img:focus').click();
        }
       
      }
    });

    $(window).on('resize' ,function(e){
        $('.number').each(function(index,elem){
            // $(elem).css("left" ,$('.sorting__accessible>.elem[data-id='+ $(elem).attr("data-id") +']').offset().left - 35);
            $(elem).css("left" ,$('.sorting__accessible>.elem[data-id='+ $(elem).attr("data-id") +']').offset().left - 30);
            $(elem).css("top" ,$('.sorting__accessible>.elem[data-id='+ $(elem).attr("data-id") +'] .info>svg').offset().top - 80 - 3);
            // $(elem).css("top" ,$('.sorting__accessible>.elem[data-id='+ $(elem).attr("data-id") +'] .info>svg').offset().top - 80 - $('.sorting__accessible>.elem[data-id='+ $(elem).attr("data-id") +'] .info>svg').outerHeight()/2);
        });
    });



    if ($('.sorting__accessible').length) {
        $('.sorting__accessible').sortable({
            update: function( event, ui ) {
                rearrangeHeight();
            }
        });
        jQuery.fn.extend({
          ksortable: function(options) {
            this.sortable(options);
            $('.elem', this).attr('tabindex', 0).bind('keydown', function(event) {
                if(event.which == 37 || event.which == 38) { // left or up
                  $(this).insertBefore($(this).prev());
                } 
                if(event.which == 39 || event.which == 40) { // right or down
                  $(this).insertAfter($(this).next()); 
                }     
                if (event.which == 84 || event.which == 33) { // "t" or page-up
                  $(this).parent().prepend($(this));
                } 
                if (event.which == 66 || event.which == 34) { // "b" or page-down
                  $(this).parent().append($(this));
                } 
                if(event.which == 82) { // "r"
                  var p = $(this).parent();
                  p.children().each(function(){p.prepend($(this))})
                } 
                if(event.which == 83) { // "s"
                  var p = $(this).parent();
                  p.children().each(function(){
                    if(Math.random()<.5)
                      p.prepend($(this));
                    else
                      p.append($(this));
                  })
                } 
                $(this).focus();
            });
          }
        });

        $( ".sorting__accessible" ).ksortable();


    }


    

    if ($('.sorting__wrapper').length) {
        rearrangeHeight();
        $(window).on('resize' ,function(){
            rearrangeHeight();
        });
    }



    $('.quiz__main .btn__box>a').on('click' ,function(e){
        e.preventDefault();
        $(this).closest('.elem__quiz').addClass("fall");
        setTimeout(function(){
            $('.elem__quiz.fall').removeClass("current").next(".elem__quiz").addClass("current");
        }, 400);
        setTimeout(function(){
            $('.elem__quiz.fall').removeClass("fall").addClass('disabled');
            setTimeout(function(){
                rearrangeHeight();
                changeTabIndex();
            }, 600);
        }, 500);
        $('html').animate({ 
                scrollTop: $('.slides__box').offset().top  - 80
            }, 400 
            );
    });

   
    $('.elem__quiz .next__quiz>a').on('click' ,function(e){
        e.preventDefault();
        $(this).closest('.elem__quiz').addClass("fall");
        setTimeout(function(){
            $('.elem__quiz.fall').removeClass("current").next(".elem__quiz").addClass("current");
        }, 400);
        $('.number').fadeOut(300);
        setTimeout(function(){
            $('.elem__quiz.fall').removeClass("fall").addClass('disabled');
             setTimeout(function(){
                rearrangeHeight();
                changeTabIndex();
            }, 600);
             if ($('.elem__quiz.current').hasClass('final')) {
                generateResult();
             }
        }, 500);
        $('html').animate({ 
                scrollTop: $('.slides__box').offset().top  - 80
            }, 400 
            );
    });


    $('.question__media').on('click' ,function(e){
        e.preventDefault();
        $('body,html').css("overflow-y" ,"hidden");
        $('.zoom__modal').fadeIn(300);
        $('.zoom__modal .main__image>img').attr('src' ,$(this).find("img").attr("src"));
    });
    $('.zoom__modal>.inner__modal>a').on('click' ,function(e){
        $(this).closest(".zoom__modal").fadeOut(300);
        $('body,html').css("overflow-y" ,"initial");
    });
    $(document).on('keyup', function(e) {
      if (e.key == "Escape") {
        $('.zoom__modal>.inner__modal>a').click()
      };
    });


     $('.elem__question input[type="radio"]').on('change' ,function(){
        if ($(this).prop("checked")  == true) {
            $(this).closest(".questions__radio").find('.elem__question').removeClass("current");
            $(this).closest(".elem__question").addClass("current");
        }
        $(this).closest('.elem__quiz').find('.submit__quiz>button').removeClass("disabled").attr("tabindex" , "0");
    });



     $('.elem__question input[type="checkbox"]').on('change' ,function(){
        if ($(this).prop("checked")  == true) {
            $(this).closest(".elem__question").addClass("current");
        } else {
            $(this).closest(".elem__question").removeClass("current");
        }
        if ($(this).closest(".questions__checks").find("input[type='checkbox']:checked").length != 0) {
            $(this).closest('.elem__quiz').find('.submit__quiz>button').removeClass("disabled").attr("tabindex" , "0")
        } else {
            $(this).closest('.elem__quiz').find('.submit__quiz>button').addClass("disabled").attr("tabindex" , "-1");
        }
    });


     $('.question__input>input').on("input" ,function(e){
        if ($(this).val().length != 0) {
            $(this).closest('.elem__quiz').find('.submit__quiz>button').removeClass('disabled').attr("tabindex" , "0")
        } else {
            $(this).closest('.elem__quiz').find('.submit__quiz>button').addClass('disabled').attr("tabindex" , "-1")
        }
     });


    $('.submit__quiz>button').on('click' ,function(e){
        e.preventDefault();
        let correct = false;
        if ($(this).closest('.elem__quiz').find('.questions__radio').length) {
            if ($(this).closest('.elem__quiz').find(".elem__question.current").attr("data-answer") == "true") {
                $(this).closest('.elem__quiz').find(".elem__question.current").closest('.question__elem--wrapper').addClass("success");
                correct = true;
            }
            if ($(this).closest('.elem__quiz').find(".elem__question.current").attr("data-answer") == "false") {
                $(this).closest('.elem__quiz').find(".elem__question.current").closest('.question__elem--wrapper').addClass("error");
                correct = false;
            }
        }

        if ($(this).closest('.elem__quiz').find('.question__input').length) {
            if ($(this).closest('.elem__quiz').find('.question__input>input[type="text"]').val().toLowerCase() == $(this).closest('.elem__quiz').find('.question__input>input[type="hidden"]').val().toLowerCase()) {
                correct = true;
                $(this).closest('.elem__quiz').find(".question__input").addClass("answered");
                $(this).closest('.elem__quiz').find(".question__input>span>img").attr("src" , "img/success.png");
            } else {
                correct = false;
                $(this).closest('.elem__quiz').find(".question__input").addClass("answered");
                $(this).closest('.elem__quiz').find(".question__input>span>img").attr("src" , "img/incorrect.png");
            }
        }


        if ($(this).closest(".elem__quiz").find('.sorting__wrapper').length) {
            $(this).closest('.elem__quiz').find(".sorting__wrapper").css("pointer-events" ,"none");
            let total =  $(this).closest(".elem__quiz").find(".sorting__wrapper .sorting__accessible>.elem").length;
            $(this).closest(".elem__quiz").find(".sorting__wrapper .sorting__accessible>.elem").each(function(index,elem){
                let newEL = $("<span class='number' data-id="+ $(elem).attr("data-id") +"><img src=''></span>");
                if ($(elem).attr("data-true-index") == (+$(elem).index() + 1)) {
                    $(newEL).find("img").attr("src" , "img/successwhite.png");
                } else {
                    $(newEL).find("img").attr("src" , "img/incorrectwhite.png");
                }

                $('body').append(newEL);
                $('.number:last-child').css("left" , $(elem).find(".info>svg").offset().left - 30);
                $('.number:last-child').css("top" , $(elem).find(".info>svg").offset().top - 80 - 3);
                if (+index + 1 != $(elem).attr("data-true-index")) {
                    total--;
                }
            });
            $(window).trigger("resize");
            if (+total == +$(this).closest(".elem__quiz").find(".sorting__wrapper .sorting__accessible>.elem").length) {
                correct = true;
            } else {
                correct = false;
            }

        }

        if ($(this).closest('.elem__quiz').find('.questions__checks').length) {
            let total = 0;
            let totalCorrect = 0;
            $(this).closest('.elem__quiz').find('.questions__checks .question__elem--wrapper').each(function(index,elem){
                if ($(elem).find('.elem__question').attr("data-answer") == "true") {
                    totalCorrect++;
                }
            });
            $(this).closest('.elem__quiz').find('.questions__checks .question__elem--wrapper').each(function(index,elem){
                if ($(elem).find("input[type='checkbox']:checked").length) {
                    if ($(elem).find('.elem__question').attr("data-answer") == "true") {
                        total++;
                        $(elem).addClass("success");
                    } else {
                        total--;
                        $(elem).addClass("error");
                    }
                }
            });
            if (total == 0 || total != totalCorrect) {
                correct = false;
            } else {
                correct = true;
            }
        }



        $(this).closest('.submit__quiz').css("display" ,"none");
        
        setTimeout(() => {
            $(this).closest(".elem__quiz").find(".status__quiz").fadeIn(300).addClass("show");
            if (correct == true) {
                $(this).closest(".elem__quiz").addClass('calculated');
                $(this).closest(".elem__quiz").attr('data-answer' , "correct");
                $(this).closest(".elem__quiz").find(".status__quiz .check>img").attr("src" ,"img/success.png");
                $(this).closest(".elem__quiz").find(".status__quiz .top__status>span").text("Correct");
                if ($(this).closest('.elem__quiz').find('.questions__radio').length) {
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Correct. The correct answer is <span>"+ $(this).closest(".elem__quiz").find('.questions__radio .elem__question[data-answer="true"]').attr("data-text") +"</span>.");
                }
                if ($(this).closest('.elem__quiz').find('.questions__checks').length) {
                    let text = "";
                    $(this).closest('.elem__quiz').find('.questions__checks').find('.question__elem--wrapper').each(function(index,elem){
                        if ($(elem).find(".elem__question").attr("data-answer") == "true") {
                            if (text == "") {
                                text = text + $(elem).find(".elem__question").attr("data-text");
                            } else {                                
                                text = text + ", " +  $(elem).find(".elem__question").attr("data-text");
                            }
                        }
                    });
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Correct. The correct answer is <span>"+ text +"</span>.");
                }
                if ($(this).closest(".elem__quiz").find(".question__input").length) {
                    $(this).closest('.elem__quiz').find(".question__input>label").fadeIn(300);
                    $(this).closest('.elem__quiz').find(".question__input>label").text("Acceptable responses: " + $(this).closest('.elem__quiz').find(".question__input").find("input[type='hidden']").val() + ", "  +  $(this).closest('.elem__quiz').find(".question__input").find("input[type='hidden']").val().toLowerCase());
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Correct. The correct answer is <span>"+ $(this).closest('.elem__quiz').find(".question__input").find("input[type='hidden']").val() +"</span>.");
                }


                if ($(this).closest(".elem__quiz").find(".sorting__wrapper").length) {
                    
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Correct");
                }
            } else {
                $(this).closest(".elem__quiz").addClass('calculated');
                $(this).closest(".elem__quiz").attr('data-answer' , "incorrect");
                $(this).closest(".elem__quiz").find(".status__quiz .check>img").attr("src" ,"img/incorrect.png");                
                $(this).closest(".elem__quiz").find(".status__quiz .top__status>span").text("Incorrect");
                if ($(this).closest('.elem__quiz').find('.questions__radio').length) {
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Incorrect. The correct answer is <span>"+ $(this).closest(".elem__quiz").find('.questions__radio .elem__question[data-answer="true"]').attr("data-text") +"</span>.");
                }
                if ($(this).closest('.elem__quiz').find('.questions__checks').length) {
                    let text = "";
                    $(this).closest('.elem__quiz').find('.questions__checks').find('.question__elem--wrapper').each(function(index,elem){
                        if ($(elem).find(".elem__question").attr("data-answer") == "true") {
                            if (text == "") {
                                text = text + $(elem).find(".elem__question").attr("data-text");
                            } else {                                
                                text = text + ", " +  $(elem).find(".elem__question").attr("data-text");
                            }
                        }
                    });
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Incorrect. The correct answer is <span>"+ text +"</span>.");
                }
                if ($(this).closest(".elem__quiz").find(".question__input").length) {
                    $(this).closest('.elem__quiz').find(".question__input>label").fadeIn(300);
                    $(this).closest('.elem__quiz').find(".question__input>label").text("Acceptable responses:" + $(this).closest('.elem__quiz').find(".question__input").find("input[type='hidden']").val() + ", "  +  $(this).closest('.elem__quiz').find(".question__input").find("input[type='hidden']").val().toLowerCase());
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Incorrect. The correct answer is <span>"+ $(this).closest('.elem__quiz').find(".question__input").find("input[type='hidden']").val() +"</span>.");
                }
                if ($(this).closest(".elem__quiz").find(".sorting__wrapper").length) {
                    $(window).trigger("resize");
                    $(this).closest(".elem__quiz").find(".status__quiz>p").html("Incorrect");
                }
            }
            $(this).closest(".elem__quiz").find('.next__quiz--wrapper').fadeIn(300);
            $(window).trigger("resize");
            setTimeout(function(){
                $(window).trigger("resize");
            }, 200);
            setTimeout(() => {
                $(this).closest(".elem__quiz").find('.top__status .check').addClass('show');

            }, 250);
            $('html').animate({ 
                scrollTop: $('.next__quiz--wrapper:visible').offset().top
            }, 400 
            );
        }, 800);
    });
});
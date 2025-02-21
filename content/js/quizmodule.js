const Quiz = function (container, initdata, progressStatus, progressData, onProgressUpdate, onReadyToNext) {
    const _this = this;
    let _index = 0;

    let questions = initdata.questions

    $(window).on('resize', function (e) {
        $('.number').each(function(index,elem){
            $(elem).css("left" ,$('.sorting__accessible>.elem[id='+ $(elem).attr("data-id") +']').offset().left - 30);
            $(elem).css("top", $('.sorting__accessible>.elem[id=' + $(elem).attr("data-id") + '] .info>svg').offset().top - 3);
        });
    })

    progressData = progressData || {}
    if (progressData['retries'] == undefined) progressData['retries'] = 0
    
    _this.rearrangeHeight = () => {
        if ($('.sorting__wrapper').length) {
            $('.sorting__wrapper').each(function(index,elem){
                $(elem).find('.sorting__accessible>.elem').each(function(ind,el){
                    $(el).find(".info").css("height" ,"auto");
                    $(elem).find('.sorting__static>.elem:nth-child('+ (+ind + 1) +')').find(".info").css("height" ,"auto");
                    let initialHeight = $(el).outerHeight();
                    let initialHeightSecond = $(elem).find('.sorting__static>.elem:nth-child('+ (+ind + 1) +')').outerHeight();
                    if (initialHeight > initialHeightSecond) {
                        $(el).find(".info").css("height" , initialHeight + "px");
                        $(elem).find('.sorting__static>.elem:nth-child('+ (+ind + 1) +')').find(".info").css("height" , initialHeight + 'px');
                    } else  {
                        $(el).find(".info").css("height" , +initialHeightSecond - 4 + "px");
                        $(elem).find('.sorting__static>.elem:nth-child('+ (+ind + 1) +')').find(".info").css("height" , initialHeightSecond - 4 + 'px');
                    }
                });
            });
        }
    }

    _this.init = function (autorun) {
        questions = initdata.questions

        if(progressData['sorted_item_ids'] != undefined) {
            let objlist = questions.reduce((obj, item) => {return { ...obj, [item['id']]: item };}, {});
            let sortedQuestionList = []
            for (const key in progressData['sorted_item_ids']) {
                if (Object.hasOwnProperty.call(progressData['sorted_item_ids'], key)) {
                    const element = progressData['sorted_item_ids'][key];
                    sortedQuestionList.push(objlist[element])
                }
            }
            questions = sortedQuestionList
        }
        else if(initdata.quiz_settings.randomize_question_order == 'yes') {
            let shufflequestions = initdata['questions'].filter(question => question.question_type != "welcome_screen")
            shufflequestions = [...shufflequestions].sort(() => Math.random() - 0.5);
            questions = initdata['questions'].filter(question => question.question_type == "welcome_screen")
            questions = questions.concat(shufflequestions)
        }

        progressData['sorted_item_ids'] = questions.map(item => item.id);
        onProgressUpdate(progressData, progressStatus)

        let html = ``;
        html += `
        <div class="quizes__box" id="itembox">
        </div>`;
        $(container).empty().append(html);

        questions.forEach((item, index) => {
            const elem_id = 'elem__quiz' + index
            $("#itembox").append(`
            <div class="elem__quiz" id="${elem_id}"></div>
            `)
        })
        
        if (autorun) {
            
            $(".elem__quiz").each(function () {
                $(this).show()
            })

            _index = progressData.index || 0;
            if(progressStatus.completed) {
                _renderResult($(container).find("#itembox"));
            }
            else {
                console.log("here")
                _this.nextItem();
            }
        }
    };

    let _pad = function (num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }   

    let _calculateTotalProgress = function() {
        console.log("Progress: ", progressData)
        let correctCount = 0
        let completeCount = 0
        let allquestions = questions.filter(question => question.question_type != "welcome_screen")
        let questionCount = allquestions.length
        for (const key in progressData['items']) {
            if (Object.hasOwnProperty.call(progressData['items'], key)) {
                const item = progressData['items'][key];
                completeCount += 1
                correctCount += item['correct'] ? 1 : 0
            }
        }
        let completionPercentage = completeCount/questionCount*100
        let scorePercentage = correctCount/questionCount*100
        let completed = completeCount == questionCount
        let passed = scorePercentage >= initdata.quiz_settings.passing_score

        if(initdata.quiz_settings.require_passing_score == 'yes') {
            completed = passed
        }
        let status = {
            'completion_percentage' : completionPercentage,
            'score_percentage' : scorePercentage,
            'completed' : completed,
            'passed' : passed,
        }
        onProgressUpdate(progressData, status)
        return status
    }

    let _setItemProgress = function(itemId, correct, data) {
        if(progressData['items'] == undefined) progressData['items'] = {}
        progressData['items'][itemId] = {
            'correct' : correct,
            'data' : data,
        }
        progressData['index'] = _index
        _calculateTotalProgress()
    }

    let _whiteOverlay = (threshold) => {
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

    let _loadResult = (value) => {
        var ctx = document.getElementById('result-display').getContext('2d');
        //var ctx_passing = document.getElementById('passing').getContext('2d');
          var al = 0;
          var start = 2.60;
          var cw = ctx.canvas.width;
          var ch = ctx.canvas.height;
          var diff;
          var perstange = value;
          var threshold  = $("#threshold").text()
          _whiteOverlay(threshold);
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
          
          
      }

    let _renderResult = function (itemContainer) {
        const elem_id = "elem__quiz__final"
        const elemContainer = '#'+elem_id
        let status = _calculateTotalProgress()

        let show_next_button = true
        if (initdata.quiz_settings.result_button == 'Hidden')
            show_next_button = false   
        else {
            if (initdata.quiz_settings.require_passing_score == 'yes') {
                if (parseFloat(initdata.quiz_settings.passing_score) > parseFloat(status['score_percentage']))
                    show_next_button = false   
            }
            
        }
        
        let html = ``;
        html += `
        <div class="elem__quiz final current" id="${elem_id}">
            <div class="quiz__question">
                <div class="result">
                    <h6>Quiz Results</h6>
                </div>
                <div class="progress__wrapper">
                    <div id="main__progress">
                        <canvas id="doughnut-result" width="520px" height="380px"></canvas>
                        <canvas id="result-display" width="520px" height="380px"></canvas>
                        <canvas id="white-overlay" width="520px" height="380px" style="position:absolute;display:none;"></canvas>
                        <span><img src="${assetsUrl}img/success.png" alt=""></span>
                        <p>Your score <span id="countup"></span>%</p>
                    </div>
                    <div id="greybuffer" style="position: absolute; top: 25px; left: 25px; width: 470px; height: 470px; display: none;">
                        <image src="${assetsUrl}img/greybuffer.png" style="width: 470px; height: 470px;"></image>
                    </div>
                    <div id="whitecircle" style="position: absolute; top: 34px; left: 34px; width: 470px; height: 470px; display: none;">
                        <image src="${assetsUrl}img/whitecircle.png" style="width: 452px; height: 452px;"></image>
                    </div>
                    <div id="whitepanel" style="position: absolute; top: 378px; width: 460px; height: 145px;">
                        <image src="${assetsUrl}img/whitepanel.png" style="width: 460px; height: 145px;"></image>
                    </div>
                    <div class="passing" id="passing">
                        <p>Passing <br> <span id="threshold">${initdata.quiz_settings.passing_score}</span><span>%</span></p>
                    </div>
                </div>
                <div class="again retryContainer">
                    <a role="button">
                        TAKE AGAIN
                        <i class="fa fa-2x fa-rotate-right"></i>
                    </a>
                </div>
                <div class="btn__" style="${show_next_button ? '':'display:none;'}">
                    <a href="javascript:;" class="result_button">${initdata.quiz_settings.result_button}</a>
                </div>
            </div>
        </div>
        `;
        $(itemContainer).append(html);

        if(initdata.quiz_settings.quiz_retries != "unlimited" && progressData['retries'] >= initdata.quiz_settings.quiz_retries) {
            $(elemContainer).find('.retryContainer').hide()
        }

        let percentage = status['score_percentage'];

        _loadResult(percentage)
        $("#countup").countTo({
            from: 0,
            to: percentage,
            speed: 1500,
            refreshInterval: 10,
            formatter: function (value, options) {
              return value.toFixed(options.decimals);
            },
            onUpdate: function (value) {
              console.debug(this);
            },
            onComplete: function (value) {
                if (status['passed']) {
                    $('#main__progress>span').html('<i class="fa fa-check fa-4x text-primary"></i>');                    
                } else {
                    $('#main__progress>span').html('<i class="fa fa-xmark fa-4x text-danger"></i>');
                }
                $("#main__progress").addClass("calculated");
                setTimeout(function(){
                    $('.again').addClass("active");
                    setTimeout(function(){
                        $('.elem__quiz .btn__').addClass('active');
                    }, 400);
                }, 400);
            }
        });


        if(initdata.quiz_settings.quiz_retries != "unlimited" && progressData['retries'] >= initdata.quiz_settings.quiz_retries) {
            $(elemContainer).find('.retryContainer').hide()
        }

        $(elemContainer).find('.retryContainer').on('click', function() {
            progressData = {}
            progressStatus = {
                'completion_percentage' : 0,
                'score_percentage' : 0,
                'completed' : false,
                'passed' : false,
            }
            console.log("retry")
            onProgressUpdate(progressData, progressStatus)
            progressData['retries'] ++
            _this.init(true)
        })

        $(elemContainer).find('.result_button').on('click', function() {
            DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: 'next'})
            // if ($(this).text() == "Close Course") {
            //     window.top.close()
            // }
        })
    };

    let _renderwelcomeScreen = function (itemContainer, itemId, item) {
        const elem_id = 'elem__quiz' + itemId
        const elemContainer = "#" + elem_id
        
        let html = ``;
        let img_tag = item.image ? `<img src=\"${item.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <div class="quiz__main">
                <h2>${item.title || ''}</h2>
                <p>${item.content[0] ? item.content[0].text : ''}</p>
                ${img_tag}
                <div class="btn__box">
                    <a href="#." class="btn-next" tabindex="0">START QUIZ</a>
                </div>
            </div>
        `;
        $(elemContainer).append(html);

        $(elemContainer).find(".btn-next").addClass("welcome_next");

        $(elemContainer).find(".btn-next").click(function (e) {
            e.preventDefault();
            _this.nextItem();
        });
    };

    let showFeedback = function(itemContainer, question, itemId, selectedValue, correct) {
        _setItemProgress(itemId, correct, selectedValue)


        if(initdata.quiz_settings.reveal_feedback == 'yes') {
            let feedback = question.feedback;

            setTimeout(() => {
                $(itemContainer).find(".status__quiz").fadeIn(300).addClass("show");
                $(itemContainer).addClass('calculated');
                if (correct == true) {
                    $(itemContainer).attr('data-answer', "correct");
                    
                    $(itemContainer).find(".status__quiz .check").html('<i class="fa fa-check fa-2x text-primary"></i>');
                    $(itemContainer).find(".status__quiz .top__status>span").text("Correct");
                    if (feedback.type !== "any") {
                        $(itemContainer).find(".status__quiz>p").html(feedback.correct_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                    } else {
                        $(itemContainer).find(".status__quiz>p").html(feedback.any_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                    }
                } else {
                    $(itemContainer).attr('data-answer' , "incorrect");
                    $(itemContainer).find(".status__quiz .check").html('<i class="fa fa-xmark fa-2x text-danger"></i>');                
                    $(itemContainer).find(".status__quiz .top__status>span").text("Incorrect");
                    if (feedback.type !== "any") {
                        $(itemContainer).find(".status__quiz>p").html(feedback.incorrect_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                    } else {
                        $(itemContainer).find(".status__quiz>p").html(feedback.any_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                    }
                }

                setTimeout(function(){
                    $(window).trigger("resize");
                }, 200);
                setTimeout(() => {
                    $(itemContainer).find('.top__status .check').addClass('show');
                }, 250);
                $(itemContainer).find(".submit__quiz").hide();
                $(itemContainer).find(".next__quiz--wrapper").show();
                $(itemContainer).find(".btn-next").show();

                let position = $(itemContainer+'_next__quiz--wrapper').offset().top
                $("html, body").animate({ scrollTop: position }, 400);
            }, 800);

            // window.scrollTo(0,500)

            $(itemContainer).find(".btn-next").click(function (e) {
                e.preventDefault();
                _this.nextItem();
            });
        }
        else {
            _this.nextItem();
        }
    }

    let getBottomHtml = function(elem_id) {
        return `
        <div class="submit__quiz">
          <button type="submit" class="btn btn-submit disabled" tabindex="-1">SUBMIT</button>
        </div>

        <div class="status__quiz" style="display:none;">
          <div class="top__status">
            <div class="check">
            </div>
            <span>Incorrect</span>
          </div>
          <p>Incorrect.</p>
        </div>
        <div class="next__quiz--wrapper" id="${elem_id}_next__quiz--wrapper" style="display:none;">
          <div class="next__quiz">
            <a href="javascript:;" class="btn-next" role="button" tabindex="-1">NEXT</a>
          </div>
        </div>
        `
    }

    let _renderSCQ = function (itemContainer, itemId, question) {
        const elem_id = 'elem__quiz' + itemId
        const elemContainer = "#" + elem_id

        let html = ``;
        let OptionsHtml = ``;
        let content = question.content ? question.content : "";
        if(initdata.quiz_settings.shuffle_choices == 'yes')
            content = [...content].sort(() => Math.random() - 0.5);

        for (const key in content) {
            const option = content[key];
            OptionsHtml += `
                <div class="question__elem--wrapper">
                    <div class="elem__question" data-answer="${option.correct}" data-text="${option.option || 'empty'}">
                    <label class="container__radio"  tabindex="0">
                        <input type="radio" id="q${itemId}-${key}" class="option" name="radio-type" type="radio" required="" value="${key}" data-correct="${option.correct}">
                        <span class="checkmark__radio"></span> ${option.option || 'empty'}
                    </label>
                    </div>
                </div>
            `;
        }
        let img_tag = question.image ? `<div class="question__media"><img src=\"${question.image}\" alt=\"\" style="max-width:100%;"/></div>` : "";
        
        html += `
        
            <form class="quiz__question">
                <div class="question__counter">
                    <span>Question</span>
                    <p style="${initdata.quiz_settings.include_lesson_count !== 'yes' ? 'display:none;':''}">${_pad(itemId,2)}/${_pad(questions.length-1,2)}</p>
                </div>
                <div class="question__title borderless">
                    <p>${question.title || 'empty'}</p>
                    ${img_tag}
                </div>
                <div class="questions__radio">
                ${OptionsHtml}
                </div>
               
                ${getBottomHtml(elem_id)}
            </form>
        `;
        $(elemContainer).html(html);

        $(elemContainer).find(".question-feedback").hide();
        $(elemContainer).find(".btn-next").hide();

        $(elemContainer).find(".option").change(function (e) {
            e.preventDefault();
            $(elemContainer).find(".btn-submit").removeClass("disabled");
        });

        $(elemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            let selectedOption = $(elemContainer).find(".option:checked");
            $(selectedOption).each(function (i, el) {
                const $parent = $(el).parents(".question__elem--wrapper")
                if ($(el).data("correct") == true) {
                    $parent.addClass("success")
                } else {
                    $parent.addClass("error")
                }
            })
            showFeedback(elemContainer, question, itemId, $(selectedOption).val(), $(selectedOption).data("correct") == true)
        });
    };

    let _renderMCQ = function (itemContainer, itemId, question) {
        const elem_id = 'elem__quiz' + itemId
        const elemContainer = "#" + elem_id
        
        let html = ``;
        let OptionsHtml = ``;
        let content = question.content ? question.content : "";
        if(initdata.quiz_settings.shuffle_choices == 'yes')
            content = [...content].sort(() => Math.random() - 0.5);
        for (const key in content) {
            const option = content[key];
            OptionsHtml += `
                <div class="question__elem--wrapper">
                    <div class="elem__question" data-answer="true" data-text="DeltaOmega Correct">
                    <label class="container__check" tabindex="0">
                        <input id="q${itemId}-${key}" type="checkbox" class="option" required="" value="${key}" data-correct="${option.correct}">
                        <span class="checkmark"></span>
                        ${option.option || 'empty'}
                    </label>
                    </div>
                </div>
            `;
        }
        let img_tag = question.image ? `<img src=\"${question.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <form class="quiz__question">
                <div class="question__counter">
                    <span>Question</span>
                    <p style="${initdata.quiz_settings.include_lesson_count !== 'yes' ? 'display:none;':''}">${_pad(itemId,2)}/${_pad(questions.length-1,2)}</p>
                </div>
                <div class="question__title borderless">
                    <p>${question.title || 'empty'}</p>
                    ${img_tag}
                </div>
                <div class="questions__checks">
                ${OptionsHtml}
                </div>
                ${getBottomHtml(elem_id)}
            </form>
        `;
        $(elemContainer).html(html);

        $(elemContainer).find(".question-feedback").hide();
        $(elemContainer).find(".btn-next").hide();
        var allOptions = $("#"+elem_id).find(".option");
        var correctOptions = [];
        var selectedItems = [];
        var correctElements = [];
        var incorrectElements = [];
        $(elemContainer).find(".option").change(function (e) {
            e.preventDefault();
            correctOptions = [];
            selectedItems = [];
            allOptions.each(function (index) {
                const $parent = $(this).parents(".question__elem--wrapper")
                if ($(this).data('correct') == true) {
                    correctOptions.push(index);
                } 
                if ($(this).is(':checked')) {
                    selectedItems.push(index);
                    
                    if ($(this).data('correct') == true) {
                        correctElements.push($parent)
                    } else {
                        incorrectElements.push($parent)
                    }
                }
            });
            if (selectedItems.length > 0) {
                $(elemContainer).find(".btn-submit").removeClass("disabled");
            } else {
                $(elemContainer).find(".btn-submit").addClass("disabled");
            }
        });

        $(elemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            correctElements.forEach(($el, index) => {
                if($($el.find(".option")[0]).is(':checked'))
                    $el.addClass("success")  
            })
            incorrectElements.forEach(($el, index) => {
                if($($el.find(".option")[0]).is(':checked'))
                    $el.addClass("error")  
            })

            showFeedback(elemContainer, question, itemId, selectedItems, JSON.stringify(selectedItems) == JSON.stringify(correctOptions) ? true : false)
        });
    };

    let _renderFillInTheBlank = function (itemContainer, itemId, question) {
        const elem_id = 'elem__quiz' + itemId
        const elemContainer = "#" + elem_id

        let html = ``;
        let OptionsHtml = ``;
        const content = question.content ? question.content : "";
        let img_tag = question.image ? `<div class="question__media"><img src=\"${question.image}\" alt=\"\" style="max-width:100%;"/></div>` : "";
        
        OptionsHtml += `
            <div class="question__input">
                <span><img src="${assetsUrl}img/success.png" alt=""></span>
                <input id="q${itemId}-0"  type="text" class="txt-box-fill-in-blanks option" placeholder="Type your answer here." tabindex="0">
            </div>
        `;
        html += `
            <form class="quiz__question">
                <div class="question__counter">
                    <span>Question</span>
                    <p style="${initdata.quiz_settings.include_lesson_count !== 'yes' ? 'display:none;':''}">${_pad(itemId,2)}/${_pad(questions.length-1,2)}</p>
                </div>
                <div class="question__title borderless">
                    <p>${question.title || 'empty'}</p>
                    ${img_tag}
                </div>
                ${OptionsHtml}
               
                ${getBottomHtml(elem_id)}
            </form>
        `;
        $(elemContainer).html(html);

        $(elemContainer).find(".question-feedback").hide();
        $(elemContainer).find(".btn-next").hide();

        $(elemContainer).find(".option").change(function (e) {
            if($(elemContainer).find(".option").val() != "")
                $(elemContainer).find(".btn-submit").removeClass("disabled");
            else {
                $(elemContainer).find(".btn-submit").addClass("disabled");
            }
        });

        $(elemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            let selectedOption = $(elemContainer).find(".txt-box-fill-in-blanks").val();
            var correctAnswer = "";
            let content = question.content;
            for (const key in content) {
                const option = content[key];
                if (option.correct) {
                    correctAnswer = option.answer;
                    break;
                }
            }
            let isCorrect = selectedOption.toLowerCase().replace('-', '') === correctAnswer.toLowerCase().replace('-', '')
            
            $(this).closest('.elem__quiz').find(".question__input").addClass("answered");
            if (isCorrect) {
                $(this).closest('.elem__quiz').find(".question__input>span").html('<i class="fa fa-check fa-2x text-primary"></i>');
            } else {
                $(this).closest('.elem__quiz').find(".question__input>span").html('<i class="fa fa-xmark fa-2x text-danger"></i>');
            }

            showFeedback(elemContainer, question, itemId, $(selectedOption).val(), isCorrect)
        });
    };

    let _renderMatching = function (itemContainer, itemId, question) {
        const elem_id = 'elem__quiz' + itemId
        const elemContainer = "#" + elem_id

        let html = ``;
        let OptionsHtml = ``;
        const content = question.content ? question.content : "";
        let matchingChoice = ``;
        let matchingOption = ``;

        let choicesArray = [...content].sort(() => Math.random() - 0.5);

        for (const key in content) {
            const option = content[key];
            let choiceObj = choicesArray[key] != undefined?choicesArray[key]:matchingData[key]
            matchingOption += `
                <div class="elem answer" style="max-width:100%;" tabindex="0" data-true-index="${choiceObj.id}" id="q${itemId}-${choiceObj.id}" key="${choiceObj.id}">
                    <div class="info">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"></path></svg>
                        <span>${choiceObj.question}</span>
                    </div>
                </div>
            `;
            matchingChoice += `
                <div class="elem" style="max-width:100%;">
                    <div class="info">
                        <span class="text-secondary">${option.answer || 'empty'}</span>
                    </div>
                </div>
            `;
        }

        OptionsHtml += `
            <div class="sorting__wrapper" style="width:80%;">
                <div class="sorting__accessible dropUL" style="width:50%;">
                    ${matchingOption}
                </div>
                <div class="sorting__static dragUL" style="width:50%;">
                    ${matchingChoice}
                </div>
            </div>
        `;
        let img_tag = question.image ? `<img src=\"${question.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <form class="quiz__question">
                <div class="question__counter">
                    <span>Question</span>
                    <p style="${initdata.quiz_settings.include_lesson_count !== 'yes' ? 'display:none;':''}">${_pad(itemId,2)}/${_pad(questions.length-1,2)}</p>
                </div>
                <div class="question__title">
                    <p>${question.title || 'empty'}</p>
                    ${img_tag}
                </div>
                
                ${OptionsHtml}
               
                ${getBottomHtml(elem_id)}
            </form>
        `;
        $(elemContainer).html(html);
        $(elemContainer).find(".btn-submit").removeClass("disabled");

        $(elemContainer).find(".question-feedback").hide();
        $(elemContainer).find(".btn-next").hide();

        $(elemContainer).find(".dropUL").sortable({
            update: function (event, ui) {
                _this.rearrangeHeight()
                
            },
            // containment: $(itemContainer).find('#dropUL'),
            // handle: '.handle',
            // helper: 'clone',
			// distance: 10,
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
        $(elemContainer).find(".dropUL").ksortable();

        $(elemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            $(elemContainer).find(".dropUL").sortable('disable');
            let selectedItems = [];
            $(elemContainer).find(".answer").each(function (index, value) {
                selectedItems.push($(this).attr("key"));
            });
            let correctCount = 0;
            for (let i = 0; i < selectedItems.length; i++) {
                let elem = $(elemContainer).find(`#q${itemId}-${selectedItems[i]}`);
                let newEL = $("<span class='number' data-id="+ $(elem).attr("id") +"><img src=''></span>");
                if (content[i].id.toString() === selectedItems[i]) {
                    correctCount++
                    $(newEL).find("img").attr("src", assetsUrl + "img/successwhite.png");
                    // $(itemContainer).find(`#q${itemId}-${selectedItems[i]} i`).prepend(`<b class="fa fa-check bg-success text-white hideMatchingIcon"></b>`);
                } else {
                    $(newEL).find("img").attr("src" , assetsUrl+"img/incorrectwhite.png");
                    // $(itemContainer).find(`#q${itemId}-${selectedItems[i]} i`).prepend(`<b class="fa fa-times bg-danger text-white hideMatchingIcon"></b>`);
                }
                $('body').append(newEL);
                $('.number:last-child').css("left" , $(elem).find(".info>svg").offset().left - 30);
                $('.number:last-child').css("top" , $(elem).find(".info>svg").offset().top - 80 - 3);
            }
            
            $(window).trigger("resize");

            showFeedback(elemContainer, question, itemId, selectedItems, correctCount == content.length)
        });
    };

    let _renderTrueFalse = function (itemContainer, itemId, question) {
        let html = ``;
        let OptionsHtml = ``;
        const content = question.content ? question.content : "";
        for (const key in content) {
            const option = content[key];
            OptionsHtml += `
                <button id="q${itemId}-${key}" class="styled button_color option type="button" data-correct="${option.correct}">${option.option}</button>
            `;
        }
        let img_tag = question.image ? `<img src=\"${question.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <div class="quiz-inside">
                <h2>${question.title || 'empty'}</h2>
                <form>
                    <div class="d-flex flex-wrap">
                        <div class="btn-true-false">
                            ${OptionsHtml}
                        </div>
                    </div>
                </form>
                ${img_tag}
            </div>
            ${getBottomHtml()}
        `;
        $(itemContainer).empty().append(html);

        $(itemContainer).find(".question-feedback").hide();
        $(itemContainer).find(".btn-next").hide();

        $(itemContainer).find(".option").click(function (e) {
            e.preventDefault();
            $(itemContainer).find(".btn-submit").removeClass("disabled");
            $(itemContainer).find(".option").removeClass("selected");
            $(this).addClass("selected");
        });

        $(itemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            let selectedOption = $(itemContainer).find(".option.selected");
            showFeedback(itemContainer, question, itemId, $(selectedOption).val(), $(selectedOption).data("correct") == true)
        });
    };

    _this.showItem = function (index) {
        
        let item = questions[index];
        if (item.question_type == "welcome_screen") {
            _renderwelcomeScreen($(container).find("#itembox"), index, item);
        } else if (item.question_type == "scq") {
            _renderSCQ($(container).find("#itembox"), index, item);
        } else if (item.question_type == "mcq") {
            _renderMCQ($(container).find("#itembox"), index, item);
        } else if (item.question_type == "true_false") {
            _renderTrueFalse($(container).find("#itembox"), index, item);
        } else if (item.question_type == "fill") {
            _renderFillInTheBlank($(container).find("#itembox"), index, item);
        } else if (item.question_type == "matching") {
            _renderMatching($(container).find("#itembox"), index, item);
        }

        $("#elem__quiz"+index).addClass("current")
    };

    let next_count = 0;
    _this.nextItem = function () {
        const $elem = $("#itembox").find(".current")
        console.log(_index)
        $elem.addClass("fall");
        setTimeout(function(){
            $elem.removeClass("current").next(".elem__quiz").addClass("current");
        }, 400);
        $('.number').fadeOut();
        setTimeout(function(){
            // $('.elem__quiz.fall').removeClass("fall").addClass('disabled');
            setTimeout(function(){
                _this.rearrangeHeight();
            }, 600);
            // if ($('.elem__quiz.current').hasClass('final')) {
                // _this.generateResult();
            // }
            let position = 0
            if ($('.slides__box').length) {
                position = $('.slides__box').offset().top  - 80
            }

            $('html, body').animate({ 
                scrollTop: position
            }, 400);
        }, 500);
        let shouldNext = true
        if(onReadyToNext != undefined) {
            shouldNext = onReadyToNext()
        }
        if(shouldNext) {
            if (_index >= questions.length) {
                setTimeout(() => {
                    _renderResult($(container).find("#itembox"));
                });
            } else {
                console.log("show item")
                _this.showItem(_index);
                _index++;
                return false
            }
            next_count++;
        }
    };
};

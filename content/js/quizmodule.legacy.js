const Quiz = function (container, initdata, progressStatus, progressData, onProgressUpdate, onReadyToNext) {
    const _this = this;
    let _index = 0;

    let questions = initdata.questions

    progressData = progressData || {}
    if(progressData['retries'] == undefined) progressData['retries'] = 0

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

        console.log(progressData['sorted_item_ids'])
        progressData['sorted_item_ids'] = questions.map(item => item.id);
        onProgressUpdate(progressData, progressStatus)
        console.log(progressData['sorted_item_ids'])

        let html = ``;
        html += `
        <div class="slides">
            <div class="slide is-active">
                <div id="itembox" class="quiz-process-intro">
                </div>
            </div>
        </div>`;
        $(container).empty().append(html);
        if(autorun) {
            _index = progressData.index || 0;

            if(progressStatus.completed) {
                _renderResult($(container).find("#itembox"));
            }
            else {
                _this.nextItem();
            }
        }
    };

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

    let _renderResult = function (itemContainer) {
        let status = _calculateTotalProgress()

        let html = ``;
        html += `
        <div class="text-center">
            <h3>Your score</h3>
            <div class="result-display">
                <span class="anchor-corner"></span>
                <canvas id="doughnut-result" width="520" height="520"></canvas>
                <canvas id="result-display" width="520" height="280"></canvas>
                <div class="doughnut-passed">
                    <div class="success-checkmark dp-none animated fadeInUp">
                        <div class="check-icon">
                            <span class="icon-line line-tip"></span>
                            <span class="icon-line line-long"></span>
                            <div class="icon-circle"></div>
                            <div class="icon-fix"></div>
                        </div>
                    </div>
                    <div class="fail-checkmark dp-none animated fadeInUp">
                        <div class="check-icon">
                            <svg viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M280 560C434.56 560 560 434.563 560 280C560 125.437 434.563 0 280 0C125.437 0 0 125.437 0 280C0 434.563 125.437 560 280 560ZM280 22.4C421.867 22.4 537.6 138.135 537.6 280C537.6 421.865 421.865 537.6 280 537.6C138.135 537.6 22.4 421.865 22.4 280C22.4 138.135 138.135 22.4 280 22.4Z" fill="#F80909"/>
                                <path d="M182.187 377.813C184.426 380.053 187.416 380.798 190.4 380.798C193.385 380.798 196.374 380.053 198.614 377.813L280.75 295.677L362.886 377.813C365.125 380.053 368.115 380.798 371.099 380.798C374.084 380.798 377.073 380.053 379.313 377.813C383.792 373.334 383.792 366.616 379.313 362.131L297.177 279.995L379.313 197.859C383.792 193.38 383.792 186.661 379.313 182.176C374.834 177.697 368.115 177.697 363.63 182.176L281.494 264.312L199.358 182.176C194.879 177.697 188.161 177.697 183.676 182.176C179.197 186.655 179.197 193.374 183.676 197.859L265.812 279.995L183.676 362.131C177.707 365.865 177.707 373.334 182.186 377.813H182.187Z" fill="#F80909"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="retryContainer">
                <h4 class="textAgain">TAKE AGAIN</h4>
                <i class="re-try"></i>
            </div>
            <div class="botm-quiz"> <a href="#." class="slides-nav__next js-next btn">Next <i class="fa-solid fa-angles-right"></i></a> </div>
        </div>
        `;
        $(itemContainer).empty().append(html);

        let percentage = status['score_percentage'];

        var doughnutArray = $(itemContainer).find("#doughnut-result").get(0).getContext("2d")
        doughnutArray.lineWidth = 1; //thickness of the line
        doughnutArray.fillStyle = "#eaeaea";
        doughnutArray.strokeStyle = "#eaeaea";
        doughnutArray.beginPath();
        doughnutArray.arc(260, 260, 255, 3.1, 6.3, false); //.arc(x, y , radius, startAngle, endAngle, anticlockwise)
        doughnutArray.stroke();

        var ctx = document.getElementById("result-display").getContext("2d");
        var al = 0;
        var start = 3.1;
        var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;
        var diff;

        function progressSim() {
            diff = ((al / 100) * Math.PI * 2 * 10).toFixed(2) / 2; //change the arc by multiplying .. * Math.PI*2* --> 7.5=75, 5=50 etc.
            ctx.clearRect(0, 0, cw, ch);
            ctx.lineWidth = 5;
            if (status['passed']) {
                ctx.fillStyle = "green";
                ctx.strokeStyle = "green";
                $(".success-checkmark").removeClass("dp-none");
                $(".fail-checkmark").addClass("dp-none");
            }
            else {
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                $(".success-checkmark").addClass("dp-none");
                $(".fail-checkmark").removeClass("dp-none");
            }
            ctx.textAlign = "center";
            ctx.font = "60px poppins";
            ctx.fillText(al + "%", cw * 0.5 + 2, ch * 0.5 + 8, cw);
            ctx.beginPath();
            ctx.arc(260, 260, 255, start, diff / 10 + start, false); //.arc(x, y , radius, startAngle, endAngle, anticlockwise)
            ctx.stroke();
            if (al >= percentage) {
                // stop the recreation at your desired point, i.e change 100 to 75 if you need just 75%.
                clearTimeout(sim); // Add scripting here that will run when progress completes
            }
            al++;
        }
        var sim = setInterval(progressSim, 20); //speed

        if(initdata.quiz_settings.quiz_retries != "unlimited" && progressData['retries'] >= initdata.quiz_settings.quiz_retries) {
            $(itemContainer).find('.retryContainer').hide()
        }

        $(itemContainer).find('.retryContainer').on('click', function() {
            progressData = {}
            progressStatus = {
                'completion_percentage' : 0,
                'score_percentage' : 0,
                'completed' : false,
                'passed' : false,
            }
            onProgressUpdate(progressData, progressStatus)
            progressData['retries'] ++
            _this.init(true)
        })
    };

    let _renderwelcomeScreen = function (itemContainer, itemId, item) {
        let html = ``;
        let img_tag = item.image ? `<img src=\"${item.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <div class="quiz-inside">
                <h2>${item.title || ''}</h2>
                <p>${item.content[0].text || ''}</p>
                ${img_tag}
            </div>
            <div class="botm-quiz">
                <a href="#." class="slides-nav__next btn-next btn next-button">Next <i class="fa-solid fa-angles-right"></i></a>
            </div>
        `;
        $(itemContainer).empty().append(html);

        $(itemContainer).find(".btn-next").addClass("welcome_next");

        $(itemContainer).find(".btn-next").click(function (e) {
            e.preventDefault();
            _this.nextItem();
        });
    };

    let showFeedback = function(itemContainer, question, itemId, selectedValue, correct) {
        _setItemProgress(itemId, correct, selectedValue)

        if(initdata.quiz_settings.reveal_feedback == 'yes') {
            let feedback = question.feedback;
            console.log(feedback)
            if (feedback.type !== "any") {
                if (correct == true) {
                    $(itemContainer).find(".question-feedback").addClass("correct")
                    $(itemContainer).find(".question-feedback .question-feedback-icon i").addClass("fa-check");
                    $(itemContainer).find(".question-feedback .question-feedback-icon label").text("Correct");
                    $(itemContainer).find(".question-feedback .question-feedback-text").text(feedback.correct_text);
                } else {
                    $(itemContainer).find(".question-feedback").addClass("incorrect")
                    $(itemContainer).find(".question-feedback .question-feedback-icon i").addClass("fa-remove");
                    $(itemContainer).find(".question-feedback .question-feedback-icon label").text("in correct");
                    $(itemContainer).find(".question-feedback .question-feedback-text").text(feedback.incorrect_text);
                }
                $(itemContainer).find(".question-feedback .question-feedback-icon").show();
            } else if (feedback.type == "any") {
                $(itemContainer).find(".question-feedback .question-feedback-text").text(feedback.any_text);
                $(itemContainer).find(".question-feedback .question-feedback-icon").hide();
            }

            $(itemContainer).find(".question-feedback").show();
            $(itemContainer).find(".option").prop("disabled", true);
            $(itemContainer).find(".btn-submit").hide();
            $(itemContainer).find(".btn-next").show();

            $(itemContainer).find(".btn-next").click(function (e) {
                e.preventDefault();
                _this.nextItem();
            });
        }
        else {
            _this.nextItem();
        }
    }

    let getBottomHtml = function() {
        return `
        <div class="question-feedback">
            <div class="question-feedback-icon">
                <i class="fa animated-tick"></i>
                <label class=""></label>
            </div>
            <div class="question-feedback-text">
            </div>
        </div>
        <div class="botm-quiz">
            <a href="#." class="slides-nav__next btn-submit btn disabled text-white">Submit</a>
            <a href="#." class="slides-nav__next btn-next btn next-button text-white">Next <i class="fa-solid fa-angles-right"></i></a>
        </div>`
    }

    let _renderSCQ = function (itemContainer, itemId, question) {
        let html = ``;
        let OptionsHtml = ``;
        let content = question.content ? question.content : "";
        if(initdata.quiz_settings.shuffle_choices == 'yes')
            content = [...content].sort(() => Math.random() - 0.5);

        for (const key in content) {
            const option = content[key];
            OptionsHtml += `
                <div class="radio">
                    <input id="q${itemId}-${key}" class="styled option" name="radio-type" type="radio" required="" value="${key}" data-correct="${option.correct}">
                    <label for="q${itemId}-${key}">${option.option || 'empty'}</label>
                </div>
            `;
        }
        let img_tag = question.image ? `<img src=\"${question.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        
        html += `
            <div class="quiz-inside">
                <h2>${question.title || 'empty'}</h2>
                <form>
                    <div class="d-flex flex-wrap">
                    ${OptionsHtml}
                    </div>
                </form>
                ${img_tag}
            </div>
            ${getBottomHtml()}
        `;
        $(itemContainer).empty().append(html);

        $(itemContainer).find(".question-feedback").hide();
        $(itemContainer).find(".btn-next").hide();

        $(itemContainer).find(".option").change(function (e) {
            e.preventDefault();
            $(itemContainer).find(".btn-submit").removeClass("disabled");
        });

        $(itemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            let selectedOption = $(itemContainer).find(".option:checked");
            showFeedback(itemContainer, question, itemId, $(selectedOption).val(), $(selectedOption).data("correct") == true)
        });
    };

    let _renderMCQ = function (itemContainer, itemId, question) {
        let html = ``;
        let OptionsHtml = ``;
        let content = question.content ? question.content : "";
        if(initdata.quiz_settings.shuffle_choices == 'yes')
            content = [...content].sort(() => Math.random() - 0.5);
        for (const key in content) {
            const option = content[key];
            OptionsHtml += `
                <div class="checkbox">
                    <input id="q${itemId}-${key}" class="styled option" type="checkbox" required="" value="${key}" data-correct="${option.correct}">
                    <label for="q${itemId}-${key}">${option.option || 'empty'}</label>
                </div>
            `;
        }
        let img_tag = question.image ? `<img src=\"${question.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <div class="quiz-inside">
                <h2>${question.title || 'empty'}</h2>
                <form>
                    <div class="d-flex flex-wrap">
                    ${OptionsHtml}
                    </div>
                </form>
                ${img_tag}
            </div>
            ${getBottomHtml()}
        `;
        $(itemContainer).empty().append(html);

        $(itemContainer).find(".question-feedback").hide();
        $(itemContainer).find(".btn-next").hide();
        var allOptions = $(itemContainer).find(".option");
        var correctOptions = [];
        var selectedItems = [];

        $(itemContainer).find(".option").change(function (e) {
            e.preventDefault();
            correctOptions = [];
            selectedItems = [];
            allOptions.each(function(index) {
                if ($(this).data('correct') == true) {
                    correctOptions.push(index);
                }
                if ($(this).is(':checked')) {
                    selectedItems.push(index);
                }
            });
            if (selectedItems.length > 0) {
                $(itemContainer).find(".btn-submit").removeClass("disabled");
            } else {
                $(itemContainer).find(".btn-submit").addClass("disabled");
            }
        });

        $(itemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            showFeedback(itemContainer, question, itemId, selectedItems, JSON.stringify(selectedItems) == JSON.stringify(correctOptions) ? true : false)
        });
    };

    let _renderFillInTheBlank = function (itemContainer, itemId, question) {
        let html = ``;
        let OptionsHtml = ``;
        const content = question.content ? question.content : "";
        OptionsHtml += `
            <div class="fillintheblanks">
                <input id="q${itemId}-0" type="text" class="txt-box-fill-in-blanks option" placeholder="Type your answer here">
            </div>
        `;
        let img_tag = question.image ? `<img src=\"${question.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <div class="quiz-inside">
                <h2>${question.title || 'empty'}</h2>
                <form>
                    <div class="d-flex flex-wrap">
                    ${OptionsHtml}
                    </div>
                </form>
                ${img_tag}
            </div>
            ${getBottomHtml()}
        `;
        $(itemContainer).empty().append(html);

        $(itemContainer).find(".question-feedback").hide();
        $(itemContainer).find(".btn-next").hide();

        $(itemContainer).find(".option").change(function (e) {
            if($(itemContainer).find(".option").val() != "")
                $(itemContainer).find(".btn-submit").removeClass("disabled");
            else {
                $(itemContainer).find(".btn-submit").addClass("disabled");
            }
        });

        $(itemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            let selectedOption = $(itemContainer).find(".txt-box-fill-in-blanks").val();
            var correctAnswer = "";
            let content = question.content;
            for (const key in content) {
                const option = content[key];
                if (option.correct) {
                    correctAnswer = option.answer;
                    break;
                }
            }
            showFeedback(itemContainer, question, itemId, $(selectedOption).val(), selectedOption.toLowerCase().replace('-','') === correctAnswer.toLowerCase().replace('-',''))
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

    let _renderMatching = function (itemContainer, itemId, question) {
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
                <li id="q${itemId}-${choiceObj.id}" class="ui-state-default">
                    <span class="matchingHand" id="matchingSortable"><i class="far fa-hand text-secondary" style="font-size:20px;"></i></span>
                    <div class="dragElement dropElement answer" key=${choiceObj.id}>
                        <i><span>${choiceObj.question}</span></i>
                    </div>
                </li>
            `;
            matchingChoice += `
                <li>
                    <div class="dragElement styled option" draggable="true">
                            <span>${option.answer || 'empty'}</span>
                    </div>
                </li>
            `;
        }

        OptionsHtml += `
            <div class="matching-component quiz-matching">
                <div class="qst-matching">
                    <div id="dragQuestion" class="linkingQuestion option">
                        <ul id="dropUL">
                        ${matchingOption}
                        </ul>
                        <ul id="dragUL">
                        ${matchingChoice}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        let img_tag = question.image ? `<img src=\"${question.image}\" alt=\"\" style="margin-top:20px;"/>` : "";
        html += `
            <div class="quiz-inside">
                <h2>${question.title || 'empty'}</h2>
                <form>
                    <div class="d-flex flex-wrap">
                    ${OptionsHtml}
                    </div>
                </form>
                ${img_tag}
            </div>
            ${getBottomHtml()}
        `;
        $(itemContainer).empty().append(html);

        $(itemContainer).find(".question-feedback").hide();
        $(itemContainer).find(".btn-next").hide();

        $(itemContainer).find("#dropUL").sortable({
            update: function (event, ui) {
                $(itemContainer).find(".btn-submit").removeClass("disabled");
            },
            containment: $(itemContainer).find('#dropUL'),
            handle: 'span.matchingHand',
            helper: 'clone',
			distance: 10,
        });

        $(itemContainer).find(".btn-submit").click(function (e) {
            e.preventDefault();
            $(itemContainer).find("#dropUL").sortable('disable');
            let selectedItems = [];
            $(itemContainer).find(".answer").each(function (index, value) {
                selectedItems.push($(this).attr("key"));
            });
            let correctCount = 0;
            for (let i = 0; i < selectedItems.length; i++) {
                $(itemContainer).find(`#q${itemId}-${selectedItems[i]} i b`).remove();
                if (content[i].id.toString() === selectedItems[i]) {
                    correctCount++
                    $(itemContainer).find(`#q${itemId}-${selectedItems[i]} i`).prepend(`<b class="fa fa-check bg-success text-white hideMatchingIcon"></b>`);
                } else {
                    $(itemContainer).find(`#q${itemId}-${selectedItems[i]} i`).prepend(`<b class="fa fa-times bg-danger text-white hideMatchingIcon"></b>`);
                }
            }
            showFeedback(itemContainer, question, itemId, selectedItems, correctCount == content.length)
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
    };

    let next_count = 0;
    _this.nextItem = function () {
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
                _this.showItem(_index);
                _index++;
            }
            next_count++;
        }
    };
};

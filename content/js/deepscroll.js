function  DeepScrollPackage(pkgId){
    var _this = this;
    var _gdata = {};
    var _progressData = {};
    var _isProgressSaved = false
    var _env = 'local'

    _this.init = function(onLoaded) {
        window.eldriver.init()
        /**Loading Progress Data from SCORM */
        let suspend_data = window.eldriver.GetValue("cmi.suspend_data") || "{}"
        var url = dataUrl + "data.json";
        $.getJSON(url).then(function (resp) {
            if(resp.error == 0) {
                _gdata = resp.data
                // console.log(_gdata)
                _env = _gdata.env
                if(suspend_data != "{}") {
                    _showResumePopup(function(confirm){
                        if(confirm == false) { // In case if user want to start over, we should clear suspend_data.
                            suspend_data = "{}"
                        }              
                        _progressData = JSON.parse(suspend_data) || {}  
                        _this.hideLoader()
                        onLoaded()
                    })
                   
                }else{
                    _this.hideLoader()
                    onLoaded()
                }
            }
            else alert(resp.message);
        }, function (resp) {
            alert("Data loading failed.");
        });

    }

    function _showResumePopup(onAction) {
       
        _this.applySettings();
        var modalContent = `
            <div id="confirmation-modal" class="white-popup">
                <h3>Edital Says</h3>
                <p>Would you like to resume from where you left before?</p>
                <div class="confirmBtnDiv">
                    <button class="btn-yes confirmBtns">Yes</button>
                    <button class="btn-no confirmBtns">No</button>
                </div>
            </div>
        `;

        $.magnificPopup.open({
            items: {
                src: modalContent,
                type: 'inline'
            },
            preloader: false,
            modal: true,
            callbacks: {
                open: function () {
                    // Handle "Yes" button click
                    $('.btn-yes').on('click', function () {
                        onAction(true);
                        $.magnificPopup.close();
                    });

                    // Handle "No" button click
                    $('.btn-no').on('click', function () {
                        onAction(false);
                        $.magnificPopup.close();
                    });
                }
            }
        });
    }



    _this.label = function(k, d) {
        if(_gdata.labels == undefined)  return d != undefined?d:k;
        if(_gdata.labels[k] == undefined)  return d != undefined?d:k;
        return _gdata.labels[k]
    }

    _this.showLoader = function() {
        $("#loader").fadeIn(200);
    }

    _this.hideLoader = function() {
        setTimeout(function(){$("#loader").fadeOut(200);}, 500);
    }

    _this.getTitle = function() {
        return _gdata.title
    }

    _this.getDescription = function() {
        return _gdata.description
    }

    _this.getSettings = function() {
        if(_gdata.settings)
            return _gdata.settings
        else {
            return {
                courseThemeColor: "#03A3FA"
            }
        }
    }

    _this.getCurrentPage = function() {
        let page = undefined
        if(_progressData['current_page'] != undefined && _progressData['current_page'] != '') {
            page = _gdata.pages.find(page => page.id == _progressData['current_page']);
        }
        return page
    }

    _this.setCurrentPage = function(pageId) {
        _progressData['current_page'] = pageId
        _isProgressSaved = false
    }

    _this.getProgressTrackingSettings = function() {
        return _gdata.progress_tracking_settings
    }

    _this.applySettings = function() {
        let settings = soPackage.getSettings()
        var root = $("#wrap").get(0);
        // console.log("see")
        // console.log(settings)
        root.style.setProperty('--primary-color', settings.courseThemeColor)
        root.style.setProperty('--font-family-body', settings.bodyFont);
        root.style.setProperty('--font-family-heading', settings.headingFont);
        root.style.setProperty('--font-family-paragraph', settings.paragraphFont);
        if(settings.imageUrl) {
            root.style.setProperty('--course-image-url', `url(${settings.imageUrl || ""})`);
            root.style.setProperty('--course-image-overlay', settings.courseImageOverlay);
            root.style.setProperty('--course-image-overlay-color', settings.courseImageOverlayColour);
        }
        var root = $("html").get(0)
        root.style.setProperty('--primary-color', settings.courseThemeColor)
        root.style.setProperty('--readabler-btn-color', settings.courseThemeColor)
        root.style.setProperty('--readabler-btn-color-hover', '#FFFFFF')
        root.style.setProperty('--readabler-btn-bg', '#FFFFFF')
        root.style.setProperty('--readabler-btn-bg-hover', settings.courseThemeColor)
        root.style.setProperty('--readabler-color', settings.courseThemeColor)
        root.style.setProperty('--readabler-color-transparent', '#EEE')
    }

    _this.pageContents = function () {
        let pages = _gdata.pages
        let respPages = []
        let pageContents = []

        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            var parent_id = page.parent_id;

            // If the page has no parent, add it to the pages array
            if (!parent_id) {
                if (page.page_type !== 'section')
                    pageContents.push(page)
                respPages.push(Object.assign({}, page));
            } else {
                // Otherwise, find the parent object in the pages array using the parent_id
                for (var j = 0; j < respPages.length; j++) {
                    var parent = respPages[j];
                    if (parent.id === parent_id) {
                        // Add the current page to the parent object's children array
                        if (!parent.children) {
                            parent.children = [];
                        }
                        parent.children.push(Object.assign({}, page));
                        pageContents.push(page)
                    }
                }
            }
        }

        return pageContents

    }

    _this.getPageList = function() {
        let pages = _gdata.pages
        let respPages = []
        // Loop through each page in the data object
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            var parent_id = page.parent_id;

            // If the page has no parent, add it to the pages array
            if (!parent_id) {
                respPages.push(Object.assign({}, page));
            } else {
                // Otherwise, find the parent object in the pages array using the parent_id
                for (var j = 0; j < respPages.length; j++) {
                    var parent = respPages[j];
                    if (parent.id === parent_id) {
                        // Add the current page to the parent object's children array
                        if (!parent.children) {
                            parent.children = [];
                        }
                        parent.children.push(Object.assign({}, page));
                    }
                }
            }
        }

        respPages.sort(function (a, b) {
            return a.sidx - b.sidx;
        });
        let settings = soPackage.getSettings()
        let navRestriction = settings.navigationMode != 'Free'
        let prevPage = undefined
        //Setting the page status.
        for (const key in respPages) {
            const page = respPages[key];
            if (typeof page !== 'undefined') {
                if(page.page_type == 'section') {
                    let prevcPage = undefined
                    let pageCompleted = 0
                    for (const ckey in page.children) {
                        const cpage = page.children[ckey];
                        if (typeof cpage !== 'undefined') {
                            cpage.status = _this.getPageStatus(cpage.id)
                            cpage.locked = false
                            if(navRestriction && prevcPage && !prevcPage.status.completed) {
                                cpage.locked = true
                            }
                            if(cpage.status.completed) {
                                pageCompleted++
                            }
                        }
                    }
    
                    let pageProgressMeasure = pageCompleted
    
                    children = page.children ? page.children.length : 0
                    if(children > 0)
                        pageProgressMeasure = pageCompleted / children*100
                    else
                        pageProgressMeasure = 100
                    page.status = {
                        completed : pageCompleted >= children,
                        completion_status : pageProgressMeasure >= 100 ? "completed" : "incomplete",
                        progress_measure : Math.round(pageProgressMeasure),
                    };
                }
                else {
                    page.status = _this.getPageStatus(page.id)
                }
    
                page.locked = false
                if(navRestriction && prevPage && !prevPage.status.completed) {
                    page.locked = true
                }
                prevPage = page
            }
        }
        return respPages
    }

    _this.showCurrentPage = function() {
        let blocks = []
        let pageId = _progressData['current_page']
        if(_progressData[pageId] == undefined)
            _progressData[pageId] = {}

        const page = _gdata.pages.find(page => page.id == pageId);
        const pages = _gdata.pages.filter(page => page.page_type != 'section')
        if (typeof page !== 'undefined' && typeof page.blocks !== 'undefined') {
            let numbered_divider = 0
            for (const key in page.blocks) {
                const block = page.blocks[key];
                if (block.type == 'numbered_divider')
                    numbered_divider++

                block.numbered_divider = numbered_divider

                var newblock = DeepScrollPackage.Components.create(block.type, block, _progressData[pageId][block.id] || {}, function(progress){
                    _progressData[pageId][block.id] = progress
                    _isProgressSaved = false
                    DeepScrollPackage.listeners.raise(DeepScrollPackage.events.ONPROGRESSUPDATE, {pageId: pageId, blockId: block.id})
                }, function(nextType, nextPageId) {
                    if(nextType == 'page') {
                        let pageIndex = pages.indexOf(page)
                        if(pageIndex + 1 < pages.length) {
                            DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: pages[pageIndex + 1].id})
                        }
                        else {
                            DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: false})
                        }
                    }
                    else {
                        alert(1);
                    }
                })
    
                if(newblock != undefined) {
                    blocks.push(newblock)
                    newblock.render('#dspage')
                }
                else{
                    console.log(block.type, "Component not found.")
                }
            }
        }

        $(blocks).each(function(k,v) {
            if(typeof(v._afterPageRender) == 'function') v._afterPageRender()
        });

        for (const key in blocks) {
            if (Object.hasOwnProperty.call(blocks, key)) {
                const block = blocks[key];
                if(!block.getDOM().hasClass("completed")) {
                    block.getDOM().get(0).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                    console.log("Till Block Id", block.getDOM())
                    break
                }
            }
        }

        $(window).scroll(function() {
            $(blocks).each(function(k,v) {
                if(v.checkIfInScreen()) {
                }
            });
        });
        $(window).scroll()
        if (_env == 'review') {
            $(".wow").removeClass("wow")
        }
            
        new WOW().init();

        DeepScrollPackage.listeners.register(DeepScrollPackage.events.ONPROGRESSUPDATE, function(data){
            soPackage.postStatus()
        })
    }

    _this.getPageIdFromURL = function () {
        const url = document.URL
        const match = /(?<=page\/)\d*/.exec(url)
        return match ? match[0] : null;
    }

    /**
     * In this function, we are getting all the blocks of the page and
     * checking the status of each blocks and calculating the completion
     * Status.
     */
    _this.getPageStatus = function(pageId) {
        const page = _gdata.pages.find(page => page.id == pageId);
        if(_progressData[page.id] == undefined)
            _progressData[page.id] = {}

        if(page.page_type == 'content') {
            let completionPercentage = 0
            let scorePercentage = 0
            let blocksCompleted = 0
            let blockCount = page.blocks.length
            for (const key in page.blocks) {
                const block = page.blocks[key]
                if (typeof block !== 'undefined') {
                    const blockProgress = _progressData[page.id][block.id];
                    if(blockProgress != undefined) {
                        const status = blockProgress["status"] || {completion_percentage: 0, score_percentage: 0, completed: false, passed: false}
                        completionPercentage += status['completion_percentage']
                        blocksCompleted += status['completed'] == true?1:0
                        scorePercentage += status['score_percentage']
                    }    
                }
            }
            return {
                completion_percentage : completionPercentage / blockCount,
                score_percentage : scorePercentage / blockCount,
                completed : blocksCompleted == blockCount,
                passed : false,
                completion_status : blocksCompleted == blockCount ? "completed" : "incomplete"
            };
        }
        else if(page.page_type == 'quiz') {
            let completionPercentage = 0
            let completed = 0
            let scorePercentage = 0
            let passed = false

            const block = page.blocks[0]
            if (typeof block !== 'undefined') {
                const blockProgress = _progressData[page.id][block.id];
                if(blockProgress != undefined) {
                    const status = blockProgress["status"] || {completion_percentage: 0, score_percentage: 0, completed: false, passed: false}
                    completionPercentage = status['completion_percentage']
                    completed = status['completed']
                    scorePercentage = status['score_percentage']
                    passed = status['passed']
                }
            }
            let completionStatus = "incomplete"

            if(completed) {
                completionStatus = scorePercentage > 60 ? "Passed" : "Not Passed"
            }
            return {
                completion_percentage : completionPercentage,
                score_percentage : scorePercentage,
                completed : completed,
                passed : passed,
                completion_status : completionStatus
            };
        }
        return status
    }

    _this.postStatus = function() {
        let totalQuizScore = 0
        let progressTracking = _this.getProgressTrackingSettings()

        if(progressTracking['tracking_based_on'] == 'page_completion') {
            let pages = _this.getPageList()
            let completeCount = 0
            for (let index = 0; index < pages.length; index++) {
                const page = pages[index];
                if (typeof page !== 'undefined') {
                    const status = _this.getPageStatus(page.id)
                    if(status.completed) {
                        completeCount ++
                    }
                }
            }
            if((completeCount / pages.length * 100) >= progressTracking.tracking_score) {
                if(progressTracking.pass_or_fail) {
                    window.eldriver.SubmitResult(0, "completed", "passed")
                }
                else {
                    window.eldriver.SubmitResult(0, "completed", "completed")
                }
            }
        }
        else if(progressTracking['tracking_based_on'] == 'quiz_results') {
            let pages = null
            if(progressTracking['tracking_quiz_page_id'] == 0) {
                pages = _gdata.pages.filter(page => page.page_type == 'quiz')
            }
            else {
                pages = _gdata.pages.filter(page => page.id == progressTracking['tracking_quiz_page_id'])
            }
            if(pages != null ) {
                let totalQuizScore = 0
                let completeCount = 0
                let passedCount = 0
                
                for (let index = 0; index < pages.length; index++) {
                    const page = pages[index];
                    if (typeof page !== 'undefined') {
                        const status = _this.getPageStatus(page.id)
                        if(status.completed) {
                            completeCount ++
                        }
                        if (status.passed)
                            passedCount++
                        totalQuizScore += status.score_percentage
                    }
                }
                if(completeCount == pages.length) {
                    if(passedCount >= pages.length) {
                        if(progressTracking.pass_or_fail) {
                            window.eldriver.SubmitResult(totalQuizScore, "completed", "passed")
                        }
                        else {
                            window.eldriver.SubmitResult(totalQuizScore, "completed", "completed")
                        }
                    }
                    else {
                        if(progressTracking.pass_or_fail) {
                            window.eldriver.SubmitResult(totalQuizScore, "completed", "failed")
                        }
                        else {
                            window.eldriver.SubmitResult(totalQuizScore, "completed", "incomplete")
                        }
                    }
                }
            }
        }
    }

    setInterval(function(){
        if(!_isProgressSaved) {
            window.eldriver.SetValue("cmi.suspend_data", JSON.stringify(_progressData))
            window.eldriver.Commit()
            _isProgressSaved = true;
            console.log("Progress Saved.")
        }
    }, 1000)
}

DeepScrollPackage.listeners = new (function() {
    let _this = this;
    let _listeners = {}

    _this.register = function(eventName, func) {
        if(_listeners[eventName] == undefined) _listeners[eventName] = []
        _listeners[eventName].push(func);
    }

    _this.raise = function(eventName, data) {
        for (const key in _listeners[eventName]) {
            const element = _listeners[eventName][key];
            element(data)
        }
    }

    _this.remove = function(eventName, func) {
        for (const key in _listeners[eventName]) {
            const element = _listeners[eventName][key];
            let index = _listeners[eventName].indexOf(element)
            splice(index, 1);
        }
        _listeners[eventName] = func;
    }
})();

DeepScrollPackage.events = {
    NEXTPAGE : "NEXTPAGE",
    ONPROGRESSUPDATE : "ONPROGRESSUPDATE",
}

DeepScrollPackage.BaseComponent = function(initdata, initprogress, onProgressUpdate, onNext) {
    let _this = this
    let _id = initdata.id
    let _type = initdata.type
    let _numbered_divider = initdata.numbered_divider
    let _data = initdata.data || {}
    let _propertyList = {}
    let _progress = initprogress || {}

    if(typeof(_this._render) != "function") console.error(_this.name, ":_render is not defined.")

    for (const key in _data) {
        let property = function(type, name, properties) {
            let _thisfield = this
            _thisfield.name = function() { return name }

            _thisfield.properties = function(name, value) {
                if(value != undefined) {
                    if(typeof(value) == 'object') {
                        for (const key in properties[name]) {
                            if(value[key] != undefined)
                                properties[name][key] = value[key]
                        }
                    }
                    else {
                        properties[name] = value
                    }

                    return;
                }

                if(properties[name] != undefined)
                    return properties[name]
                else
                    return properties
            }

            _thisfield.styles = function(name, value) {
                let _str = function (key, data) {
                    
                    if (key == 'background-image') {
                        css = `${key}:url(${encodeURI(data['value'])});`
                        images = data['value'].split('/')
                        if (images.at(-1) !== "block-bg-img.jpg")
                            css += 'background-size: cover;background-repeat: no-repeat;background-position: center center;';
                        return css;
                    }
                    else if(data['unit'] != undefined)
                        return `${key}:${data['value'] + "" + data['unit']}; `
                    else
                        return `${key}:${data['value']}; `
                }
                if(properties[name] != undefined) return `${_str(name, properties[name])};`
                else if(name == undefined) {
                    let stylesStr = ``;
                    for (const key in properties) {
                        if(properties[key].type == 'style')
                            stylesStr += `${_str(key, properties[key])}; `
                    }
                    return stylesStr;
                }
                else return ``;
            }
        }
        _propertyList[key] = new property(_data[key].type, key, _data[key].properties)
    }

    _this.getId = function() {
        return _id
    }

    _this.getType = function() {
        return _type
    }

    _this.getNumberedDivider = function() {
        return _numbered_divider
    }

    _this.getPropertyList = function () {
        return _propertyList;
    };

    _this.getPropertyGroup = function (key) {
        return _propertyList[key];
    };

    _this.getDOM = function() {
        return $(`section[data-id=section-${_id}]`)
    }

    _this.render = function(container) {
        if(typeof(_this._beforeRender) == 'function') _this._beforeRender()
        let styles = ""
        if(_propertyList.section != undefined) {
            styles = _propertyList.section.styles()
        }

        let html =
        `<section id="section_${_id}" class="section-${_this.getType()} wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0s" data-wow-offset="100" data-id="section-${_this.getId()}">
            ${`<div class="section-content" style="${styles}">${_this._render(_propertyList)}</div>`}
        </section>`

        $(container).append(html)

        if(typeof(_this._afterRender) == 'function') _this._afterRender()

        if(initprogress['status'] != undefined && initprogress['status']['completed'] == true) {
            _this.getDOM().addClass("completed")
        }
        if(typeof(_this._beforeRender) == 'function') _this._beforeRender(container)
    }

    _this.checkIfInScreen = function() {
        try {
            var sectionTop = _this.getDOM().offset().top;
            var windowCheckLine = $(window).scrollTop() + $(window).outerHeight() * 0.9 ;

            if (windowCheckLine > sectionTop) {
                if(typeof(_this._viewed) == 'function') _this._viewed()
                _progress['viewed'] = true
                //console.log(_this.getId() +" (VIEWED) => " + `Window CheckLine(${windowCheckLine}) < SectionTop(${sectionTop})`)
                return true
            }
            if(_progress['viewed'] != true) {
                _progress['viewed'] = false
            }
        } catch (error) {
            //console.log(error)
        }

        return false
    }

    _this.setProgressStatus = function(completion_percentage, score_percentage, completed, passed) {
        //{completion_percentage: 0, score_percentage: 0, completed: false, passed: false}
        _progress['status'] = {
            completion_percentage : completion_percentage,
            score_percentage : score_percentage,
            completed : completed,
            passed: passed
        }
        //console.log(_progress['status'])
        if(completed) {
            _this.getDOM().addClass("completed")

            if(passed) {
                _this.getDOM().addClass("passed")
            }
            else {
                _this.getDOM().addClass("failed")
            }
        }
        onProgressUpdate(_progress)
    }

    _this.getProgressStatus = function() {
        return _progress['status']
    }

    _this.isViewed = function() {
        return _progress['viewed'] == true
    }

    _this.setProgressData = function(data) {
        _progress['data'] = data
        onProgressUpdate(_progress)
    }

    _this.getProgressData = function() {
        return _progress['data']
    }

    _this.next = function(nextType, pageId) {
        onNext(nextType, pageId)
    }
}

DeepScrollPackage.Components = new (function() {
    let _this = this;
    let _list = {}

    _this.register = function(name, component) {
        _list[name] = component;
    }

    _this.create = function(name, initdata, initprogress, onProgressUpdate, onNext) {
        if(_list[name] == undefined) return undefined;
        let obj = new _list[name]();
        DeepScrollPackage.BaseComponent.call(obj, initdata, initprogress, onProgressUpdate, onNext)
        return obj;
    }
})();

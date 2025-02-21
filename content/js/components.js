$(window).on('resize' ,function(e){
    $('.number').each(function(index,elem){
        $(elem).css("left" ,$('.sorting__accessible>.elem[id='+ $(elem).attr("data-id") +']').offset().left - 30);
        if ($('.sorting__accessible>.elem[id='+ $(elem).attr("data-id") +']').closest(".single__step").length == 0) {
            $(elem).css("top" ,$('.sorting__accessible>.elem[id='+ $(elem).attr("data-id") +'] .info>svg').offset().top - 160 - 3);                
        } else {
            $(elem).css("top" ,$('.sorting__accessible>.elem[id='+ $(elem).attr("data-id") +'] .info>svg').offset().top - 80 - 3);
        }
    });
});

/*---------------------------------------- Components ----------------------------------------*/
DeepScrollPackage.Components.register("text_on_image", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="overlay" style="opacity:${
            fields.section.properties("overlay-opacity").value
        }%; background-color:${
            fields.section.properties("overlay-color").value
        }"></div>
        <div class="container">
            <h1 class="edit-text heading-edit" ="heading" data-optkey="heading"">
                <span class="sr-only">${
                    fields.section.properties("background-image").value
                }</span>
                ${fields.heading.properties("content").value} </h1>
        </div>
        `;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

DeepScrollPackage.Components.register("headingparagraph", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="container">
            <h1 class="edit-text heading-edit" data-element="heading" data-optkey="heading" style="${fields.heading.styles()}">
                ${fields.heading.properties("content").value}
            </h1>
            <div class="edit-text" data-element="paragraph" data-optkey="paragraph" style="${fields.paragraph.styles()}">
                ${fields.paragraph.properties("content").value}
            </div>
        </div>
        `;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

DeepScrollPackage.Components.register("image_text", function () {
    let _this = this;

    _this._render = function (fields) {
        var imagePos = fields.image.properties("image_position").value;
        var classPos = "half_left_layout";
        if (imagePos == "right") classPos = "half_right_layout";
        var imageBlock = `<div class="image main-half-layout ${classPos} " data-optkey="image" style="${fields.image.styles()}; background-size:cover;"></div>`;
        var textBlock = `
        <div class="paragraph main-half-layout-container ${classPos} fr-box fr-inline">
            <h1 class="edit-text heading-edit" data-element="heading" data-optkey="heading" style="${fields.heading.styles()}">
                ${fields.heading.properties("content").value}
                <span class="sr-only">${
                    fields.image.properties("background-image").alt
                }</span>    
            </h1>
            <div class="edit-text" data-element="paragraph" data-optkey="paragraph" style="${fields.paragraph.styles()}">
                ${fields.paragraph.properties("content").value}
            </div>
        </div>`;

        return `${
            imagePos == "left" ? imageBlock + textBlock : textBlock + imageBlock
        }`;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

DeepScrollPackage.Components.register("heading", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="container">
            <h1 class="edit-text heading-edit" data-element="heading" data-optkey="heading" style="${fields.heading.styles()}">
                ${fields.heading.properties("content").value}
            </h1>
        </div>
        `;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

let imagesComponent = function (_this, count) {
    _this._render = function (fields) {
        // let colClass = "col-12";
        // let gcolClass = "with-one-col";
        if (count == 2) {
            colClass = "col-6 twoCol";
            gcolClass = "with-two-col ";
        }
        if (count == 3) {
            colClass = "col-4 threeCol";
            gcolClass = "with-three-col";
        }
        if (count == 4) {
            colClass = "col-3 fourCol";
            gcolClass = "with-four-col";
        }

        var imageBlock = `
        <div class="gallery-images container-fluid">
            
                ${(() => {
                    let result = "";

                    for (let i = 1; i <= count; i++) {
                        let imageUrl = fields.images.properties(
                            "image" + i
                        ).value;
                       
                        let caption = typeof fields.images.properties("title" + i) !== 'undefined' ? fields.images.properties("title" + i).value : ''
                        result += `
                        <div class="image-col">
                            <a class="image" href="${imageUrl}">
                                <img src="${imageUrl}" class="img-responsive" crossorigin="anonymous">
                                <span class="sr-only">${
                                    fields.images.properties("image" + i).alt
                                }</span> 
                                <p style="margin-bottom:30px;"><small>${typeof caption !== 'undefined' ? caption : ''}</small></p>
                            </a>
                        </div>
                    `;
        }
        return result;
      })()}
            
        </div>`;
        return imageBlock;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {
        _this.getDOM().magnificPopup({
            delegate: "a.image",
            gallery: {
                enabled: true,
            },
            mainClass: "mfp-fade",
            type: "image",
        });
    };
   
};

DeepScrollPackage.Components.register("images1", function(){
    let _this = this

    _this._render = function(fields){
        let imageSize = fields.images.properties('image1').value;
        let image = fields.images.properties("sizes").value;

        let cssimagesize = "";
        if (image === "small"){
            cssimagesize = "smallImageInImage1"
        }
        else if (image === "medium"){
            cssimagesize = "mediumImageInImage1"
        }
        let caption = typeof fields.images.properties("title") !== 'undefined' ? fields.images.properties("title").value : ''

        let imagestyles = ''
        if (typeof fields.images.properties("width") !== 'undefined') {
            imagestyles +=  'width:'+fields.images.properties("width").value + fields.images.properties("unit").value+';'
        }
        if (typeof fields.images.properties("height") !== 'undefined') {
            imagestyles +=  'height:'+fields.images.properties("height").value + fields.images.properties("unit").value+';'
        }

        return `
            <div class="gallery-images container-fluid ${cssimagesize}">
                <div class="image-col">
                    <a class="image" href="${imageSize}">
                        <img src="${imageSize}" class="img-responsive"  crossorigin="anonymous" >
                        <span class="sr-only">${
                            fields.images.properties('image1').alt
                        }</span>  
                        <p style="margin-bottom:30px;"><small>${typeof caption !== "undefined" ? caption : ''}</small></p>
                    </a>
                </div>
            </div>
        `
    }

    _this._afterRender = function () {
        _this.getDOM().magnificPopup({
            delegate: "a.image",
            gallery: {
                enabled: true,
            },
            mainClass: "mfp-fade",
            type: "image",
        });
    }

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

})

DeepScrollPackage.Components.register("images2", function () {
    imagesComponent(this, 2);
});

DeepScrollPackage.Components.register("images3", function () {
    imagesComponent(this, 3);
});

DeepScrollPackage.Components.register("images4", function () {
    imagesComponent(this, 4);
});

DeepScrollPackage.Components.register("video", function () {
    let _this = this;

    _this._render = function (fields) {
        let videoSize = fields.video.properties("sizes").value;
        let cssvideoize = "container";
        if (videoSize === "small") {
            cssvideoize = "container smallvideo";
        } else if (videoSize === "medium") {
            cssvideoize = "container mediumvideo";
        }

        return `
            <div class="${cssvideoize} ${
            fields.video.properties("preventseek").value == "yes"? "prevent-seek": ""}">
                <video class="player" playsinline controls>
                    <source src="${fields.video.properties("video").value}" type="video/mp4" />
                    <track kind="captions" label="captions" src="${fields.video.properties("captions").value || ""}" srclang="en" default />
                </video>
            </div>
        `;
    };

    _this._afterRender = function () {
        _this.getDOM().find(`.player`).each(function () {
            const player = new Plyr(this);
            player.on('ended', (event) => {
                _this.setProgressStatus(100, 100, true, true);
            });
        });
    };

    _this._viewed = function () {
    };
});

DeepScrollPackage.Components.register("video_youtube", function () {
    let _this = this;

    _this._render = function (fields) {
        let videoSize = fields.video.properties("sizes").value;
        let cssvideoize = "container";
        if (videoSize === "small") {
            cssvideoize = "container smallvideo";
        } else if (videoSize === "medium") {
            cssvideoize = "container mediumvideo";
        }

        return `
            <div class="${cssvideoize}  ${
            fields.video.properties("preventseek").value == "yes"
                ? "prevent-seek"
                : ""
        }">
                <div class="player" data-plyr-provider="youtube" data-plyr-embed-id="${
                    fields.video.properties("youtube_video_id").value
                }"></div>
            </div>
        `;
    };

    _this._afterRender = function () {
        _this.getDOM().find(`.player`).each(function () {
            const player = new Plyr(this);
            player.on('ended', (event) => {
                _this.setProgressStatus(100, 100, true, true);
            });
        });
    };

    _this._viewed = function () {
    };
});

DeepScrollPackage.Components.register("video_vimeo", function () {
    let _this = this;

    _this._render = function (fields) {
        let videoSize = fields.video.properties("sizes").value;
        let cssvideoize = "container";
        if (videoSize === "small") {
            cssvideoize = "container smallvideo";
        } else if (videoSize === "medium") {
            cssvideoize = "container mediumvideo";
        }

        return `
            <div class="${cssvideoize}  ${
            fields.video.properties("preventseek").value == "yes"
                ? "prevent-seek"
                : ""
        }">
                <div class="player" data-plyr-provider="vimeo" data-plyr-embed-id="${
                    fields.video.properties("vimeo_video_id").value
                }"></div>
            </div>
        `;
    };

    _this._afterRender = function () {
        _this.getDOM().find(`.player`).each(function () {
            const player = new Plyr(this);
            player.on('ended', (event) => {
                _this.setProgressStatus(100, 100, true, true);
            });
        });
    };

    _this._viewed = function () {
    };
});

DeepScrollPackage.Components.register("audio", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="container ${fields.content.properties('preventseek').value == 'yes' ? 'prevent-seek' : ''}">
            <audio class="player" playsinline controls>
                <source src="${fields.content.properties('audio').value}" type="audio/mp3" />
                <source src="${fields.content.properties('audio').value}" type="audio/ogg" />
            </audio >
        </div>
        `
    }

    _this._afterRender = function () {
        _this.getDOM().find(`.player`).each(function () {
            const player = new Plyr(this);
            player.on('ended', (event) => {
                _this.setProgressStatus(100, 100, true, true);
            });
        });
    };

    _this._viewed = function () {
    };
});

DeepScrollPackage.Components.register("image_compare", function () {
    let _this = this;

    _this._render = function (fields) {
        return `<div id="juxtapose-wrapper" class="juxtapose previewWidth" data-startingposition="50%" data-showlabels="true" data-showcredits="true" data-animate="true" style="margin: 0 auto"></div>`
    };

    _this._afterRender = function () {
        var image_1_text = _this.getPropertyList().content.properties('image_1_text').value
        var image_1 = _this.getPropertyList().content.properties('image_1').value
        var image_1Alt = _this.getPropertyList().content.properties('image_1').alt
        var image_2_text = _this.getPropertyList().content.properties('image_2_text').value
        var image_2 = _this.getPropertyList().content.properties('image_2').value
        var image_2Alt = _this.getPropertyList().content.properties('image_2').alt

        let slider = new juxtapose.JXSlider(`section#section_${_this.getId()} #juxtapose-wrapper`,
            [
                {
                    src: image_1,
                    label: image_1_text,
                    alt: image_1Alt,
                },
                {
                    src: image_2,
                    label: image_2_text,
                    alt: image_2Alt,

                }
            ],
            {
                animate: true,
                showLabels: true,
                showCredits: true,
                startingPosition: "50%",
                makeResponsive: true
            }
        );
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("texts", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="container">
            <div class="edit-text" data-element="paragraph" data-optkey="paragraph" style="${fields.paragraph.styles()}">
                ${fields.paragraph.properties("content").value}
            </div>
        </div>
        `;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

DeepScrollPackage.Components.register("texts2", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="edit-text" data-element="paragraph1" data-optkey="paragraph1" style="${fields.paragraph1.styles()}">
                        ${fields.paragraph1.properties("content").value}
                    </div>
                </div>
                <div class="col-sm-12 col-md-6">
                    <div class="edit-text" data-element="paragraph2" data-optkey="paragraph2" style="${fields.paragraph2.styles()}">
                        ${fields.paragraph2.properties("content").value}
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

DeepScrollPackage.Components.register("statement", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="container">
            <hr class="hr-line" size="2">
            <div class="edit-text" data-element="paragraph" data-optkey="paragraph" style="${fields.paragraph.styles()}">
                ${fields.paragraph.properties("content").value}
            </div>
        </div>
        `;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

DeepScrollPackage.Components.register("note", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
        <div class="container">
            <div class="note_mesg_block">
                <div class="icon"><i class="fas fa-exclamation" aria-hidden="true"></i></div>

                <div class="edit-text" data-element="paragraph" data-optkey="paragraph" style="${fields.paragraph.styles()}">
                    ${fields.paragraph.properties("content").value}
                </div>
            </div>
        </div>
        `;
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };

    _this._afterRender = function () {};
});

DeepScrollPackage.Components.register("line_chart", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
      <div class="container" style="position: relative; height:100%;">
         <h3 class="line-charts">${fields.content.properties("title").value}</h3>
          <div class="chartcontainer">
              <canvas class="chartjs" ></canvas>
          </div>
      </div>`;
    };

    _this._afterRender = function() {
        _this.getDOM().find(`.chartjs`).each(function() {
            let chartdata = _this.getPropertyList().content.properties('datalist').value
            if (_this.chart != null) {
                _this.chart.destroy();
            }

            let mapingValue = chartdata.map((item) => item.number.value);
            let mapingLabel = chartdata.map((item) => item.label.value);
            let mapingcolor = chartdata.map((item) => item.color.value);

            _this.chart =  new Chart(this, {
                "type": "line",
                "data": {
                "labels": mapingLabel,
                "datasets": [{
                    "label": '',
                    "data": mapingValue,
                    "fill": false,
                    "borderColor": mapingcolor,
                    "pointBackgroundColor": mapingcolor,
                    "pointBorderColor": mapingcolor,
                    "segment": {
                        borderColor: ctx => {
                            return mapingcolor[ctx.p0DataIndex]
                        },
                    },
                    "spanGaps": true,
                    "lineTension": 0.2
                }]
                },
                "options": {
                    "scales": {
                    },
                    "plugins": {
                        "legend": {"display": false}
                    },
                    "layout": {
                    }
                }
            })
        })
    }

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("bar_chart", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
      <div class="container" style="position: relative; height:100%;">
      <h3 class="line-charts">${fields.content.properties("title").value}</h3>
          <div class="chartcontainer">
              <canvas class="chartjs" ></canvas>
          </div>
      </div>`;
    };

    _this._afterRender = function() {
        _this.getDOM().find(`.chartjs`).each(function() {
            let chartdata = _this.getPropertyList().content.properties('datalist').value
            if (_this.chart != null) {
                _this.chart.destroy();
            }
            _this.chart =  new Chart(this, {
                "type": "bar",
                "data": {
                "labels": chartdata.map((item) => item.label.value),
                "datasets": [{
                    "label": _this.getPropertyList().content.properties('title').value,
                    "data": chartdata.map((item) => item.number.value),
                    "fill": false,
                    "backgroundColor": chartdata.map((item) => item.color.value),
                }]
                },
                "options": {
                    "scales": {
                        "x": {"grid": {"display": false}},
                        "y": {"grid": {"display": true}}
                    },
                    "plugins": {
                        "legend": {"display": false}
                    },
                    "layout": {"padding": {}},
                    "barPercentage": 0.5,
                    "categoryPercentage": 0.8
                }
            })
        })
    }

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("pie_chart", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
      <div class="container" style="position: relative; height:100%;">
      <h3 class="line-charts">${fields.content.properties("title").value}</h3>
          <div class="chartcontainer">
              <canvas class="chartjs" ></canvas>
          </div>
      </div>`;
    };

    _this._afterRender = function() {
        _this.getDOM().find(`.chartjs`).each(function() {
            let chartdata = _this.getPropertyList().content.properties('datalist').value
            if (_this.chart != null) {
                _this.chart.destroy();
            }
            _this.chart =  new Chart(this, {
                "type": "doughnut",
                "data": {
                "labels": chartdata.map((item) => item.label.value),
                "datasets": [{
                    "label": "",
                    "data": chartdata.map((item) => item.number.value),
                    "backgroundColor": chartdata.map((item) => item.color.value),
                }]
                },
                "options": {
                }
            })
        })
    }

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("table", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
            <div class="container">
                <div class="table-component">
                    <div class="table-responsive">
                        <div id="froala-editor" class="table" edit-element="paragraph" data-optkey="paragraph">
                            ${fields.content.properties('content').value}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _this._afterRender = function () {};

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("list_item", function () {
    let _this = this;

    _this._render = function (fields) {
        let listItemData = _this.getPropertyList().content.properties('list_item_data').value;
        let listType = _this.getPropertyList().content.properties('list_type').value;

        let listHtml = '';
        for (let i = 0; i < listItemData.length; i++) {
            let item = listItemData[i];
            if(listType == 'checkbox_list') {
                listHtml += `
                <li class="list_item">
                    <label class="label--checkbox">
                        <i class="fa-solid fa-check checkitem"></i>
                        ${item.content.value}
                    </label>
                </li>
            `;
            }
            else {
                listHtml += `<li class="li-design animation wow fadeInUp" data-wow-duration="${(i + 2.5)}s" data-wow-delay="0s" data-wow-offset="100">${item.content.value}</li>`;
            }
        }

        if (listType === "ordered") {
            return `
            <div class="container">
                <ol class="ol-design">
                    ${listHtml}
                </ol>
            </div>
        `;
        }
        else if (listType === "unordered") {
            return `
             <div class="container">
                <ul class="ol-designes">
                    ${listHtml}
                </ul>
            </div>
        `;
        }
        else {
            return `
            <div class="container">
                <ul class="list ol-design-check">
                    ${listHtml}
                </ul>
            </div>
        `;
        }
    };

    _this._afterRender = function () {

    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("next_button", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
            <div class="container">
              <div class="button-next">
                <div class="btn-display text-center">
                  <button type="button" class="btn btn-large btn-primary next">${fields.content?.properties("title").value}</button>
                </div>
              </div>
            </div>
        `;
    };

    _this._afterRender = function () {
        let progressStatus = _this.getProgressStatus() || []

        let btnNext = _this.getDOM().find("button.next")
        if(progressStatus.completed) {
            _this.getDOM().hide()
            return
        }
        let value = _this.getPropertyList().content?.properties("next_action").value;
   
        let text = _this.getPropertyList().content?.properties("title").value;
        let disabledtext = _this.getPropertyList().content?.properties("lock_Text").value;

        if (value == 'next_page' && text.toLowerCase() == 'continue') {
            value = 'component_complete_above'
        }
        
        if(value == 'component_complete_above') {
            if(_this.getDOM().prev().hasClass("completed")){
                btnNext.text(text)
                btnNext.removeClass("NextBtn")
                btnNext.prop('disabled', false)
            }
            else{
                btnNext.text('');
                if (btnNext.find('.textAndIcon').length === 0) {
                    // Elements not added yet, so add them
                    const $container = $('<div class="textAndIcon"></div>');
                    const $lockIcon = $('<i class="disableIcon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="33" viewBox="0 0 30 33"><g transform="translate(-3 -1.5)"><path d="M7.5,15h21A4.505,4.505,0,0,1,33,19.5V30a4.505,4.505,0,0,1-4.5,4.5H7.5A4.505,4.505,0,0,1,3,30V19.5A4.505,4.505,0,0,1,7.5,15Zm21,16.5A1.5,1.5,0,0,0,30,30V19.5A1.5,1.5,0,0,0,28.5,18H7.5A1.5,1.5,0,0,0,6,19.5V30a1.5,1.5,0,0,0,1.5,1.5Z"/><path d="M25.5,18A1.5,1.5,0,0,1,24,16.5v-6a6,6,0,0,0-12,0v6a1.5,1.5,0,0,1-3,0v-6a9,9,0,0,1,18,0v6A1.5,1.5,0,0,1,25.5,18Z"/></g></svg></i>');
                    const $paraDiv =     $('<div class="paraDiv"></div>');
                    const $headingText = $(`<h4 class="disabledTag">${disabledtext}</h4>`);
                    $paraDiv.append($headingText);
                    $container.append($lockIcon, $paraDiv);
                    btnNext.prepend($container);
                }
                btnNext.addClass("NextBtn")
                btnNext.attr("disabled", true)
            }
        }

        else if(value == 'component_complete_above_all') {
            let completed = true
            let prevBlocks = _this.getDOM().prevAll()
            for (let index = 0; index < prevBlocks.length; index++) {
                const element = prevBlocks[index];
                if(!$(element).hasClass("completed")) {
                    completed = false
                    break
                }
            }
            if(completed) {
                btnNext.text(text)
                btnNext.removeClass("NextBtn")
                btnNext.prop('disabled', false)
            }
            
            else{
                btnNext.text('');

                if (btnNext.find('.textAndIcon').length === 0) {
                    
                    const $container = $('<div class="textAndIcon"></div>');
                    const $lockIcon = $('<i class="disableIcon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="33" viewBox="0 0 30 33"><g transform="translate(-3 -1.5)"><path d="M7.5,15h21A4.505,4.505,0,0,1,33,19.5V30a4.505,4.505,0,0,1-4.5,4.5H7.5A4.505,4.505,0,0,1,3,30V19.5A4.505,4.505,0,0,1,7.5,15Zm21,16.5A1.5,1.5,0,0,0,30,30V19.5A1.5,1.5,0,0,0,28.5,18H7.5A1.5,1.5,0,0,0,6,19.5V30a1.5,1.5,0,0,0,1.5,1.5Z"/><path d="M25.5,18A1.5,1.5,0,0,1,24,16.5v-6a6,6,0,0,0-12,0v6a1.5,1.5,0,0,1-3,0v-6a9,9,0,0,1,18,0v6A1.5,1.5,0,0,1,25.5,18Z"/></g></svg></i>');
                    const $paraDiv =     $('<div class="paraDiv"></div>');
                    const $headingText = $(`<h4 class="disabledTag">${disabledtext}</h4>`);
                    $paraDiv.append($headingText);
                    $container.append($lockIcon, $paraDiv);
                    btnNext.prepend($container);
                  }
                btnNext.addClass("NextBtn")
                btnNext.prop('disabled', true)
            }
        }

        DeepScrollPackage.listeners.register(DeepScrollPackage.events.ONPROGRESSUPDATE, function(pageId, blockId){
            btnNext.prop('disabled', true)
            if(value == 'component_complete_above') {
                if(_this.getDOM().prev().hasClass("completed")){
                    btnNext.text(text)
                    btnNext.removeClass("NextBtn")
                    btnNext.prop('disabled', false)
                }
            }
            else if(value == 'component_complete_above_all') {
                let completed = true
                let prevBlocks = _this.getDOM().prevAll()
                for (let index = 0; index < prevBlocks.length; index++) {
                    const element = prevBlocks[index];
                    if(!$(element).hasClass("completed")) {
                        completed = false
                        break
                    }
                }
                if(completed) {
                    btnNext.text(text)
                    btnNext.removeClass("NextBtn")
                    btnNext.prop('disabled', false)
                }
            }
        })

        btnNext.click(function (e) {
            e.preventDefault()
            _this.setProgressStatus(100, 100, true, true);

            if (_this.getDOM().next().length == 0 || value == 'next_page') {
                DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: 'next'})
            }
            else {
                console.log("shoowwnext")
                _this.getDOM().hide()
                _this.getDOM().next().show()
                _this.getDOM().nextUntil("section.section-next_button").show()
                _this.getDOM().nextUntil("section.section-next_button").next().show()
                _this.getDOM().next().get(0).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }
        })
    };

    _this._afterPageRender = function () {
        let progressStatus = _this.getProgressStatus() || []
        if(!progressStatus.completed) {
            let btnNext = _this.getDOM().find("button.next")
            let value = _this.getPropertyList().content?.properties("next_action").value;
            if(value == 'component_complete_above' || value == 'component_complete_above_all' || value=='next_page'){
                _this.getDOM().nextAll().hide()
                btnNext.prop('disabled', true)
            }
        }
    };
});

DeepScrollPackage.Components.register("action_button", function () {
    let _this = this;

    _this._render = function (fields) {
        let sizes = fields.content.properties('size').value;
        let csssize = "btn btn-primary btn-large"
        if (sizes === "small") {
            csssize = "btn btn-primary btn-small small"
        }
        else if (sizes === "medium") {
            csssize = "btn btn-primary btn-medium small"
        }

        return `
            <div class="container">
                <div class="button-next">
                    <div class="btn-display text-center">
                    <button type="button" class="  ${csssize} submit">${fields.content.properties('title').value}</button>
                    </div>
                </div>
            </div>
        `;
    }

    _this._afterRender = function () {

        _this.getDOM().find(".submit").on("click", function (e) {
            let value = _this.getPropertyList().content.properties("action_type").value;
            console.log(value)
            if (value.action_type === "web_url") {
                let web_url = value.web_url;
                window.open(web_url);
            } else if (value.action_type === "nextpage") {
                DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: 'next'})
            }else if (value.action_type === "page") {
                DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: value.page})
            } else if (value.action_type === "exit")  {
                window.top.close();
            } else {
                DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: 'next'})
            }
        });
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("action_button_text", function () {
    let _this = this;

    _this._render = function (fields) {
        let sizes = fields.content.properties('size').value;
        let pos = fields.content.properties('position').value;
        let csssize = "btn btn-primary btn-large"
        if (sizes === "small") {
            csssize = "btn btn-primary btn-small"
        }
        else if (sizes === "medium") {
            csssize = "btn btn-primary btn-medium"
        }

        var textBlock = `
        <div class="col-8">
            <h1 class="edit-text heading-edit" data-element="heading" data-optkey="heading" style="${fields.heading.styles()}">
                ${fields.heading.properties("content").value}
            </h1>
            <div class="edit-text" data-element="paragraph" data-optkey="paragraph" style="${fields.paragraph.styles()}">
                ${fields.paragraph.properties("content").value}
            </div>
        </div>`;

        var buttonBlock = `<div class="col-4 d-flex align-items-center justify-content-center">
            <div class="btn-display">
                <button type="button" class="submit ${csssize}">${fields.content.properties('title').value}</button>
            </div>
        </div>`

        if(pos == 'left')
            elements = buttonBlock + textBlock
        else
            elements = textBlock + buttonBlock

        return `
            <div class="container">
              <div class="row" style="max-width: 74rem;padding: 0 3rem;">
              ${elements}
              </div>
            </div>
      `;
    }

    _this._afterRender = function () {

        _this.getDOM().find(".submit").on("click", function (e) {
            let value = _this.getPropertyList().content.properties("action_type").value;
            console.log(value)
            if (value.action_type === "web_url") {
                let web_url = value.web_url;
                window.open(web_url);
            } else if (value.action_type === "nextpage") {
                DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: 'next'})
            }else if (value.action_type === "page") {
                DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: value.page})
            } else if (value.action_type === "exit")  {
                window.top.close();
            } else {
                DeepScrollPackage.listeners.raise(DeepScrollPackage.events.NEXTPAGE, {pageId: 'next'})
            }
        });
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});


DeepScrollPackage.Components.register("accordion", function () {
    let _this = this
    let tabsVisited = {};
    

    _this._render = function (fields) {
        let accordionData = _this.getPropertyList().content.properties('accordion_data').value;
        let accordionHtml = '';

        for (let i = 0; i < accordionData.length; i++) {
            let item = accordionData[i];
            let collapseId = 'collapse' + i;
            let headingId = 'heading' + i;

            let imageHtml = ``
            if(item.image.value != '') {
                imageHtml = `<div class="container img-accordion"><img src="${item.image.value}" class="accordionImg" alt=" ${item.AltValue.value} " crossorigin="anonymous"></div>`
            }
            accordionHtml += `
                <div class="card animation wow fadeInUp">
                  <a class="acr-tittle" href="#." data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="true" aria-controls="${collapseId}">${item.label.value}</a>
                  <div id="${collapseId}" class="collapse" aria-labelledby="${headingId}" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="edit-text">${item.content.value}</div>
                        ${imageHtml}
                    </div>
                  </div>
                </div>
              `;
            tabsVisited[i] = false;
        }

        return `
              <div class="container">
                <div class="accordion sortableAccordion" id="accordionExample">
                  ${accordionHtml}
                </div>
              </div>
            `;
    }

    _this._afterRender = function () {
        let allList = _this.getDOM().find('.accordion .card .acr-tittle')
        const totalTabs = allList.length;
        allList.on("click", function () {
            const tabIndex = allList.index(this);
            tabsVisited[tabIndex] = true;

            if (tabIndex +1 === totalTabs) {
                // Set the last tab as visited if the current tab is the last one
                tabsVisited[totalTabs] = true;
            }
            // Check if all tabs have been visited
            const allVisited = Object.values(tabsVisited).every(visited => visited);
            if (allVisited) {
                _this.setProgressStatus(100, 100, true, true);
            } else {
                _this.setProgressStatus(100, 100, false, true);
            }
        })
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, completed, true);
    };
});

DeepScrollPackage.Components.register("flip_cards", function() {
    let _this = this;
    var completed = false;
    var cardLength = 0;
    var cardFlipped = [];

    _this._render = function (fields) {
        
        let flipCardData = _this.getPropertyList().content.properties('flip_card_data').value
        let flipCardHtml = '';
        cardLength = flipCardData.length;
        for (let i = 0; i < flipCardData.length; i++) {
            let item = flipCardData[i];
            flipCardHtml += `
                <div class="col-md-4">
                    <div class="flip-cards animation wow flipInX" data-wow-duration="1s" data-wow-delay="0.4s">
                        <article class="panel">

                        ${item.front.type === 'image'
                            ? `  <div class="front card flipcard" title="${item.front.text}" style="background-image: url('${item.front.image !== "0" && item.front.image !== "no-image" ? item.front.image : document.location.origin + '/assets/images/block-bg-img.jpg'}'); background-position: center; background-size: cover;">
                                    <a href="#." class="rotatecard">
                                        <span class="flii-icon"></span>
                                    </a>
                                </div>
                                `
                            : `
                                <div class="front card flipcard">
                                    <div class="position-c-c"> <div class="edit-text"> <h4>${item.front.text}</h4></div></div>
                                        <a href="#." class="rotatecard">
                                            <span class="flii-icon"></span>
                                        </a>
                                </div>
                            `
                        }

                        ${item.back.type === "image"
                            ? `<div class="back card flipcardback" title="${item.back.text}" style="background-image: url('${item.back.image !== "0" && item.back.image !== "no-image" ? item.back.image : document.location.origin + '/assets/images/block-bg-img.jpg'}'); background-position: center; background-size: cover;">
                                    <a href="#." class="rotatecardback">
                                        <span class="flii-icon"></span>
                                    </a>
                               </div>
                               `
                            : `
                                <div class="back card flipcardback">
                                    <div class="position-c-c"><div class="edit-text"><h4>${item.back.text}</h4></div></div>
                                    <a href="#." class="rotatecardback">
                                        <span class="flii-icon"></span>
                                    </a>
                                </div>
                            `
                        }
                        </article>
                    </div>
                </div>
            `
        }
        cardFlipped = new Array(cardLength).fill(false);
        return `
            <div class="container">
                <div class="row flipCardData">${flipCardHtml}</div>
            </div>
        `;
    }

    _this._afterRender = function () {
        _this.getDOM().find(".rotatecard").click(function (e) {
            e.preventDefault()

            const cardIndex = $(this).closest(".col-md-4").index();
            $(this).parents(".front").toggleClass("flipped");
            if (!cardFlipped[cardIndex]) { // Check if the card is not already flipped
                cardFlipped[cardIndex] = true; // Mark the card as flipped
            }
            $(this).parentsUntil(".panel").next(".back").toggleClass("backflip");
            checkCompletion();
            
        })
        _this.getDOM().find(".rotatecardback").click(function (e) {
            e.preventDefault()
            $(this).parentsUntil(".panel").prev(".front").toggleClass("flipped");
            $(this).parents(".back").toggleClass("backflip");
        })

        _this.getDOM().find(".flipcard").click(function (e) {
            e.preventDefault()

            const cardIndex = $(this).closest(".col-md-4").index();
            $(this).toggleClass("flipped");
            if (!cardFlipped[cardIndex]) { // Check if the card is not already flipped
                cardFlipped[cardIndex] = true; // Mark the card as flipped
            }
            $(this).parents(".panel").find(".back").toggleClass("backflip");
            checkCompletion();
        })
        _this.getDOM().find(".flipcardback").click(function (e) {
            e.preventDefault()
            $(this).parents(".panel").find(".front").toggleClass("flipped");
            $(this).toggleClass("backflip");
        })

    }

    function checkCompletion() {
        if (cardFlipped.every(flipped => flipped)) {
            completed = true; 
        }
        _this.setProgressStatus(100, 100, completed, true);
    }
    


    _this._viewed = function () {
        _this.setProgressStatus(100, 100, completed, true);
    };
});

DeepScrollPackage.Components.register("check_multi_answer", function () {
    let _this = this;

    _this._render = function (fields) {
        let question = _this.getPropertyList().content.properties('question').value;
        let answeroptions = _this.getPropertyList().content.properties('answer').value;

        let optionsHtml = '';
        for (let i = 0; i < answeroptions.length; i++) {
            let option = answeroptions[i];
            optionsHtml += `
            <div class="question__elem--wrapper">
                <div class="elem__question">
                    <label class="container__check">
                        <input id="checkbox2-${option.id.value}" class="checkbox styled check1" name="radio-${_this.getId()}" type="checkbox" value="${option.id.value}" data-correct="${option.id.checked ? 'true' : 'false'}">
                        <span class="checkmark"></span>
                        ${option.content.value}
                    </label>
                </div>
            </div>
            `;
        }
        return `
            <div class="question-section-check">
                <div class="container">
                    <p> ${question}</p>
                    <form>
                        <div class="questions__checks">
                            ${optionsHtml}
                        </div>
                        <div class="status__quiz" id="feedbackContainer"  style="display:none;">
                            <div class="top__status">
                                <div class="check" id="icon">
                                </div>
                                <span></span>
                                <p id="feedbackText" class="text-center"></p>
                            </div>
                        </div>
                        
                        <div class="submit__quiz">
                            <button type="button" class="btn btn-primary" id="btnSubmit">${window._tx('Submit', 'Submit')}</button>
                        </div>
                        <div class="next__quiz--wrapper retryContainer" style="display:none;">
                            <div class="take__again">
                                <a href="javascript:;" id="btnRetry">TAKE AGAIN <span><i class="fa fa-2x fa-rotate-right"></i></span></a>
                            </div>
                        </div>
                    </form>
                    
                </div>
            </div>
        `;
    };


    _this._afterRender = function () {
        let init = false
        // 1. Get the Progress State from getProgressData().
        let progressData = _this.getProgressData() || []
        let progressStatus = _this.getProgressStatus() || []

        // 2. Initiate the Block Functionality.
        let feedback = _this.getPropertyList().content.properties("feedback").value;

        _this.getDOM().find("#btnRetry").on("click", function (e) {
            _this.getDOM().find(".question__elem--wrapper").removeClass("success").removeClass('error');
            _this.getDOM().find(".elem__question").removeClass('current');
            _this.getDOM().find(".elem__question input").prop("checked" ,false);
            _this.getDOM().find("form input").attr("disabled", false);
            _this.getDOM().find(".submit__quiz").fadeIn(300);
            _this.getDOM().find(".status__quiz").removeClass("show").fadeOut(300);
            _this.getDOM().find("#feedbackText").html("");
            _this.getDOM().find('.check').removeClass("show");
            _this.getDOM().find('.next__quiz--wrapper').fadeOut(300);
            _this.getDOM().find('#icon').attr("");
            _this.setProgressData('')
            _this.setProgressStatus(0, 0, false, false);
        });

        let allOptions = _this.getDOM().find('input[type="checkbox"]');
        let selectedItems = [];
        _this.getDOM().find('form input').on("change", function () {
            selectedItems = [];
            allOptions.each(function(index) {
                if ($(this).is(':checked')) {
                    selectedItems.push(index);
                }
            });
        });

        _this.getDOM().find("#btnSubmit").on("click", function (e) {
            e.preventDefault();
            $(this).parents(".submit__quiz").hide();
            let allOptions = _this.getDOM().find('input[type="checkbox"]');
            let correctOptions = [];
            let selectedItems = [];
            allOptions.each(function (index) {
                if ($(this).data('correct') == true) {
                    correctOptions.push(index);
                }
                if ($(this).is(':checked')) {
                    let status = correctOptions.includes(index) ? 'success':'error'
                    $(this).parents(".question__elem--wrapper").addClass(status)
                    selectedItems.push(index);
                }
            });
            let correct = JSON.stringify(selectedItems) == JSON.stringify(correctOptions) ? true : false
            
            setTimeout(() => {
                _this.getDOM().find(".status__quiz").fadeIn(300).addClass("show");

                if (correct) {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").text("Correct");
                    _this.getDOM().find("#feedbackText").html(feedback.correct_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                }
                else {
                    _this.getDOM().find('#icon').html('<i class="fa fa-xmark fa-2x text-danger"></i>');
                    _this.getDOM().find(".top__status>span").text("Incorrect");
                    _this.getDOM().find("#feedbackText").html(feedback.incorrect_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                }

                if (feedback.type == "any") {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").hide()
                    _this.getDOM().find("#feedbackText").html(feedback.any_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                } else {
                    _this.getDOM().find(".top__status>span").show()
                }

                _this.getDOM().find("form input").attr("disabled", true);

                _this.getDOM().find('.next__quiz--wrapper').fadeIn(300);

                $(window).trigger("resize");
                setTimeout(function(){
                    $(window).trigger("resize");
                }, 200);
                setTimeout(() => {
                    _this.getDOM().find('.top__status .check').addClass('show');
                }, 250);
            }, 800);

            if(init) {
                _this.setProgressData(selectedItems)
                _this.setProgressStatus(100, 100, true, correct);
            }
        });

        if(progressStatus.completed == true) {
            for (const key in progressData) {
                if (Object.hasOwnProperty.call(progressData, key)) {
                    const element = progressData[key];
                    _this.getDOM().find("input[type='checkbox'][value='" + element + "']").prop("checked","true");
                }
            }
            _this.getDOM().find("#btnSubmit").click()
        }
        init = true
    };

    _this._viewed = function () {
    };
});

DeepScrollPackage.Components.register("check_single_answer", function () {
    let _this = this;

    _this._render = function (fields) {
        let question = _this.getPropertyList().content.properties('question').value;
        let answeroptions = _this.getPropertyList().content.properties('answer').value;

        let optionsHtml = '';
        for (let i = 0; i < answeroptions.length; i++) {
            let option = answeroptions[i];
            optionsHtml += `
                <div class="question__elem--wrapper">
                    <div class="elem__question">
                        <label class="container__radio">
                            <input type="radio" id="checkbox3-${option.id.value}" value="${option.id.value}" data-correct="${option.id.checked ? 'true' : 'false'}">
                            <span class="checkmark__radio"></span>
                            ${option.content.value}
                        </label>
                    </div>
                </div>
            `;
        }

        return `
            <div class="question-section-check">
                <div class="container">
                    <p> ${question}</p>
                    <form>
                        <div class="questions__radio">
                            ${optionsHtml}
                        </div>
                        <div class="status__quiz" id="feedbackContainer"  style="display:none;">
                            <div class="top__status">
                                <div class="check" id="icon">
                                    
                                </div>
                                <span></span>
                                <p id="feedbackText" class="text-center"></p>
                            </div>
                        </div>
                        
                        <div class="submit__quiz">
                            <button type="button" class="btn btn-primary" id="btnSubmit">${window._tx('Submit', 'Submit')}</button>
                        </div>
                        <div class="next__quiz--wrapper retryContainer" style="display:none;">
                            <div class="take__again">
                                <a href="javascript:;" id="btnRetry">TAKE AGAIN <span><i class="fa fa-2x fa-rotate-right"></i></span></a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    };

    _this._afterRender = function () {
        let init = false
        // 1. Get the Progress State from getProgressData().
        let progressData = _this.getProgressData() || []
        let progressStatus = _this.getProgressStatus() || []

        // 2. Initiate the Block Functionality.
        let feedback = _this.getPropertyList().content.properties("feedback").value;

        _this.getDOM().find("#btnRetry").on("click", function (e) {
            _this.getDOM().find(".question__elem--wrapper").removeClass("success").removeClass('error');
            _this.getDOM().find(".elem__question").removeClass('current');
            _this.getDOM().find(".elem__question input").prop("checked" ,false);
            _this.getDOM().find("form input").attr("disabled", false);
            _this.getDOM().find(".submit__quiz").fadeIn(300);
            _this.getDOM().find(".status__quiz").removeClass("show").fadeOut(300);
            _this.getDOM().find("#feedbackText").html("");
            _this.getDOM().find('.check').removeClass("show");
            _this.getDOM().find('.next__quiz--wrapper').fadeOut(300);
            _this.getDOM().find('#icon').attr("");
            _this.setProgressData('')
            _this.setProgressStatus(0, 0, false, false);
        });

        _this.getDOM().find('form input').on("click", function () {
            const $parent = $(this).parents(".elem__question")
            $parent.parents(".questions__radio").find("input").prop('checked' ,false);
            $parent.parents(".questions__radio").find(".current").removeClass('current');

            $parent.find('input').prop('checked' ,true);
            $parent.addClass('current');
        });

        _this.getDOM().find("#btnSubmit").on("click", function (e) {
            e.preventDefault();
            $(this).parents(".submit__quiz").hide();
            let selectedOption = _this.getDOM().find('input[type="radio"]:checked');
            let correct = $(selectedOption).data("correct") == true

            selectedOption.parents(".question__elem--wrapper").addClass(correct?'success':'error')

            let img_path = document.location.origin + '/apps/_deepscrollmaster/content/img/';
            setTimeout(() => {
                _this.getDOM().find(".status__quiz").fadeIn(300).addClass("show");

                if (correct) {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").text("Correct");
                    _this.getDOM().find("#feedbackText").text(feedback.correct_text);
                }
                else {
                    _this.getDOM().find('#icon').html('<i class="fa fa-xmark fa-2x text-danger"></i>');
                    _this.getDOM().find(".top__status>span").text("Incorrect");
                    _this.getDOM().find("#feedbackText").text(feedback.incorrect_text);
                }

                if (feedback.type == "any") {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").hide()
                    _this.getDOM().find("#feedbackText").html(feedback.any_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                } else {
                    _this.getDOM().find(".top__status>span").show()
                }
                _this.getDOM().find("form input").attr("disabled", true);
                _this.getDOM().find('.next__quiz--wrapper').fadeIn(300);

                $(window).trigger("resize");
                setTimeout(function(){
                    $(window).trigger("resize");
                }, 200);
                setTimeout(() => {
                    _this.getDOM().find('.top__status .check').addClass('show');
                }, 250);
            }, 800);

            if(init) {
                _this.setProgressData(selectedOption.val())
                _this.setProgressStatus(100, 100, true, correct);
            }
        });

        if(progressStatus.completed == true) {
            for (const key in progressData) {
                if (Object.hasOwnProperty.call(progressData, key)) {
                    const element = progressData[key];
                    _this.getDOM().find("input[type='radio'][value='" + element + "']").prop("checked","true");
                }
            }
            _this.getDOM().find("#btnSubmit").click()
        }
        init = true
    };

    _this._viewed = function () {};
});

DeepScrollPackage.Components.register("fill_in_the_blank", function () {
    let _this = this;

    _this._render = function (fields) {
        let question = _this.getPropertyList().content.properties('question').value;
        let answer = _this.getPropertyList().content.properties("answer").value;
        return `
            <div class="question-section-type">
                <div class="container">
                    <h3 class="edit-text"> ${question}</h3>
                    <form class="d-flex single__step">
                        <div class="question__input">
                            <span id="iconspan"></span>
                            <input type="text" id="txtAnswer" placeholder="${window._tx('type_your_answer_here', 'Type your answer here')}" data-correct="${answer}">
                            <label style="display:none;" tabindex="0">Acceptable responses: </label>
                        </div>
                        <div class="status__quiz" id="feedbackContainer"  style="display:none;">
                            <div class="top__status">
                                <div class="check" id="icon">
                                </div>
                                <span></span>
                                <p id="feedbackText" class="text-center"></p>
                            </div>
                        </div>
                        
                        <div class="submit__quiz">
                            <button type="button" class="btn btn-primary" id="btnSubmit">${window._tx('Submit', 'Submit')}</button>
                        </div>
                        <div class="next__quiz--wrapper retryContainer" style="display:none;">
                            <div class="take__again">
                                <a href="javascript:;" id="btnRetry">TAKE AGAIN <span><i class="fa fa-2x fa-rotate-right"></i></span></a>
                            </div>
                        </div>
                    </form>
                    
                </div>
            </div>
        `;
    };
    _this._afterRender = function () {
        let init = false
        // 1. Get the Progress State from getProgressData().
        let progressData = _this.getProgressData() || []
        let progressStatus = _this.getProgressStatus() || []

        // 2. Initiate the Block Functionality.
        let feedback = _this.getPropertyList().content.properties("feedback").value;

        _this.getDOM().find("#btnRetry").on("click", function (e) {
            _this.getDOM().find("#txtAnswer").val('');
            const $el = _this.getDOM().find("#txtAnswer").parents(".question__input")
            $el.removeClass("answered")
            $el.find("#iconspan").html("").hide()
            
            _this.getDOM().find(".question__input>label").fadeOut(300);
            _this.getDOM().find(".submit__quiz").fadeIn(300);
            _this.getDOM().find(".status__quiz").removeClass("show").fadeOut(300);
            _this.getDOM().find("#feedbackText").html("");
            _this.getDOM().find('.check').removeClass("show");
            _this.getDOM().find('.next__quiz--wrapper').fadeOut(300);
            _this.getDOM().find('#icon').html("");

            _this.getDOM().find("form input").attr("disabled", false);

            _this.setProgressData('')
            _this.setProgressStatus(0, 0, false, false);
        });

        _this.getDOM().find("#btnSubmit").on("click", function (e) {
            e.preventDefault();
            $(this).parents(".submit__quiz").hide();

            let userAnswer = _this.getDOM().find("#txtAnswer").val().toLowerCase()
            let correctAnswer = _this.getDOM().find("#txtAnswer").data('correct')
            let correct = userAnswer == correctAnswer.toLowerCase();

            _this.getDOM().find(".question__input>label").html("Acceptable answer: "+correctAnswer).fadeIn(300);

            const $el = _this.getDOM().find("#txtAnswer").parents(".question__input")
            $el.addClass("answered")
            
            setTimeout(() => {
                _this.getDOM().find(".status__quiz").fadeIn(300).addClass("show");

                if (correct) {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").text("Correct");
                    _this.getDOM().find("#feedbackText").text(feedback.correct_text);
                }
                else {
                    _this.getDOM().find('#icon').html('<i class="fa fa-xmark fa-2x text-danger"></i>');
                    _this.getDOM().find(".top__status>span").text("Incorrect");
                    _this.getDOM().find("#feedbackText").text(feedback.incorrect_text);
                }

                if (feedback.type == "any") {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").hide()
                    _this.getDOM().find("#feedbackText").html(feedback.any_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                } else {
                    _this.getDOM().find(".top__status>span").show()
                }
                
                _this.getDOM().find("form input").attr("disabled", true);
                
                _this.getDOM().find('.next__quiz--wrapper').fadeIn(300);

                $(window).trigger("resize");
                setTimeout(function(){
                    $(window).trigger("resize");
                }, 200);
                setTimeout(() => {
                    _this.getDOM().find('.top__status .check').addClass('show');
                }, 250);
            }, 800);
            if(init) {
                _this.setProgressData(userAnswer)
                _this.setProgressStatus(100, 100, true, correct);
            }
        });

        if(progressStatus.completed == true) {
            _this.getDOM().find("#txtAnswer").val(progressData);
            _this.getDOM().find("#btnSubmit").click()
        }
        init = true
    };

    _this._viewed = function () {};
});

DeepScrollPackage.Components.register("matching", function () {
    let _this = this

    _this._render = function (fields) {
        let progressData = _this.getProgressData() || []
        let progressStatus = _this.getProgressStatus() || []

        let question = _this.getPropertyList().content.properties('question').value;
        let answeroptions = _this.getPropertyList().content.properties('answer').value;

        let OptionsHtml = ``;
        let matchingChoice = ``;
        let matchingOption = ``;

        let choicesArray = [...answeroptions].sort(() => Math.random() - 0.5);

        if(progressStatus.completed == true && answeroptions.length == progressData.length) {
            // console.log(keyValue); console.log(answers); console.log(progressData)
            let objlist = answeroptions.reduce((obj, item) => {return { ...obj, [item['id'].value]: item };}, {});
            choicesArray = []
            for (const key in progressData) {
                if (Object.hasOwnProperty.call(progressData, key)) {
                    const element = progressData[key];
                    choicesArray.push(objlist[element])
                }
            }
        }

        for (const key in answeroptions) {
            const option = answeroptions[key];
            let choiceObj = choicesArray[key] != undefined?choicesArray[key]:answeroptions[key]
            matchingOption += `
                <div class="elem answer" style="max-width:100%;" tabindex="0" data-true-index="${choiceObj.id.value}" id="q${_this.getId()}-${choiceObj.id.value}" key="${choiceObj.id.value}">
                    <div class="info">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"></path></svg>
                        <span>${choiceObj.lefttext.value}</span>
                    </div>
                </div>
            `;
            matchingChoice += `
                <div class="elem" style="max-width:100%;">
                    <div class="info">
                        <span class="text-secondary">${option.righttext.value || 'empty'}</span>
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

        return `
            <div class="matching-component">
                <div class="container">
                    <div class="intro-tittle-sec"><h3>${question}</h3></div>
                    <form class="single__step">
                        ${OptionsHtml}
                        
                        <div class="submit__quiz">
                            <button type="button" class="btn btn-primary" id="btnSubmit">${window._tx('Submit', 'Submit')}</button>
                        </div>
                        <div class="next__quiz--wrapper retryContainer" style="display:none;">
                            <div class="take__again">
                                <a href="javascript:;" id="btnRetry">TAKE AGAIN <span><i class="fa fa-2x fa-rotate-right"></i></span></a>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        `;
    }

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

    _this._afterRender = function () {
        let init = false
        // 1. Get the Progress State from getProgressData().
        let progressData = _this.getProgressData() || []
        let progressStatus = _this.getProgressStatus() || []

        // 2. Initiate the Block Functionality.
        let feedback = _this.getPropertyList().content.properties("feedback").value;
        let answeroptions = _this.getPropertyList().content.properties('answer').value;

        _this.getDOM().find("#btnRetry").on("click", function (e) {
            _this.getDOM().find(".dropUL").sortable('enable');
            _this.getDOM().find(".submit__quiz").fadeIn(300);
            _this.getDOM().find(".status__quiz").removeClass("show").fadeOut(300);
            _this.getDOM().find("#feedbackText").html("");
            _this.getDOM().find('.check').removeClass("show");
            _this.getDOM().find('.next__quiz--wrapper').fadeOut(300);
            _this.getDOM().find('#icon').attr("");
            _this.getDOM().find(".number").remove();

            let matchingOption = ``;
            let choicesArray = [...answeroptions].sort(() => Math.random() - 0.5);
            for (const key in answeroptions) {
                let choiceObj = choicesArray[key] != undefined?choicesArray[key]:matchingData[key]
                matchingOption += `
                    <li id="q${_this.getId()}-${choiceObj.id.value}" class="ui-state-default">
                        <span class="matchingHand" id="matchingSortable"><i class="far fa-hand text-secondary" style="font-size:20px;"></i></span>
                        <div class="dragElement dropElement answer" key=${choiceObj.id.value}>
                            <span>${choiceObj.lefttext.value || 'empty'}</span>
                        </div>
                    </li>
                `;
            }
            // _this.getDOM().find("ul#dropUL").html(matchingOption);
            _this.setProgressData([])
            _this.setProgressStatus(0, 0, false, false);
        });

        _this.getDOM().find(".dropUL").sortable({
            update: function (event, ui) {
                _this.rearrangeHeight()
            },
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
        _this.getDOM().find(".dropUL").ksortable();

        _this.getDOM().find("#btnSubmit").on("click", function (e) {
            e.preventDefault();
            $(this).parents(".submit__quiz").hide();
            _this.getDOM().find(".dropUL").sortable('disable');

            let selectedItems = [];
            _this.getDOM().find(".answer").each(function (index, value) {
                selectedItems.push($(this).attr("key"));
            });
            let correctCount = 0;
            let img_path = document.location.origin + '/apps/_deepscrollmaster/content/img/';
            for (let i = 0; i < selectedItems.length; i++) {

                let elem = _this.getDOM().find(`#q${_this.getId()}-${selectedItems[i]}`);
                let newEL = $("<span class='number' data-id=" + $(elem).attr("id") + "><img src='' crossorigin='anonymous'></span>");
                
                _this.getDOM().find(`#q${_this.getId()}-${selectedItems[i]} i b`).remove();
                if (answeroptions[i].id.value.toString() === selectedItems[i]) {
                    correctCount++
                    $(newEL).find("img").attr("src", img_path + "successwhite.png");
                } else {
                    $(newEL).find("img").attr("src" , img_path+"incorrectwhite.png");
                }
                _this.getDOM().append(newEL);
                $('.number:last-child').css("left" , $(elem).find(".info>svg").offset().left - 30);
                $('.number:last-child').css("top" , $(elem).find(".info>svg").offset().top - 160 - 3);
            }

            let correct = correctCount == answeroptions.length;

            setTimeout(() => {
                _this.getDOM().find(".status__quiz").fadeIn(300).addClass("show");

                if (correct) {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").text("Correct");
                    _this.getDOM().find("#feedbackText").text(feedback.correct_text);
                }
                else {
                    _this.getDOM().find('#icon').html('<i class="fa fa-xmark fa-2x text-danger"></i>');
                    _this.getDOM().find(".top__status>span").text("Incorrect");
                    _this.getDOM().find("#feedbackText").text(feedback.incorrect_text);
                }

                if (feedback.type == "any") {
                    _this.getDOM().find('#icon').html('<i class="fa fa-check fa-2x text-primary"></i>');
                    _this.getDOM().find(".top__status>span").hide()
                    _this.getDOM().find("#feedbackText").html(feedback.any_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                } else {
                    _this.getDOM().find(".top__status>span").show()
                }

                
                _this.getDOM().find("form input").attr("disabled", true);
                
                _this.getDOM().find('.next__quiz--wrapper').fadeIn(300);

                $(window).trigger("resize");
                setTimeout(function(){
                    $(window).trigger("resize");
                }, 200);
                setTimeout(() => {
                    _this.getDOM().find('.top__status .check').addClass('show');
                }, 250);
            }, 800);

            if(init) {
                _this.setProgressData(selectedItems)
                _this.setProgressStatus(100, 100, true, correct);
            }
        });

        if(progressStatus.completed == true) {
            _this.getDOM().find("#txtAnswer").val(progressData);
            _this.getDOM().find("#btnSubmit").click()
        }
        init = true
    }
    _this._viewed = function () {

    };
});

DeepScrollPackage.Components.register("process", function() {
    let _this = this;
    var completed = false;
    _this._render = function (fields) {
        let processData = _this.getPropertyList().content.properties('process_data').value;
        let processHtml = '';

        processData.forEach(item => {

            let imageHtml = ``
            if(item.image.value != '') {
                imageHtml = ` <div class="processImage">
                    <img class="processImg" src="${item.image.value}" alt="${item.AltValue.value}" crossorigin="anonymous">
                </div>`
            }

            processHtml += `
                <div class="swiper-slide">
                    <div class="process-slide">
                        <h3>${item.label.value}</h3>
                        ${imageHtml}
                        <p>${item.content.value}</p>
                    </div>
                </div>
            `
        });

        return `
            <div class="swiper process-swiper mySwiper container">
                <div class="swiper-wrapper">
                    ${processHtml}
                </div>
                <div class="swiper-button-next process-next-btn"></div>
                <div class="swiper-button-prev process-prev-btn"></div>
                <div class="swiper-pagination"></div>
            </div>
        `;
    };

    _this._afterRender = function() {
        _this.getDOM().find(`.mySwiper`).each(function() {
            _this.chart =  new Swiper(this, {
                autoHeight: true,
                spaceBetween: 20,
                navigation: {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                },
                pagination: {
                  el: ".swiper-pagination",
                  type: "progressbar",
                  clickable: true,
                },
            })

            _this.chart.on('progress', function(progress) {
                if (progress.progress === 1) {
                    completed = true;
                } else {
                    completed = false;
                }
                _this.setProgressStatus(100, 100, completed, true);
            });
            
        })
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, completed, true);
    };
});

DeepScrollPackage.Components.register("sorting", function () {
    let _this = this

    _this._render = function (fields) {
        let boxdata = _this.getPropertyList().content.properties('sorting_data').value;

        let boxHtml = '';
        let cardsHtml = '';
        for (let i = 0; i < boxdata.length; i++) {
            let boxData = boxdata[i];
            boxHtml += `<div class="cardbox ui-droppable" data-key="${boxData.id}">${boxData.label}</div>`
            for (const key in boxData.items) {
                const card = boxData.items[key];
                cardsHtml += `<div class="card ui-draggable" data-key="${card.id}" data-dropto="${boxData.id}">${card.label}</div>`
            }
        }

        return `
            <div class="container">
                <form>
                    <div class="cards">
                        ${cardsHtml}
                    </div>
                    <div class="cardboxes">
                        ${boxHtml}
                    </div>
                </form>
                <div class="feedbackContainer" id="feedbackContainer" >
                    <div class="feedback" id="feedbackText">You did it!</div>
                    <div class="retryContainer">
                        <h4 class="textAgain">Take Again</h4>
                        <i class="re-try" id="btnRetry"></i>
                    </div>
                </div>
            </div>
        `;
    }

    _this._afterRender = function () {
        let init = false
        // 1. Get the Progress State from getProgressData().
        let progressData = _this.getProgressData() || []
        let progressStatus = _this.getProgressStatus() || []

        // 2. Initiate the Block Functionality.
        //let feedback = _this.getPropertyList().content.properties("feedback").value;

        _this.getDOM().find("#btnRetry").on("click", function (e) {
            _this.getDOM().find("form input").attr("disabled", false);
            _this.getDOM().find("#btnSubmit").prop("disabled", true);
            _this.getDOM().find("#feedbackContainer").css("display", "none");
            _this.getDOM().find(".cards div.card").removeClass("correct").css({ top: "", left: "" }).fadeIn(200);
            _this.setProgressData('')
            _this.setProgressStatus(0, 0, false, false);
        });
        _this.getDOM().find(".cards div.card").draggable({
            containment: "#"+ _this.getDOM().attr("id"),
            revert: true
        })

        _this.getDOM().find(".cardboxes .cardbox").droppable({
            accept: _this.getDOM().find('div.card'),
            hoverClass: 'hovered',
            drop: function (event, ui) {
                console.log(ui)

                var card = $(ui.draggable)
                var cardbox = $(event.target);
                if(card.data("dropto") == cardbox.data("key")) {
                    ui.draggable.draggable('option', 'revert', false);
                    ui.draggable.addClass('correct');
                    ui.draggable.fadeOut(500);

                }

                if(_this.getDOM().find(".cards div.card.correct").length == _this.getDOM().find(".cards div.card").length) {
                    _this.getDOM().find("#feedbackContainer").css("display", "block");
                    _this.setProgressStatus(100, 100, true, true);
                    $('body, html').animate({scrollTop: _this.getDOM().find("#feedbackContainer").offset().top});
                }
            }
        });

        if(progressStatus.completed == true) {
            _this.getDOM().find(".cards div.card").addClass("correct").css({ top: "", left: "" }).fadeOut(0);
            _this.getDOM().find("#feedbackContainer").css("display", "block");
        }
        init = true

    }
    _this._viewed = function () {};
});

DeepScrollPackage.Components.register("hotspot", function () {
    let _this = this;
    let tabsVisited = {};
    let completed = false

    _this._render = function (fields) {
        var image1Caption = fields.content.properties('background-image').value;
        var image1alt = fields.content.properties('background-image').alt;
        return `
          <div class="container">
                <div class="hotspot-component">
                    <div class="mapperhub">
                        <img src="${image1Caption}" class="imageCaption" alt="${image1alt}" crossorigin="anonymous"/>
                    </div>
                </div>
          </div>
        `;
    };

    _this._afterRender = function () {
        const itemContainer = _this.getDOM().find(".mapperhub > img");

        let hotspotIcon = _this.getPropertyList().content.properties('hotspot_icon').value
        let icon;
        if (hotspotIcon === "+") {
            icon = "+";
        }

        let updateHostspots = function () {
            let hotspotData = _this.getPropertyList().content.properties('hotspot_data').value;
            let containerWidth = _this.getDOM().find('.mapperhub').width();
            let containerHeight = _this.getDOM().find('.mapperhub').height();

            let setHotspotPosition = function(index, item) {
                let itemDom = _this.getDOM().find(`.mapperhub-item${_this.getId()}_${index}`);
                let positionTop = parseFloat(item.positionTop)
                let positionLeft = parseFloat(item.positionLeft)

                $(itemDom).css({
                    top: positionTop * containerHeight,
                    left: positionLeft * containerWidth
                });

                
            }

            let setupHotSpotItem = function (index, item) {
        
                let itemHtml = `<div class="mapperhub-item mapperhub-item${_this.getId()}_${index}"> <a class="marker marker${_this.getId()}_${index} hubsopt-pointer" href="#marker${_this.getId()}_${index}">${icon || index}</a><aside id="marker${_this.getId()}_${index}" class="mapperhub-popup">
                        <p class="edit-text">${item.description}</p>
                        </aside>
                    </div>`;
                
                tabsVisited['#marker'+_this.getId()+'_'+index] = false;

                var itemDom = $(itemHtml);
                itemDom.insertBefore(itemContainer);

                setHotspotPosition(index, item)

                $(itemDom).on('click', function (e) {
                    $('.hotspotPopover').popover('hide');
                });

                jQuery(function ($) {
                    var pop = $('.mapperhub-popup');
                    pop.click(function (e) {
                        e.stopPropagation();
                        
                    });
            
                    $('a.marker').click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).next('.mapperhub-popup').addClass('open');
                        $(this).parent().siblings().children('.mapperhub-popup').removeClass('open');
                        tabsVisited[$(this).attr("href")] = true;

                        const allVisited = Object.values(tabsVisited).every(visited => visited);
                        
                        if (allVisited) {
                            _this.setProgressStatus(100, 100, true, true);
                        } else {
                            _this.setProgressStatus(100, 100, false, true);
                        }
                    });
            
                    $(document).click(function () {
                        if(!$(this).hasClass("mapperhub-popup"))
                            pop.removeClass('open');
                    });
            
                    pop.each(function () {
                        var w = $(window).outerWidth(),
                            edge = Math.round(($(this).offset().left) + ($(this).outerWidth()));
                        if (w < edge) {
                            $(this).addClass('edge');
                        }
                    });
                });

                // $(itemDom).popover({
                //     html: true,
                //     content: '<div class="next-back"><i class="fa-solid fa-chevron-left previous-hotspot"></i> <i class="fa-solid fa-chevron-right next-hotspot"></i></div>'+item.description,
                //     // <a href="javascript:;" class="popoverClose"><span>×</span></a>
                //     template: '<div class="popover hotspotPopover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                //     container: _this.getDOM().find('.image-wrapper'),
                // }).on('shown.bs.popover', function () {
                //     itemDom.removeClass('pulse')
                //     $('.hotspotPopover .previous-hotspot').on('click', function() {
                //         itemDom.prev('.draggable-circle').trigger('click')
                //     })
                //     $('.hotspotPopover .next-hotspot').on('click', function() {
                //         itemDom.next('.draggable-circle').trigger('click')
                //     })
                // });
            }

            $(itemContainer).find(".draggable-circle").remove()
            for (const key in hotspotData) {
                const item = hotspotData[key];
                setupHotSpotItem(parseInt(key) + 1, item)
                
            }

            let oldContainerWidth = containerWidth
            $(window).resize(function(){
                containerWidth = _this.getDOM().find('.mapperhub').width();
                containerHeight = _this.getDOM().find('.mapperhub').height();
                if(oldContainerWidth != containerWidth) {
                    oldContainerWidth = containerWidth
                    for (const key in hotspotData) {
                        const item = hotspotData[key];
                        setHotspotPosition(parseInt(key) + 1, item)
                        console.log("setHotspotPosition")
                    }
                }
            });
        }

        _this.getDOM().find(".imageCaption").on('load', function(){
            updateHostspots();
        })

        _this.getDOM().find(".popup").hide();
        // Hide popover when clicked outside
        $(document).on('click', function (e) {
            if( !$(e.target).hasClass('draggable-circle') && !$(e.target).hasClass('previous-hotspot') && !$(e.target).hasClass('next-hotspot') ) {
                $('.hotspotPopover').popover('hide');
            }
        });
    };

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, completed, true);
    };
});

DeepScrollPackage.Components.register("pdf", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
            <div class="container">
                <object data="${fields.content.properties('pdf').value}" type="application/pdf" width="100%" height="500px">
                    <p>Unable to display PDF file. <a href="${fields.content.properties('pdf').value}">Download</a> instead.</p>
                </object>
            </div>
        `;
    }

    _this._afterRender = function () {};

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("file_upload", function () {
    let _this = this;

    _this._render = function (fields) {
        let path = fields.content.properties('file').value;

        let filename = path.replace(/^.*[\\\/]/, '');
        return `
          <!-- File Attachment -->
          <!-- Block Moving and Delete Button  -->
          <div class="container">
            <a class="file-block" href="${fields.content.properties('file').value}" download="${filename}">
             
              <div class="fileuploadDiv">
                  <i class="fa-solid fa-book iconclass"></i>
                  <div class="file-info">
                      <div class="file-name">${filename}</div>
                  </div>
              </div>
              <div class="file-size"></div>
            <i class="fa-solid fa-download iconclass"></i>
          </a>
        </div>
      `;
    }

    _this._afterRender = function () {};

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, true, true);
    };
});

DeepScrollPackage.Components.register("narrative", function () {
    let _this = this
    let tabsVisited = {};


    _this._render = function (fields) {
        let narrativeData = _this.getPropertyList().content.properties('narrative_data').value;
        let narrativeHtml = '';
        let paraHTML = '';
        for (let i = 0; i < narrativeData.length; i++) {
            let item = narrativeData[i];

            let imageHtml = ``
            if(item.image.value != '') {
                imageHtml = ` <div class="col-md-6 img-block"> <img src="${item.image.value}" alt="${item.AltValue.value}" crossorigin="anonymous"/> </div>`
            }

            narrativeHtml += `<li class="nav-item swiper-slide"> <a class="nav-link" id="sec-tab" data-bs-toggle="tab" href="#tabs-${i + 1}" role="tab" aria-controls="profile" aria-selected="false">${item.label.value || 'Item'}</a> </li>`;
            paraHTML += `
                <div class="tab-pane fade" id="tabs-${i + 1}" role="tabpanel" aria-labelledby="profile-tab">
                    <div class="text-img-block">
                    <div class="row">
                        ${imageHtml}
                        <div class="col-md-12 text-block">
                            <div class="edit-text">
                                <p>${item.content.value || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} </p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            `;
            tabsVisited[i] = false;
        }
        return `
            <div class="tabs-block">
                <div class="swiper narrative-swiper mySwiper container">
                    <div class="swiper-tabs">
                        <ul class="nav nav-tabs swiper-wrapper narartiveUl" id="TabListing" role="tablist">
                        ${narrativeHtml}
                        </ul>
                        <div class="swiper-button-prev process-prev-btn"></div>
                        <div class="swiper-button-next process-next-btn"></div>
                    </div>
                    <div class="narrative-content tab-content">
                        ${paraHTML}
                    </div>
                </div>
            </div>
        `;
    }

    _this._afterRender = function () {
        _this.getDOM().find(`ul.narartiveUl li:first-child`).addClass("show active")
        let allList = _this.getDOM().find('ul.narartiveUl li:not(:first-child)')
        const totalTabs = allList.length;

        allList.on("click", function () {

            const tabIndex = allList.index(this);
            tabsVisited[tabIndex] = true;

            if (tabIndex +1 === totalTabs) {
                // Set the last tab as visited if the current tab is the last one
                tabsVisited[totalTabs] = true;
            }
            // Check if all tabs have been visited
            const allVisited = Object.values(tabsVisited).every(visited => visited);

            if (allVisited) {
                completed = true; // Set completed to true when all tabs are visited
            } else {
                completed = false;
            }
            _this.getDOM().find(`ul.narartiveUl li:first-child`).removeClass("show active")
        })
        _this.getDOM().find(`#tabs-1`).addClass("show active")
        _this.getDOM().find(`.swiper-tabs`).each(function () {
            const navcount = $(this).find("li").length ?? 2
            _this.swiper = new Swiper(this, {
                lazy: true,
                slidesPerView: 'auto',
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                spaceBetween: 0,
                breakpoints: {
                    640: {
                        slidesPerView: navcount < 2 ? navcount : 2,
                        spaceBetween: 0,
                    },

                    768: {
                        slidesPerView: navcount < 3 ? navcount : 3,
                        spaceBetween: 0,
                    },

                    1024: {
                        slidesPerView: navcount < 4 ? navcount : 4,
                        spaceBetween: 0,
                    },
                }
            });
        })
    }

    _this._viewed = function () {
        _this.setProgressStatus(100, 100, completed, true);
    }
})

DeepScrollPackage.Components.register("interactive_video", function() {
    let _this = this

    _this._render = function(fields){
        let videoUrl = _this.getPropertyList().content.properties("video").value;
        let videoSize = _this.getPropertyList().content.properties('videosize').value;

        return `
            <div class="video-container video${videoSize} ">
                <video class="intvideo video-js vjs-default-skin interactive-ui interactive-video-dimension" controls preload="auto" width="640" height="264">
                    <source src="${videoUrl}" type='video/mp4'>
                </video>
                <div class="questionbox-container">
                    <div class="questionbox slides-quize">
                    </div>
                </div>
            </div>
        `
    }

    _this._applyChanges = function(propertyGroup, property) {
        let html = `${_this._render(_this.getPropertyList())}`
        _this.getDOM().find(".section-content").html(html)
        _this._afterRender()
    }

    _this._afterRender = function () {
        let questionlist = _this.getPropertyList().content.properties('questionlist').value;
        let $videoDom = _this.getDOM().find('.intvideo');
        let markers = []
        let questions = []

        for (const key in questionlist) {
            const item = questionlist[key];
            markers.push({time: item.time.value, text: key})

            let feedback = {"value":{"type":"any","any_text":"Thank you","correct_text":"","incorrect_text":""}}
            try {feedback = JSON.parse(item.feedback.value)} catch (error) {}

            let options = {"value":[]}
            try {options = JSON.parse(item.options.value)} catch (error) {}

            questions.push({
                id: key,
                question_type: item.question_type.value,
                title: item.question.value,
                image: item.image,
                content: options.value,
                feedback: feedback.value,
            })
        }
       

        let initdata = {
            'quiz_settings' : {
                include_lesson_count : 'no',
                passing_score : '80',
                quiz_retries : 'unlimited',
                randomize_question_order : 'no',
                require_passing_score : 'no',
                show_title_screen : 'yes',
                reveal_feedback : 'yes',
                result_button : 'Next',
                shuffle_choices : 'no',
            },
            'questions' : questions
        };

        _this.quiz = new Quiz(_this.getDOM().find(".questionbox"), initdata, {}, {},function(data, status) {}, function(){
            _this.getDOM().find(".questionbox-container").fadeOut();
            try {player.play();} catch (error) {}
            return false
        });
        _this.quiz.init(false);

        const player = videojs($videoDom.get(0));
        player.markers({
            markerStyle: {
               'width':'8px',
               'background-color': 'red'
            },
            markerTip: {
                display: false,
                text: function (marker) {
                    return marker.text;
                },
            },
            markers: markers,
            onMarkerReached: function (marker) {
                player.pause();
                _this.quiz.showItem(marker.text);
                _this.getDOM().find(".questionbox-container").fadeIn();
            },
            onMarkerClick: function (marker) {
                console.log(marker)
                player.pause()
            },
        });

        player.on('ready', function () {
            player.controlBar.show();
        });

        player.on('ended', function () {
            _this.setProgressStatus(100, 100, true, true);
        });
    }

    _this._viewed = function () {
    };
})

DeepScrollPackage.Components.register("quiz", function () {
    let _this = this;

    _this._render = function (fields) {
        return `
            <div class="quizcontainer slides__box"></div>
        `;
    };

    _this._afterRender = function () {
        let quiz_settings = []
        if(_this.getPropertyList().quiz_settings != undefined) {
            quiz_settings = {
                include_lesson_count : _this.getPropertyList().quiz_settings.properties('include_lesson_count').value,
                passing_score : _this.getPropertyList().quiz_settings.properties('passing_score').value,
                quiz_retries : _this.getPropertyList().quiz_settings.properties('quiz_retries').value,
                randomize_question_order : _this.getPropertyList().quiz_settings.properties('randomize_question_order').value,
                show_title_screen : _this.getPropertyList().quiz_settings.properties('show_title_screen').value ?? 'yes',
                require_passing_score : _this.getPropertyList().quiz_settings.properties('require_passing_score').value,
                reveal_feedback : _this.getPropertyList().quiz_settings.properties('reveal_feedback').value,
                result_button : _this.getPropertyList().quiz_settings.properties('result_button').value ?? 'Next',
                shuffle_choices : _this.getPropertyList().quiz_settings.properties('shuffle_choices').value,
            }
        }
        else {
            quiz_settings = {
                include_lesson_count : 'no',
                passing_score : '80',
                quiz_retries : 'unlimited',
                randomize_question_order : 'no',
                show_title_screen : 'yes',
                require_passing_score : 'no',
                reveal_feedback : 'yes',
                result_button : 'Next',
                shuffle_choices : 'no',
            }
        }
        let initdata = {
            'quiz_settings' : quiz_settings,
            'questions' : _this.getPropertyList().content.properties('questionlist').value
        };
        if(initdata.quiz_settings.reveal_feedback == 'no') _this.getDOM().find(".quizcontainer").addClass("disablefeedback")

        _this.quiz = new Quiz(_this.getDOM().find("div.quizcontainer"), initdata, _this.getProgressStatus() || {completed:false}, _this.getProgressData(), function(data, status) {
            _this.setProgressData(data)
            _this.setProgressStatus(status['completion_percentage'], status['score_percentage'], status['completed'], status['passed']);
        });
        _this.quiz.init(true);
    };

    _this._viewed = function () {};
});



DeepScrollPackage.Components.register("numbered_divider", function () {
    let _this = this;
    
    _this._render = function (fields) {
        console.log()
        return `
        <div class="container">
            <div class="divider-container" role="separator" aria-labelledby="divider-desc">
                <div class="divider"></div>
                <div class="circle" aria-hidden="true">${_this.getNumberedDivider()}</div>
                <span class="sr-only">Section ${_this.getNumberedDivider()} Divider</span>
            </div>
        </div>
      `;
    }

    _this._afterRender = function () {
    };

    _this._viewed = function () {
    };
});

DeepScrollPackage.Components.register("line_divider", function () {
    let _this = this;
    
    _this._render = function () {
        
        return `
        <div class="container">
            <div class="divider-container" role="separator" aria-labelledby="simple-divider-desc">
                <div class="divider"></div>
                <span class="sr-only">Section Divider</span>
            </div>
        </div>
      `;
    }

    _this._afterRender = function () {
    };

    _this._viewed = function () {
    };
});
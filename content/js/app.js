const app = angular.module('DeepScrollApp', [
	'ngRoute', 'ngSanitize', 'ngResource'
]);

app.filter("allowunsafe", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

app.directive('ngcCompile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    }
}]);

app.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		filtered.sort(function(a, b) {
			if (a[field] < b[field]) return -1;
			else if (a[field] > b[field]) return 1;
			else return 0;
		});
		if (reverse)
			filtered.reverse();
		return filtered;
	};
});

app.directive('ngcRenderFinished', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
		restrict: 'A',
    	link: function ($scope, element, attr) {
           if (attr.ngBindHtml !== undefined) {
        	   var func = $parse(attr.ngcRenderFinished)($scope);
        	   if(func !== undefined){
        		   var $dewatch = $scope.$watch(function(){
        			   return $(element).html().trim();
            	   },
            	   function(newValue, oldValue){
            		   if(newValue !== "" && newValue !== oldValue){
	            		   func();
            		   }
        		   });
        	   }
           }
           else if ($scope.$last) {
                var func = $parse(attr.ngcRenderFinished)($scope);
            	func();
            }
    	}
    }
}]);

app.config(function($locationProvider, $routeProvider, $sceDelegateProvider) {
	$locationProvider.hashPrefix('');
	$sceDelegateProvider.resourceUrlWhitelist([
        'self',
        assetsUrl + '**'
    ]);
	$routeProvider
	.when("/", {
		templateUrl : assetsUrl + "views/index.html?v=240723",
		controller : 'IndexController'
	})
	.when("/page/:pageid", {
		templateUrl : assetsUrl + "views/page.html?v=250127",
		controller : 'PageController'
	})
});

app.run(['$rootScope', '$location',
	function($rootScope, $location) {
		$rootScope.assetsUrl = assetsUrl;

		$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		});
		$rootScope.$on('$includeContentLoaded', function(event, target) {
		});

	}
]);

app.controller('IndexController',
	function($rootScope, $scope, $route, $routeParams, $location, $http) {
        var pageId = $routeParams.page;
        let currentPage = soPackage.getCurrentPage()

        if(pageId == '' && currentPage != undefined)
            pageId = currentPage.id

        if(pageId == undefined)
            soPackage.setCurrentPage('')

        //console.log("Requested Page:", pageId)
        $scope.title = soPackage.getTitle().replace(/<[^>]*>?/gm, '')
        $scope.description = soPackage.getDescription()
        $scope.pages = soPackage.getPageList()
        $scope.settings = soPackage.getSettings()

        soPackage.applySettings()

        if(pageId != undefined && pageId != '') {
            var url = $location.url();
            var cleanUrl = url.split('?')[0];
            $location.url(cleanUrl + 'page/' + pageId);
        }

        let start_pageid = 0
        pages = soPackage.getPageList()
        pageOnly = {}
        found = 0
        for (var i = 0; i < pages.length; i++) {
            const page = pages[i]
            if (page.page_type == 'section' && page.children && page.children.length > 0) {
                for (var j = 0; j < page.children.length; j++){
                    subpage = page.children[j]
                    if(subpage.status.completion_status !== 'completed' && start_pageid == 0)
                        start_pageid = subpage.id
                    pageOnly[found] = subpage
                    found++
                }
            } else {
                if(page.status.completion_status !== 'completed' && start_pageid == 0)
                    start_pageid = page.id
                pageOnly[found] = page
                found++
            }
        }
        if (start_pageid == 0)
            start_pageid = pageOnly[0].id


        $scope.isContinue = function () {
            return pageOnly[0].id  !== start_pageid
        }
        $scope.startCourse = function () {
            $location.path('/page/' + start_pageid);
        }
	}
);

app.controller('PageController',
	function($rootScope, $scope, $route, $routeParams, $location, $http, $sce) {
        if(soPackage == undefined) {
            //console.log("Requested Page:", $routeParams.pageid)
            $location.url(`/?page=` + $routeParams.pageid)
        }

        $scope.title = soPackage.getTitle().replace(/<[^>]*>?/gm, '');
        $scope.description = soPackage.getDescription()
        $scope.pages = soPackage.getPageList()
        
        $scope.page = soPackage.getCurrentPage()
        $scope.settings = soPackage.getSettings()

        soPackage.setCurrentPage($routeParams.pageid)
        soPackage.showCurrentPage()
        $("body").css('padding-left' , "0px");
            
        var elm = $(".closebtn").hasClass('ad-cus-close-1') ? $(this).closest('.ad-cus-1') : $('.ad-cus-1');
        elm.removeClass('mr-0 ml-0');
        $('.bs-canvas-overlay').remove();
            

        soPackage.applySettings()

        DeepScrollPackage.listeners.register(DeepScrollPackage.events.NEXTPAGE, function(data){
            $scope.$apply(function() {
                if(data.pageId == false)
                    $location.path('/');
                else if (data.pageId == 'next') {
                    pageContents = soPackage.pageContents()
                    
                    pageId = 0
                    pageIndex = 0
                    if (typeof $scope.page !== 'undefined') {
                        pageId = $scope.page.id
                    } else {
                        pageId = soPackage.getPageIdFromURL()
                    }

                    for (var i = 0; i < pageContents.length; i++) {
                        if (pageIndex == 0) {
                            if (pageContents[i].id == pageId)
                                pageIndex = i
                        }
                    }
                    
                    pageIndex = pageIndex + 1
                    if(pageContents.length >= pageIndex)
                        pageId = pageContents[pageIndex].id
                    soPackage.setCurrentPage(pageId)
                    $location.path('/page/' + pageId);
                }
                else {
                    soPackage.setCurrentPage(data.pageId)
                    $location.path('/page/' + data.pageId);
                }
            });
        })

        DeepScrollPackage.listeners.register(DeepScrollPackage.events.ONPROGRESSUPDATE, function(data){
            $scope.pages = soPackage.getPageList()
            $scope.$digest();
        })

        $scope.exitCourse = function() {
            window.top.close();
        }

        $scope.toggleNav = function() {
            if($("#mySidebar").hasClass("opened")){
                this.closeNav()
            }
            else {
                this.openNav()
            }
        }

		$scope.openNav = function() {
			if ($(window).width() > 991) {
                $("body").css('padding-left' , "450px");
            } else {
                $("body").css('padding-left' , "290px");
            }
            // if(!$('.ad-cus-1').hasClass("ml-0")){
            //     $('body').prepend('<div class="bs-canvas-overlay bg-dark position-fixed w-100 h-100"></div>');
            // }
            $('.ad-cus-1').addClass('ml-0 minu-zee');
            $("#mySidebar").addClass("opened")
            localStorage.setItem("sidebarState", "Open");
		}

		$scope.closeNav = function() {
            $("body").css('padding-left' , "0px");
            
            var elm = $(this).hasClass('ad-cus-close-1') ? $(this).closest('.ad-cus-1') : $('.ad-cus-1');
            elm.removeClass('mr-0 ml-0');
            $('.bs-canvas-overlay').remove();
            
            $("#mySidebar").removeClass("opened")
            localStorage.setItem("sidebarState", "Close");
            return false;
            
		}
        localStorage.getItem("sidebarState") === "Close" ? $scope.settings.sideBar = "Close" : $scope.settings.sideBar ="Open";
        if ($scope.settings.sideBar === "Open") {
            if($("#mySidebar").length)
                $scope.openNav();
        }
        else if ($scope.settings.sideBar === "Close") {
            $scope.closeNav();
        }
        else {
            var $topBar = $(".top-bar");
            var children = $topBar.children();
            $(children[0]).prop('disabled', true);
        }
	}
);
var soPackage = null
$(document).ready(function(){
    soPackage = new DeepScrollPackage(packageId);
    window._tx = soPackage.label;
    soPackage.init(function(){
        angular.element(function() {angular.bootstrap(document, ['DeepScrollApp']);});
    });
    $.fn.popover.Constructor.Default.allowList['*'].push('style')
    const options = {
        path: assetsUrl,
        accessibilityStatementLink: assetsUrl + "/accessibility-statement.html",
        accessibilityProfiles : true,
        popupOverlay : false,
        onlineDictionary : false,
    }
    let settings = soPackage.getSettings()
    const style = {
        //'--readabler-color': settings.courseThemeColor,
        // '--readabler-btn-color': 'green',
        // '--readabler-btn-color-hover': '#FFFFFF',
        // '--readabler-btn-bg': '#FFFFFF',
        // '--readabler-btn-bg-hover': 'green'
        //'--readabler-color-transparent': settings.courseThemeColor
    }
    const readabler = new Readabler( options, style );
});
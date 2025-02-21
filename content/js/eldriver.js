var ELDriver = function(type) {
    var _this = this;
	var _api = null;
    var _scorm_version = ""
    var _datacache = {}
    var _postedData = {}

    const ELDTYPE_SCORM = "scorm"
    const ELDTYPE_LOCALSTORAGE = "localstorage"
    const ELDTYPE_XAPI = "xapi"

    const xAPIconstants = {
        activityProfileIri: "http://adlnet.gov/xapi/profile/scorm/activity-profile",
        activityStateIri: "http://adlnet.gov/xapi/profile/scorm/activity-state",
        actorProfileIri: "http://adlnet.gov/xapi/profile/scorm/actor-profile",
        attemptStateIri: "http://adlnet.gov/xapi/profile/scorm/attempt-state"
    };

    var xAPIGetBasicStatement = function (account, activity) {
        return {
            actor: {
                objectType: "Agent",
                account: account
            },
            verb: {},
            object: {
                objectType: "Activity",
                id: activity
            },
            context: {}
        };
    };

    const _findSCORMAPI = function (win) {
        var theAPI = undefined

        var _findAPI1_2 = function (win) {
            var findAPITries = 0;
            while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
                findAPITries++;
                if (findAPITries > 7) {
                    alert("Error finding API -- too deeply nested.");
                    return null;
                }
                _scorm_version = "1.2"
                win = win.parent;
            }
            if(win.API != null) _scorm_version = "1.2"
            return win.API;
        }

        var _findAPI2004 = function (win) {
            var findAPITries = 0;
            while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win)) {
                findAPITries++;
                if (findAPITries > 7) {
                    alert("Error finding API_1484_11 -- too deeply nested.");
                    return null;
                }
                _scorm_version = "2004"
                win = win.parent;
            }
            if(win.API_1484_11 != null) _scorm_version = "2004"
            return win.API_1484_11;
        }

        theAPI = _findAPI2004(window);
        if (theAPI != null) return theAPI;

        theAPI = _findAPI1_2(window);
        if ((theAPI == null) && (window.opener != null) && (typeof (window.opener) != "undefined")) {
            theAPI = _findAPI2004(window.opener);
            if (theAPI != null) return theAPI;
            theAPI = _findAPI1_2(window.opener);
        }
        if (theAPI == null)
            console.log("Unable to find an SCORM API adapter");
        return theAPI;
    }

    return {
		Initialize : function (e) {
            if(type == ELDTYPE_LOCALSTORAGE) {
                _datacache = localStorage.getItem("_datacache") || "{}"
                _datacache = JSON.parse(_datacache) || {}
                return true;
            }
            else if(type == ELDTYPE_SCORM) {
                _api = _findSCORMAPI(window)

                let result = "false"
                if(_scorm_version == "1.2") result = _api.LMSInitialize(e)
                else result =  _api.Initialize(e)

                if (result == "false") {
                    var errorNumber = _api.LMSGetLastError();
                    var errorString = _api.LMSGetErrorString(errorNumber);
                    var diagnostic = _api.LMSGetDiagnostic(errorNumber);
                    var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
                    alert("Error - Could not initialize communication with the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
                    return false;
                }
                return true;
            }
            else if(type == ELDTYPE_XAPI) {
                _api = ADL.XAPIWrapper;

                var actor = JSON.parse(_api.lrs.actor);

                if(actor.name.constructor === Array) {
                    _api.agent = {account: {name: actor.account[0].accountName, homePage: actor.account[0].accountServiceHomePage}}
                }
                else {
                    _api.agent = {account: {name: actor.mbox, homePage: actor.account[0].accountServiceHomePage}}
                }

                _api.activity = _api.agent.account.homePage + _api.lrs.activity_id

                console.log('Test Config: ', _api.testConfig());
                console.log('Agent', _api.agent);

                var statement = xAPIGetBasicStatement(_api.agent.account, _api.activity);
                statement.verb = ADL.verbs.initialized;
                _api.sendStatement(statement);

                var data = ADL.XAPIWrapper.getState(_api.activity, _api.agent, xAPIconstants.activityStateIri);
                if(data != null) _datacache = data.suspend_data || {};
            }
		},
		SetValue : function (cmi, value) {
            if(type == ELDTYPE_LOCALSTORAGE) {
                _datacache[cmi] = value
                return false;
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") return _api.LMSSetValue(cmi, value)
                else return _api.SetValue(cmi, value)
            }
            else if(type == ELDTYPE_XAPI) {
                _datacache[cmi] = value
            }
		},
		GetValue : function (cmi) {
            if(type == ELDTYPE_LOCALSTORAGE) {
                return _datacache[cmi]
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") return _api.LMSGetValue(cmi)
                else return _api.GetValue(cmi)
            }
            else if(type == ELDTYPE_XAPI) {
                return _datacache[cmi]
            }
		},
		Commit : function (cmi) {
			let _thisInit = this
            if(type == ELDTYPE_LOCALSTORAGE) {
                localStorage.setItem("_datacache", JSON.stringify(_datacache))
                return false;
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") return _api.LMSCommit("")
			    else return _api.Commit("")
            }
            else if(type == ELDTYPE_XAPI) {
                let state = {
                    suspend_data: _datacache,
                    location: _thisInit.GetValue("cmi.core.location")
                }
                if(JSON.stringify(_postedData['state']) == JSON.stringify(state)) {
                    console.log("State for datacache already posted to XAPI", state)
                    return
                }
                _postedData['state'] = state
                _api.sendState(_api.activity, _api.agent, xAPIconstants.activityStateIri, null, state);
            }
		},
		Finish : function (cmi) {
			let _thisInit = this
            if(type == ELDTYPE_LOCALSTORAGE) {
                localStorage.setItem("_datacache", JSON.stringify(_datacache))
                return false;
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") _thisInit.SetValue("cmi.core.exit", "suspend")
			    else _thisInit.SetValue("cmi.exit", "suspend")
                _thisInit.Commit("")
                if(_scorm_version == "1.2") return _api.LMSFinish(cmi)
                else return _api.Terminate(cmi)
            }
            else if(type == ELDTYPE_XAPI) {
                var statement = xAPIGetBasicStatement(_api.agent.account, _api.activity);
                statement.verb = ADL.verbs.terminated;
                _api.sendStatement(statement);
            }
		},
		SubmitResult : function (score, completion, success) {
            console.log("SubmitResult", score, completion, success)

            if(type == ELDTYPE_LOCALSTORAGE) {
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") {
                    this.SetValue("cmi.core.score.raw", score);
                    this.SetValue("cmi.core.score.min", 0);
                    this.SetValue("cmi.core.score.max", 100);
                    if(success)
                        this.SetValue("cmi.core.lesson_status", success);
                    else
                        this.SetValue("cmi.core.lesson_status", completion);
                }
                else {
                    this.SetValue("cmi.score.raw", score);
                    this.SetValue("cmi.score.min", 0);
                    this.SetValue("cmi.score.max", 100);
                    this.SetValue("cmi.score.scaled", score/100);

                    this.SetValue("cmi.completion_status", completion);
                    this.SetValue("cmi.success_status", success);
                }
			    this.Commit("")
            }
            else if(type == ELDTYPE_XAPI) {
                let result = {
                    'score':score,
                    'completion':completion,
                    'success':success,
                }
                if(JSON.stringify(_postedData['result']) == JSON.stringify(result)) {
                    console.log("Result already posted to XAPI", result)
                    return
                }
                _postedData['result'] = result
                var statement = xAPIGetBasicStatement(_api.agent.account, _api.activity);
                statement.verb = ADL.verbs.scored;
                statement.result = {score: {raw: parseFloat(score)}};
                _api.sendStatement(statement);

                var statement = xAPIGetBasicStatement(_api.agent.account, _api.activity);

                if(success) {
                    statement.verb = ADL.verbs.passed;
                }
                else {
                    statement.verb = ADL.verbs.failed;
                }
                _api.sendStatement(statement);
            }
		},
        SetBookmark : function (location) {
            if(type == ELDTYPE_LOCALSTORAGE) {
                _datacache["location"] = value
                _api.Commit("");
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") _api.SetValue("cmi.core.lesson_location", location);
                else _api.LMSSetValue("cmi.location", location);
                _api.Commit("");
            }
            else if(type == ELDTYPE_XAPI) {
                _api.sendState(_api.activity, _api.agent, xAPIconstants.activityStateIri, null, {bookmark: [location]});
            }
        },
        GetBookmark : function () {
            if(type == ELDTYPE_LOCALSTORAGE) {
                return _datacache["location"]
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") return _api.GetValue("cmi.core.lesson_location");
                else return _api.GetValue("cmi.location");
            }
            else if(type == ELDTYPE_XAPI) {
                var location = _api.getState(_api.activity, _api.agent, xAPIconstants.activityStateIri, null);
                return location.bookmark[0];
            }
        },
		GetLastError : function (errorCode) {
            if(type == ELDTYPE_LOCALSTORAGE) {
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") return _api.LMSGetLastError(errorCode)
                else return _api.GetLastError(errorCode)
            }
            else if(type == ELDTYPE_XAPI) {

            }
		},
		GetErrorString : function (errorCode) {
            if(type == ELDTYPE_LOCALSTORAGE) {
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") return _api.LMSGetErrorString(errorCode)
                else return _api.GetErrorString(errorCode)
            }
            else if(type == ELDTYPE_XAPI) {

            }
		},
		GetDiagnostic : function (errorCode) {
            if(type == ELDTYPE_LOCALSTORAGE) {
            }
            else if(type == ELDTYPE_SCORM) {
                if(_scorm_version == "1.2") return _api.LMSGetDiagnostic(errorCode)
                else return _api.GetDiagnostic(errorCode)
            }
            else if(type == ELDTYPE_XAPI) {

            }
		},
        init : function() {
            console.log("ELD Type = " + type)
			let _thisInit = this
            _thisInit.Initialize("");
			var onWindowClose = function() {
                _thisInit.Finish("")
				window.removeEventListener("beforeunload", this);
				setTimeout(function(){
					window.close()
				}, 5000)
				return "";
			}
			window.addEventListener("beforeunload", onWindowClose)
        }
    };
}

$(document).ready(function(){
    window.eldriver = new ELDriver(eldrivertype);
})

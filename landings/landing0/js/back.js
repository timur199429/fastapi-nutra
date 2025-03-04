(function () {

    let isFirst = true;
    
    function test() {
        window.vitBack(`url Ð²Ð¸Ñ‚Ñ€Ð¸Ð½Ñ‹`, {
            url: 'url Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´Ð°',
            count: 1, // - ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ€Ð°Ð· ÑÐºÐ¾Ð»ÑŒÐºÐ¾ Ð´Ð¾Ð»Ð¶ÐµÐ½ ÑÑ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´
            handler: function (count) { // Ð•ÑÐ»Ð¸ Ð²ÐµÑ€Ð½ÑƒÑ‚ÑŒ true Ð¾Ñ‚ÐºÑ€Ð¾ÐµÑ‚ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½ÑƒÑŽ ÑÑÑ‹Ð»ÐºÑƒ
                return count % 2 == 0
            }
        })
    }


    let count = 0;
    let config = {};
    window.vitBack = function (backLink, obj) {
        if (getUrlVar('frame') === 1 || isInIframe()) return;

        backInFrame(backLink, obj);
    };


    function createFrame(name, url){
        var nodeFrame = document.getElementById(name);
        if (nodeFrame){
            nodeFrame.parentNode.removeChild(nodeFrame);
        }
        var frame = document.createElement('iframe');
        frame.style.width = '100%';
        frame.id = name;
        frame.name = name;
        frame.style.height = '100vh';
        frame.style.position = 'fixed';
        frame.style.top = 0;
        frame.style.left = 0;
        frame.style.border = 'none';
        frame.style.zIndex = 999997;
         frame.style.display = 'block';
        frame.style.backgroundColor = '#fff';
        document.body.append(frame);

        frame.src = url;
    }
    function backInFrame(backLink, obj) {
        config = obj;
        
      

        let url = new URL(location.href);
        backLink = backLink.replace(/{([^}]*)}/gm, function (all, key) {
            if (url.searchParams.has(key)) {
                return url.searchParams.get(key);
            }
            return ``;
        });

        console.log(backLink);

        if (!isIos()) {
            checkUserGesture(function () {
                for (var t = 0; 20 > t; ++t) window.history.pushState({ EVENT: "MIXER" }, "", window.location);
            });
        } else {
            for (var t = 0; 20 > t; ++t) window.history.pushState({ EVENT: "MIXER" }, "", window.location);
        }


       

        window.onpopstate = function (t) {
            t.preventDefault();
            createFrame(`newsFrame`);


            let isVitrina = true;
            let url = backLink;
            if (!!config && config.url) {
                if (!!config.handler) {
                    if (config.handler(count)) {
                        url = config.url;
                        isVitrina = false;
                    }
    
                } else {
                    let countObj = config.count ?? 1
                    if (countObj > count) {
                        url = config.url;
                        isVitrina = false;
                    }
                }
            }
            count++;

            if (isVitrina) {
                url = getUrl(url, isFirst);
                isFirst = false;
            }

            console.log("t.state", t.state);
            console.log("backLink", url);
            console.log("isIos", isIos());

            if (!isIos() && !!!t.state) return;

            document.body.style.overflow = 'hidden';
            //frame.style.display = "block";
            document.querySelectorAll("body > *:not(#newsFrame)").forEach(function (e) {
                e.setAttribute('style', 'display:none;');
            });


            console.log('back url in frame', url);
            frames['newsFrame'].window.location.replace(url);
            
        };
    }


    function getUrl(backLink, isFirst) {
        var url = backLink;
    
        url += "&frame=1";
        url += "&type=back";
        url += "&type_content=1";
        url += "&rnd=" + Math.random();
        url += "&isd=1";
    
        if (isFirst) {
            url += "&is_visitor=1";
        } else {
            url += "&is_visitor=0";
        }
    
        return url;
    }


    function getQuery() {
        var url = location.search;
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0, result = {}; i < qs.length; i++) {
            qs[i] = qs[i].split('=');
            try {
                result[qs[i][0]] = (qs[i][1] !== null) ?
                    decodeURIComponent(qs[i][1]) : '';
            } catch (e) {
                result[qs[i][0]] = qs[i][1];
            }
        }
        return result;
    }

    function backNotUserGesture(backLink) {
        window.history.pushState({ EVENT: "MIXER" }, "", window.location);
        window.onpopstate = function () {
            window.location.replace(backLink);
        }
    }

    function getUrlVar(key) {
        var p = window.location.search;
        p = p.match(new RegExp('[?&]{1}(?:' + key + '=([^&$#=]+))'));
        return p ? p[1] : '';
    }

    function isInIframe() {
        try {
            return window != window.top || document != top.document || self.location != top.location;
        } catch (e) {
            return true;
        }
    }


    function checkUserGesture(callback) {

        var st = setInterval(function () {
            var audio = document.createElement('audio');
            var playPromise = audio.play();
            if (playPromise instanceof Promise) {
                if (!audio.paused) {
                    clearInterval(st);
                    callback();
                }
                playPromise.then(function (e) {

                }).catch(function (error) {

                });
            } else {
                if (!audio.paused) {
                    clearInterval(st);
                    callback();
                }
            }
        }, 100);
    }


    function isIos() {

        console.log("navigator.platform", navigator.platform);
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod',
            'Macintosh',
            'MacIntel',
            'MacPPC',
            'Mac68K',
            'Mac68K'
        ].some(function (exactPlatformString) {
            return navigator.platform === exactPlatformString
        });
    }

})(window);
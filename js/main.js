var urbaClic;


var urbaClicUtils = {};

urbaClicUtils.urlify = function (text) {
    if ('string' != typeof text) return text;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    })

}

urbaClicUtils.baseLayers = {
    "OSM-Fr": {
        "title": "OSM-Fr",
        "url": "//tilecache.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
    },
    "Positron": {
        "title": "Positron",
        "url": "//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    },
    "Outdoors_OSM": {
        "title": "Outdoors (OSM)",
        "url": "//{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
    },
    "OSM_Roads": {
        "title": "OSM Roads",
        "url": "//korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
    },
    "Dark_Matter": {
        "title": "Dark Matter",
        "url": "//cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
    },
    "OpenStreetMap": {
        "title": "OpenStreetMap",
        "url": "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    "Toner": {
        "title": "Toner",
        "url": "//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png"
    },
    "Landscape": {
        "title": "Landscape",
        "url": "//{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"
    },
    "Transport": {
        "title": "Transport",
        "url": "//{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
    },
    "MapQuest_Open": {
        "title": "MapQuest Open",
        "url": "//otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png"
    },
    "HOTOSM_style": {
        "title": "HOTOSM style",
        "url": "//tilecache.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    },
    "OpenCycleMap": {
        "title": "OpenCycleMap",
        "url": "//{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
    },
    "Watercolor": {
        "title": "Watercolor",
        "url": "//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png"
    },
    "hikebikemap": {
        "title": "hikebikemap",
        "url": "//toolserver.org/tiles/hikebike/{z}/{x}/{y}.png"
    },
    "OSM-monochrome": {
        "title": "OSM-monochrome",
        "url": "//www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png"
    },
    "Hydda": {
        "title": "Hydda",
        "url": "//{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
    },
    "OpenTopoMap": {
        "title": "OpenTopoMap",
        "url": "//{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    },
    "OpenRiverboatMap": {
        "title": "OpenRiverboatMap",
        "url": "//tilecache.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png"
    }
};


jQuery(document).ready(function ($) {

    var Templates = {};



    var sortDesc = false;


    Templates.autocomplete = [
        '{{#each features}}',
        '<li><a href="#" data-feature="{{jsonencode .}}" data-type="{{properties.type}}" tabindex="1000">',
        '   {{marks properties.label ../query}}',
        '   &nbsp;<i>{{_ properties.type}}</i>',
        '</a></li>',
        '{{/each}}',
    ];






    Templates.shareLink = [
        '<div class="uData-shareLink">',
        '<div class="linkDiv"><a href="#">intégrez cet outil de recherche sur votre site&nbsp;<i class="fa fa-share-alt"></i></a></div>',
        '<div class="hidden">',
        '   <h4>Vous pouvez intégrer cet outil de recherche de données sur votre site</h4>',
        '   <p>Pour ceci collez le code suivant dans le code HTML de votre page</p>',
        '   <pre>',
        '&lt;script&gt;window.jQuery || document.write("&lt;script src=\'//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js\'&gt;&lt;\\\/script&gt;")&lt;/script&gt;',
        '',
        '&lt;!-- chargement feuille de style font-awesome --&gt;',
        '&lt;link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"&gt;',
        '',
        '&lt;script src="{{baseUrl}}udata.js"&gt;&lt;/script&gt;',
        '&lt;div class="uData-data"',
        '   data-q="{{q}}"',
        '   data-organizations="{{organizationList}}"',
        '   data-organization="{{organization}}"',
        '   data-page_size="{{page_size}}"',
        '&gt&lt;/div&gt',
        '   </pre>',
        "   <p>vous pouvez trouver plus d'info sur cet outil et son paramétrage à cette adresse: <a href='https://github.com/DepthFrance/udata-js' target='_blank'>https://github.com/DepthFrance/udata-js</a></p>",
        '</div>',
        '</div>',
    ];





    //var baseUrl = jQuery('script[src$="/urbaclic.js"]')[0].src.replace('/urbaclic.js', '/');
    var baseUrl = jQuery('script[src$="/main.js"]')[0].src.replace('/main.js', '/../dist/');

    var _urbaclic = {};


    urbaClic = function (obj, options) {
        var container = obj;

        var cadastre_min_zoom = 17;

        var map = null;

        var layers = {
            ban: null,
            adresse: null,
            //parcelle: null,
            parcelles: null
        }

        var backgroundLayers = {};

        var urbaClic_options = {
            showMap: true,
            showData: true,
            sharelink: false,
            autocomplete_limit: 50,
            leaflet_map_options: {},
            background_layers: ['OpenStreetMap', 'MapQuest_Open', 'OpenTopoMap']
        };

        var ban_query = null;
        var cadastre_query = null;
        var cadastre_query2 = null;
        var zoom_timeout = null;
        var focusOff_timeout = null;

        urbaClic_options = jQuery.extend(urbaClic_options, options);

        var autocomplete_params = {};
        for (var i in urbaClic_options) {
            if (i.search('autocomplete_') == 0) {
                var k = i.substring('autocomplete_'.length);
                autocomplete_params[k] = urbaClic_options[i];
            }
        }

        var input = container.find('#urbaclic-search');

        var ban_options = autocomplete_params;

        var default_template = function (feature) {
            var html = '';
            jQuery.each(feature.properties, function (k, v) {
                html += '<tr><th>' + k + '</th><td>' + urbaClicUtils.urlify(v) + '</td></tr>';
            });
            html = '<table class="table table-hover table-bordered">' + html + '</table>';
            return html;
        };

        var circle_pointToLayer = function (feature, latlng) {

            var geojsonMarkerOptions = {
                radius: 3
            };

            return L.circleMarker(latlng, geojsonMarkerOptions);
        };

        var updateLayerController = function () {
            var loadedLayers = [];
            for (var i in layers) {
                if (layers[i] != null) loadedLayers[i] = layers[i];
            }
            map.layerController.removeFrom(map);
            map.layerController = L.control.layers(backgroundLayers, loadedLayers).addTo(map);
        }

        _urbaclic.addBackground = function (title, layer, show) {
            backgroundLayers[title] = layer;
            if (show === true) layer.addTo(map);
            updateLayerController();

        }

        var autocomplete = function () {
            if (zoom_timeout) clearTimeout(zoom_timeout);
            if (layers.ban) map.removeLayer(layers.ban);
            if (layers.adresse) map.removeLayer(layers.adresse);


            layers.adresse = null;
            if (ban_query) ban_query.abort();
            input.prop('tabindex', 1000);
            var t = input.val();

            if (t.length > 1) {

                var ul = container.find('ul.urbaclic-autocomplete');
                if (!ul.length) {
                    ul = jQuery('<ul class="urbaclic-autocomplete"></ul>').insertAfter(input).hide();
                    ul.css('top', input.outerHeight() - 2);
                }

                var url = BAN_API + 'search/';
                var params = ban_options;
                params.q = t;

                ban_query = jQuery.getJSON(url, params, function (data) {
                    ban_query = null;
                    //TODO filter data with BBox
                    if (data.features.length) {
                        ul.html(Templates.autocomplete(data)).slideDown();

                        var layer = L.geoJson(data, {
                            pointToLayer: circle_pointToLayer,
                            style: {
                                'className': 'ban'
                            }
                        }).addTo(map);
                        zoom_timeout = setTimeout(function () {
                            map.fitBounds(layer.getBounds());
                        }, 500);

                        layer.on('click', function (e) {
                            var feature = e.layer.feature;
                            var type = feature.properties.type;
                            loadParcelle({
                                feature: feature,
                                type: type
                            });
                        });

                        layer.bringToFront();
                        layers.ban = layer;
                        updateLayerController();

                        var tbindex = 1000;
                        container.find('ul.urbaclic-autocomplete a').each(function () {
                            tbindex++;
                            jQuery(this).prop('tabindex', tbindex);
                        })


                    } else {
                        ul.html('').fadeOut();
                    }
                });
            } else {
                container.find('ul.urbaclic-autocomplete').html('').slideUp();
            }
        }

        if (urbaClic_options.showMap) {
            if (!jQuery('.urbaclic-map').length) jQuery('<div class="urbaclic-map"></div>').appendTo(container);

            map = L.map(jQuery('.urbaclic-map')[0], urbaClic_options.leaflet_map_options).setView([46.6795944656402, 2.197265625], 4);
            map.attributionControl.setPrefix('');
            map.layerController = L.control.layers([], []).addTo(map);

            for (var i in urbaClic_options.background_layers) {
                var bl = urbaClic_options.background_layers[i];

                if (typeof bl == 'string') {
                    if (urbaClicUtils.baseLayers[bl] != undefined) {
                        bl = urbaClicUtils.baseLayers[bl];
                    } else {
                        try {
                            bl = eval(bl);
                        } catch (err) {
                            console.log(err.message);
                        }
                    }
                }
                var l = L.tileLayer(bl.url);
                var t = bl.title;
                _urbaclic.addBackground(t, l, i == 0);
            }


            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            map.on('moveend', function () {

                if (cadastre_query2) cadastre_query2.abort();


                if (map.getZoom() >= cadastre_min_zoom) {

                    var url = Cadastre_API + 'cadastre/geometrie';
                    var rect = L.rectangle(map.getBounds());
                    var qparams = {
                        geom: JSON.stringify(rect.toGeoJSON())
                    };

                    cadastre_query2 = jQuery.getJSON(url, qparams, function (data) {
                        if (data.features.length) {
                            var layer = L.geoJson(data, {
                                onEachFeature: function (feature, layer) {
                                    var html = default_template(feature);
                                    layer.bindPopup(html);
                                },
                                style: {
                                    'className': 'parcelles'
                                }
                            });
                            if (layers.parcelles) map.removeLayer(layers.parcelles);
                            layers.parcelles = null;
                            layer.addTo(map);
                            layer.bringToBack();
                            layers.parcelles = layer;
                            updateLayerController();
                        } else {
                            console.info('aucune parcelle trouvée');
                        }

                    });
                } else {
                    if (layers.parcelles) {
                        map.removeLayer(layers.parcelles);
                        layers.parcelles = null;
                        updateLayerController();
                    }
                }
            });
        }


        var loadParcelle = function (params) {
            focusOff();
            if (zoom_timeout) clearTimeout(zoom_timeout);

            var adresse_json = {
                type: 'FeatureCollection',
                features: [params.feature]
            };

            var layer = L.geoJson(adresse_json, {
                onEachFeature: function (feature, layer) {
                    var html = default_template(feature);
                    layer.bindPopup(html);
                },
                style: {
                    'className': 'adresse'
                }
            }).addTo(map);
            map.fitBounds(layer.getBounds());
            layers.adresse = layer;
            updateLayerController();

            /*if (layers.parcelle) map.removeLayer(layers.parcelle);
            layers.parcelle = null;
            if (cadastre_query) cadastre_query.abort();
            var url = Cadastre_API + 'cadastre/geometrie';
            var qparams = {
                geom: JSON.stringify(params.feature)
            };

            input.val(params.feature.properties.label)

            cadastre_query = jQuery.getJSON(url, qparams, function (data) {
                if (data.features.length) {
                    var layer = L.geoJson(data, {
                        onEachFeature: function (feature, layer) {
                            var html = default_template(feature);
                            layer.bindPopup(html);
                        },
                        style: {
                            'className': 'parcelle'
                        }
                    }).addTo(map);
                    map.fitBounds(layer.getBounds());
                    layers.parcelle = layer;
                } else {
                    console.info('aucune parcelle trouvée');
                }

            });*/
        };


        var focusOff = function () {
            container.find('ul.urbaclic-autocomplete').slideUp();
        }

        input.keydown(function (e) {
            setTimeout(autocomplete, 10);
        })
            .focusin(function () {
                clearTimeout(focusOff_timeout);
                container.find('ul.urbaclic-autocomplete').slideDown();
            })
            .focusout(function () {
                clearTimeout(focusOff_timeout);
                focusOff_timeout = setTimeout(focusOff, 200);
            });

        container.on('click', 'ul.urbaclic-autocomplete [data-feature]', function (e) {
            e.preventDefault();
            loadParcelle(jQuery(this).data());
        }).on('mouseover', 'ul.urbaclic-autocomplete', function (e) {
            clearTimeout(focusOff_timeout);
        }).on('focusin', 'ul.urbaclic-autocomplete *', function (e) {
            clearTimeout(focusOff_timeout);
        }).on('focusout', 'ul.urbaclic-autocomplete *', function (e) {
            clearTimeout(focusOff_timeout);
            focusOff_timeout = setTimeout(focusOff, 200);
        })

        autocomplete();

        _urbaclic.map = map;
        _urbaclic.loadParcelle = loadParcelle;
        return _urbaclic;
    };



    //*****************************************************





    var BAN_API = "https://api-adresse.data.gouv.fr/";
    var Cadastre_API = "https://apicarto.sgmap.fr/";





    var checklibs = function () {
        var dependences = {
            'Handlebars': 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.2/handlebars.min.js',
            'i18n': 'https://cdnjs.cloudflare.com/ajax/libs/i18next/1.6.3/i18next-1.6.3.min.js',
            //'marked': 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js',
            'L': 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js',
        };

        var css = {
            'L': 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css',
            'css': baseUrl + 'urbaclic.css',
        };
        var ready = true;
        for (var i in css) {
            if (jQuery('link[href="' + css[i] + '"]').length == 0) {
                jQuery('<link type="text/css" href="' + css[i] + '" rel="stylesheet">').appendTo('head');
            }
        }

        for (var i in dependences) {
            if (typeof window[i] == 'undefined') {
                if (jQuery('script[src="' + dependences[i] + '"]').length == 0) {
                    jQuery('<script src="' + dependences[i] + '"></script>').appendTo('body');
                }
                ready = false;
            }
        }
        if (ready) {
            start();
        } else {
            setTimeout(checklibs, 100);
        }
    }




    var start = function () {

        var container = _urbaclic.container;

        /** i18n init  **/
        _urbaclic.lang = lang = 'fr';

        i18n.init({
            resGetPath: baseUrl + 'locales/urbaclic.' + lang + '.json',
            lng: lang,
            load: 'unspecific',
            interpolationPrefix: '{',
            interpolationSuffix: '}',
            fallbackLng: false,
            fallbackOnEmpty: true,
            fallbackOnNull: true,
            nsseparator: '::', // Allow to use real sentences as keys
            keyseparator: '$$', // Allow to use real sentences as keys
        }, function (err, t) { /* loading done */ });





        /** Handlebars init  **/

        Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

            switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('ifCount', function (v1, operator, v2, options) {
            var v1 = v1.length;
            switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('mark', function (text, key) {
            var match = text.match(new RegExp(key.trim(), "gi"));
            var uniqueMatch = [];
            jQuery.each(match, function (i, el) {
                if (jQuery.inArray(el, uniqueMatch) === -1) uniqueMatch.push(el);
            });

            for (var i in uniqueMatch) {
                text = text.replace(new RegExp(uniqueMatch[i], "g"), '[** ' + uniqueMatch[i] + ' **]')
            }

            text = text.replace(/\[\*\* /g, '<mark>').replace(/ \*\*\]/g, '</mark>');
            return new Handlebars.SafeString(text);
        });

        Handlebars.registerHelper('marks', function (text, key) {
            var keys = key.trim().split(' ');
            for (var i in keys) {
                key = keys[i];
                var match = text.match(new RegExp(key, "gi"));
                var uniqueMatch = [];
                jQuery.each(match, function (i, el) {
                    if (jQuery.inArray(el, uniqueMatch) === -1) uniqueMatch.push(el);
                });

                for (var i in uniqueMatch) {
                    text = text.replace(new RegExp(uniqueMatch[i], "g"), '[** ' + uniqueMatch[i] + ' **]')
                }


            }

            text = text.replace(/\[\*\* /g, '<mark>').replace(/ \*\*\]/g, '</mark>');
            return new Handlebars.SafeString(text);
        });



        Handlebars.registerHelper('paginate', function (n, total, page_size) {

            var res = '';
            var nPage = Math.ceil(total / page_size);
            if (nPage == 1) return '';
            for (var i = 1; i <= nPage; ++i) {
                res += '<li' + (i == n ? ' class="active"' : '') + ">";
                res += '<a href="#" data-page=' + i + '>' + i + '</a></li>';
            }
            return '<nav><ul class="pagination">' + res + '</ul></nav>';
        });

        Handlebars.registerHelper('taglist', function (tags) {
            var res = '';
            for (var i in tags) {
                res += "<span class='label label-primary' >" + tags[i] + '</span> ';
            }
            return res;
        });

        Handlebars.registerHelper('trimString', function (passedString) {
            if (passedString.length > 150) {
                var theString = passedString.substring(0, 150) + '...';
                return new Handlebars.SafeString(theString);
            } else {
                return passedString;
            }

        });


        Handlebars.registerHelper('uppercase', function (passedString) {
            return passedString.toUpperCase();
        });

        Handlebars.registerHelper('truncate', function (str, len) {
            if (str && str.length > len && str.length > 0) {
                var new_str = str + " ";
                new_str = str.substr(0, len);
                new_str = str.substr(0, new_str.lastIndexOf(" "));
                new_str = (new_str.length > 0) ? new_str : str.substr(0, len);

                return new Handlebars.SafeString(new_str + '...');
            }
            return str;
        });

        Handlebars.registerHelper('default', function (value, defaultValue) {
            if (value != null) {
                return value
            } else {
                return defaultValue;
            }
        });

        Handlebars.registerHelper('dt', function (value, options) {
            return moment(value).format(options.hash['format'] || 'LLL');
        });

        Handlebars.registerHelper('placeholder', function (url, type) {
            return url ? url : baseUrl + 'img/placeholders/' + type + '.png';
        });

        Handlebars.registerHelper('_', function (value, options) {
            if (!value || typeof value !== 'string') {
                return '';
            }
            options.hash.defaultValue = '???';
            var res = i18n.t(value, options.hash);

            if (res == '???') {
                value = value.charAt(0).toLowerCase() + value.slice(1);
                res = i18n.t(value, options.hash);
                res = res.charAt(0).toUpperCase() + res.slice(1);
            }
            if (res == '???') {
                value = value.charAt(0).toUpperCase() + value.slice(1);
                res = i18n.t(value, options.hash);
                res = res.charAt(0).toLowerCase() + res.slice(1);
            }
            if (res == '???') {
                console.warn('i18n "' + value + '" NOT FOUND')
                return value;
            }

            return res;
        });


        Handlebars.registerHelper('md', function (value) {
            return new Handlebars.SafeString(marked(value));
        });



        Handlebars.registerHelper('mdshort', function (value, length) {
            if (!value) {
                return;
            }

            var EXCERPT_TOKEN = '<!--- --- -->',
                DEFAULT_LENGTH = 128;

            if (typeof length == 'undefined') {
                length = DEFAULT_LENGTH;
            }

            var text, ellipsis;
            if (value.indexOf('<!--- excerpt -->')) {
                value = value.split(EXCERPT_TOKEN, 1)[0];
            }
            ellipsis = value.length >= length ? '...' : '';
            text = marked(value.substring(0, length) + ellipsis);
            text = text.replace('<a ', '<span ').replace('</a>', '</span>');
            return new Handlebars.SafeString(text);
        });


        Handlebars.registerHelper('theme', function (value) {
            return new Handlebars.SafeString(baseUrl + '' + value);
        });


        Handlebars.registerHelper('fulllogo', function (value) {
            //   value = value.replace('-100.png', '.png'); // BAD IDEA can be .png or .jpg
            return new Handlebars.SafeString(value);
        });


        Handlebars.registerHelper('jsonencode', function (value) {

            return JSON.stringify(value, null, 4);
        });

        for (var tmpl in Templates) {
            var template_surcharge_id = 'udata_template_' + tmpl;
            console.info('load template: #' + template_surcharge_id);
            var t = jQuery('#' + template_surcharge_id).first();
            if (t.length) {
                Templates[tmpl] = t.html();
                console.info('loaded.');
            } else {
                console.info('not found, use default template.');
            }

            if (typeof Templates[tmpl] != 'string')
                Templates[tmpl] = Templates[tmpl].join("\n");
            Templates[tmpl] = Handlebars.compile(Templates[tmpl]);
        }

        /** init  **/

        container = jQuery('#urbaclic');
        if (container.length) {

            window.urbaClic_autoload = [];
            container.each(function () {
                var obj = jQuery(this);
                window.urbaClic_autoload.push(urbaClic(obj, obj.data()));
            });



        }





    };

    checklibs();


});
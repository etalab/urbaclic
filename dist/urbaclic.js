/*! 04-04-2016 */
var urbaClic, urbaClicUtils = {};

urbaClicUtils.urlify = function(text) {
    if ("string" != typeof text) return text;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
}, urbaClicUtils.closestF = {
    distance: function(map, latlngA, latlngB) {
        return map.latLngToLayerPoint(latlngA).distanceTo(map.latLngToLayerPoint(latlngB));
    },
    closest: function(map, layer, latlng, vertices) {
        "function" != typeof layer.getLatLngs && (layer = L.polyline(layer));
        var i, n, distance, latlngs = layer.getLatLngs(), mindist = 1 / 0, result = null;
        if (vertices) {
            for (i = 0, n = latlngs.length; n > i; i++) {
                var ll = latlngs[i];
                distance = urbaClicUtils.closestF.distance(map, latlng, ll), mindist > distance && (mindist = distance, 
                result = ll, result.distance = distance);
            }
            return result;
        }
        for (layer instanceof L.Polygon && latlngs.push(latlngs[0]), i = 0, n = latlngs.length; n - 1 > i; i++) {
            var latlngA = latlngs[i], latlngB = latlngs[i + 1];
            distance = urbaClicUtils.closestF.distanceSegment(map, latlng, latlngA, latlngB), 
            mindist >= distance && (mindist = distance, result = urbaClicUtils.closestF.closestOnSegment(map, latlng, latlngA, latlngB), 
            result.distance = distance);
        }
        return result;
    },
    closestLayer: function(map, layers, latlng) {
        for (var mindist = 1 / 0, result = null, ll = null, distance = 1 / 0, i = 0, n = layers.length; n > i; i++) {
            var layer = layers[i];
            if ("function" == typeof layer.getLatLng) ll = layer.getLatLng(), distance = urbaClicUtils.closestF.distance(map, latlng, ll); else if ("function" == typeof layer.getLayers) for (var mindist2 = 1 / 0, layers2 = layer.getLayers(), i2 = 0, n2 = layers2.length; n2 > i2; i2++) {
                var layer2 = layers2[i2];
                ll = urbaClicUtils.closestF.closest(map, layer2, latlng), ll && ll.distance < mindist2 && (distance = ll.distance, 
                mindist2 = distance);
            } else ll = urbaClicUtils.closestF.closest(map, layer, latlng), ll && (distance = ll.distance);
            mindist > distance && (mindist = distance, result = {
                layer: layer,
                latlng: ll,
                distance: distance
            });
        }
        return result;
    },
    distanceSegment: function(map, latlng, latlngA, latlngB) {
        var p = map.latLngToLayerPoint(latlng), p1 = map.latLngToLayerPoint(latlngA), p2 = map.latLngToLayerPoint(latlngB);
        return L.LineUtil.pointToSegmentDistance(p, p1, p2);
    },
    closestOnSegment: function(map, latlng, latlngA, latlngB) {
        var maxzoom = map.getMaxZoom();
        maxzoom === 1 / 0 && (maxzoom = map.getZoom());
        var p = map.project(latlng, maxzoom), p1 = map.project(latlngA, maxzoom), p2 = map.project(latlngB, maxzoom), closest = L.LineUtil.closestPointOnSegment(p, p1, p2);
        return map.unproject(closest, maxzoom);
    }
}, urbaClicUtils.baseLayers = {
    "OSM-Fr": {
        title: "OSM-Fr",
        url: "//tilecache.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
    },
    Positron: {
        title: "Positron",
        url: "//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    },
    Outdoors_OSM: {
        title: "Outdoors (OSM)",
        url: "//{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
    },
    OSM_Roads: {
        title: "OSM Roads",
        url: "//korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
    },
    Dark_Matter: {
        title: "Dark Matter",
        url: "//cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
    },
    OpenStreetMap: {
        title: "OpenStreetMap",
        url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    Toner: {
        title: "Toner",
        url: "//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png"
    },
    Landscape: {
        title: "Landscape",
        url: "//{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"
    },
    Transport: {
        title: "Transport",
        url: "//{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
    },
    MapQuest_Open: {
        title: "MapQuest Open",
        url: "//otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png"
    },
    HOTOSM_style: {
        title: "HOTOSM style",
        url: "//tilecache.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    },
    OpenCycleMap: {
        title: "OpenCycleMap",
        url: "//{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
    },
    Watercolor: {
        title: "Watercolor",
        url: "//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png"
    },
    hikebikemap: {
        title: "hikebikemap",
        url: "//toolserver.org/tiles/hikebike/{z}/{x}/{y}.png"
    },
    "OSM-monochrome": {
        title: "OSM-monochrome",
        url: "//www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png"
    },
    Hydda: {
        title: "Hydda",
        url: "//{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
    },
    OpenTopoMap: {
        title: "OpenTopoMap",
        url: "//{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    },
    OpenRiverboatMap: {
        title: "OpenRiverboatMap",
        url: "//tilecache.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png"
    }
}, jQuery(document).ready(function($) {
    var Templates = {}, sortDesc = !1;
    Templates.autocomplete = [ "{{#each features}}", '<li><a href="#" data-feature="{{jsonencode .}}" data-type="{{properties.type}}" tabindex="1000">', "   {{marks properties.label ../query}}", "   &nbsp;<i>{{_ properties.type}}</i>", "</a></li>", "{{/each}}" ], 
    Templates.shareLink = [ '<div class="uData-shareLink">', '<div class="linkDiv"><a href="#">intégrez cet outil de recherche sur votre site&nbsp;<i class="fa fa-share-alt"></i></a></div>', '<div class="hidden">', "   <h4>Vous pouvez intégrer cet outil de recherche de données sur votre site</h4>", "   <p>Pour ceci collez le code suivant dans le code HTML de votre page</p>", "   <pre>", "&lt;script&gt;window.jQuery || document.write(\"&lt;script src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js'&gt;&lt;\\/script&gt;\")&lt;/script&gt;", "", "&lt;!-- chargement feuille de style font-awesome --&gt;", '&lt;link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"&gt;', "", '&lt;script src="{{baseUrl}}udata.js"&gt;&lt;/script&gt;', '&lt;div class="uData-data"', '   data-q="{{q}}"', '   data-organizations="{{organizationList}}"', '   data-organization="{{organization}}"', '   data-page_size="{{page_size}}"', "&gt&lt;/div&gt", "   </pre>", "   <p>vous pouvez trouver plus d'info sur cet outil et son paramétrage à cette adresse: <a href='https://github.com/DepthFrance/udata-js' target='_blank'>https://github.com/DepthFrance/udata-js</a></p>", "</div>", "</div>" ], 
    Templates.parcelleData = [ '{{#ifCond adresse "!=" null}}', '<div class="position">', "<h4>position</h4>", "<table>", "<tr>", '<th class="position">coordonnées marqueur</th>', '<th class="adresse">Adresse estimée</th>', "</tr>", "<tr>", '<td class="position">{{latlng.lat}}, {{latlng.lng}}</td>', "{{#with adresse}}", '<td class="adresse">{{name}} {{postcode}} {{city}}</td>', "</tr>", "</table>", "</div>", "{{/with}}", "{{/ifCond}}", '{{#ifCond cadastre "!=" undefined}}', "{{#with cadastre}}", '<div class="cadastre">', "<h4>cadastre</h4>", "<table>", "<tr>", '<th class="parcelle_id">ID</th>', '<th class="code_dep">code_dep</th>', '<th class="code_com">code_com</th>', '<th class="nom_com">nom_com</th>', '<th class="code_arr">code_arr</th>', '<th class="com_abs">com_abs</th>', '<th class="feuille">feuille</th>', '<th class="section">section</th>', '<th class="numero">numero</th>', '<th class="surface_parcelle">surface parcelle</th>', "</tr>", "<tr>", '<td class="parcelle_id">{{../parcelle_id}}</td>', '<td class="code_dep">{{code_dep}}</td>', '<td class="code_com">{{code_com}}</td>', '<td class="nom_com">{{nom_com}}</td>', '<td class="code_arr">{{code_arr}}</td>', '<td class="com_abs">{{com_abs}}</td>', '<td class="feuille">{{feuille}}</td>', '<td class="section">{{section}}</td>', '<td class="numero">{{numero}}</td>', '<td class="surface_parcelle">{{round surface_parcelle}}m²</td>', "</tr>", "</table>", "</div>", "{{/with}}", "{{/ifCond}}", '{{#ifCond plu "!=" null}}', "{{#with plu}}", '<div class="plu">', "<h4>PLU</h4>", "<table>", "<tr>", '<th class="libelle">Libellé</th>', '<th class="txt">Texte</th>', "</tr>", "<tr>", '<td class="libelle">{{LIBELLE}}</td>', '<td class="txt">{{TXT}}</td>', "</tr>", "</table>", "</div>", "{{/with}}", "{{/ifCond}}", '{{#ifCond servitudes "!=" null}}', '<div class="servitudes">', "<h4>servitudes</h4>", '{{#ifCount servitudes "==" 0}}', "<ul>", "<li>aucune</li>", "</ul>", "{{else}}", "<p>La parcelle est concernée par {{count servitudes}} servitudes</p>", "<table>", "<tr>", '<th class="servitude_id">ID</th>', '<th class="name">nom</th>', '<th class="type">type</th>', '<th class="code_merimee">Code Mérimée</th>', "</tr>", "{{#each servitudes}}", "<tr>", '<td class="servitude_id"><div class="map" data-servitudeid="{{id}}"></div>{{id}}</td>', '<td class="name">{{nom}}</td>', '<td class="type">{{type}}</td>', '<td class="code_merimee">{{codeMerimee}}</td>', "</tr>", "{{/each}}", "</table>", "</ul>", "{{/ifCount}}", "</div>", "{{/ifCond}}" ];
    var baseUrl = jQuery('script[src$="/main.js"]')[0].src.replace("/main.js", "/../dist/"), _urbaclic = {};
    urbaClic = function(obj, options) {
        var container = obj, cadastre_min_zoom = 17, map = null, current_citycode = null, layers = {
            ban: null,
            adresse: null,
            parcelle: null
        }, backgroundLayers = {}, urbaClic_options = {
            showMap: !0,
            showData: !0,
            sharelink: !1,
            getadresse: !0,
            getservitude: !0,
            getPlu: !0,
            sharelink: !1,
            autocomplete_limit: 50,
            leaflet_map_options: {},
            background_layers: [ "OpenStreetMap", "MapQuest_Open", "OpenTopoMap" ]
        }, ban_query = null, cadastre_query = null, zoom_timeout = null, focusOff_timeout = null, loadParcelle_timeout = null, current_parcelle = {
            loadings: []
        };
        urbaClic_options = jQuery.extend(urbaClic_options, options);
        var autocomplete_params = {};
        for (var i in urbaClic_options) if (0 == i.search("autocomplete_")) {
            var k = i.substring("autocomplete_".length);
            autocomplete_params[k] = urbaClic_options[i];
        }
        var input = container.find("#urbaclic-search"), ban_options = autocomplete_params, default_template = function(feature) {
            var html = "";
            return jQuery.each(feature.properties, function(k, v) {
                html += "<tr><th>" + k + "</th><td>" + urbaClicUtils.urlify(v) + "</td></tr>";
            }), html = '<table class="table table-hover table-bordered">' + html + "</table>";
        }, circle_pointToLayer = function(feature, latlng) {
            var geojsonMarkerOptions = {
                radius: 3
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }, updateLayerController = function() {
            var loadedLayers = [];
            for (var i in layers) null != layers[i] && (loadedLayers[i] = layers[i]);
            map.layerController.removeFrom(map), map.layerController = L.control.layers(backgroundLayers, loadedLayers).addTo(map);
        };
        _urbaclic.addBackground = function(title, layer, show) {
            backgroundLayers[title] = layer, show === !0 && layer.addTo(map), updateLayerController();
        };
        var autocomplete = function() {
            ban_query && ban_query.abort(), input.prop("tabindex", 1e3);
            var t = input.val();
            if (t.length > 1) {
                var ul = container.find("ul.urbaclic-autocomplete");
                ul.length || (ul = jQuery('<ul class="urbaclic-autocomplete"></ul>').insertAfter(input).hide(), 
                ul.css("top", input.outerHeight() - 2));
                var url = BAN_API + "search/", params = ban_options;
                params.q = t, ban_query = jQuery.getJSON(url, params, function(data) {
                    if (ban_query = null, data.features.length) {
                        ul.html(Templates.autocomplete(data)).slideDown();
                        var tbindex = 1e3;
                        container.find("ul.urbaclic-autocomplete a").each(function() {
                            tbindex++, jQuery(this).prop("tabindex", tbindex);
                        }), 1 == data.features.length && initMarker(container.find("ul.urbaclic-autocomplete a").first().data());
                    } else ul.html("").fadeOut();
                });
            } else container.find("ul.urbaclic-autocomplete").html("").slideUp();
        };
        if (urbaClic_options.showMap) {
            jQuery(".urbaclic-map").length || jQuery('<div class="urbaclic-map"></div>').appendTo(container), 
            map = L.map(jQuery(".urbaclic-map")[0], urbaClic_options.leaflet_map_options).setView([ 46.6795944656402, 2.197265625 ], 4), 
            map.attributionControl.setPrefix(""), map.layerController = L.control.layers([], []).addTo(map);
            var first = !0;
            for (var i in urbaClic_options.background_layers) {
                var bl = urbaClic_options.background_layers[i];
                if ("string" == typeof bl) if (void 0 != urbaClicUtils.baseLayers[bl]) {
                    bl = urbaClicUtils.baseLayers[bl];
                    var l = L.tileLayer(bl.url), t = bl.title;
                    _urbaclic.addBackground(t, l, 0 == i), first && (l.addTo(map), first = !1);
                } else try {
                    bl = eval(bl);
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
        var addBanLayer = function(data) {
            layers.ban && map.removeLayer(layers.ban);
            var layer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    var html = default_template(feature);
                    layer.bindPopup(html);
                },
                pointToLayer: circle_pointToLayer,
                style: {
                    className: "ban"
                }
            }).addTo(map);
            return layers.ban = layer, updateLayerController(), layer;
        }, addAdressLayer = function(data) {
            layers.adresse && map.removeLayer(layers.adresse);
            var layer = L.marker([ data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0] ], {
                style: {
                    className: "adresse"
                },
                draggable: !0
            }).addTo(map);
            return layers.adresse = layer, updateLayerController(), layer;
        }, initMarker = function(params) {
            input.val(params.feature.properties.label), current_citycode = params.feature.properties.citycode, 
            layers.adresse && map.removeLayer(layers.adresse);
            ({
                latlng: L.latLng(params.feature.geometry.coordinates[1], params.feature.geometry.coordinates[0])
            });
            focusOff(), zoom_timeout && clearTimeout(zoom_timeout);
            var adresse_json = {
                type: "FeatureCollection",
                features: [ params.feature ]
            };
            layers.adresse = addAdressLayer(adresse_json), map.fitBounds(L.featureGroup([ layers.adresse ]).getBounds()), 
            loadParcelle(), layers.adresse.on("dragend", function(e) {
                clearTimeout(loadParcelle_timeout), loadParcelle_timeout = setTimeout(loadParcelle, 10);
            });
        }, loadParcelle = function() {
            var feature = layers.adresse.toGeoJSON(), marker_pos = {
                latlng: layers.adresse.getLatLng()
            };
            cadastre_query && cadastre_query.abort();
            var url = Cadastre_API + "cadastre/geometrie", qparams = {
                geom: JSON.stringify(feature)
            };
            cadastre_query = jQuery.getJSON(url, qparams, function(data) {
                if (data.features.length) {
                    layers.parcelle && map.removeLayer(layers.parcelle);
                    var layer = L.geoJson(data, {
                        onEachFeature: function(feature, layer) {
                            var html = default_template(feature);
                            layer.bindPopup(html);
                        },
                        style: {
                            className: "parcelle"
                        }
                    }).addTo(map);
                    map.fitBounds(layer.getBounds()), layers.parcelle = layer;
                    var parcelle_obj = layers.parcelle.getLayers()[0];
                    showData(parcelle_obj.feature, parcelle_obj, marker_pos);
                } else console.info("aucune parcelle trouvée à " + marker_pos.latlng.toString()), 
                loadClosest(marker_pos.latlng, current_citycode);
            });
        }, loadClosest = function(latlng, citycode) {
            console.info("recherche plus proche parcelle sur commune " + citycode), cadastre_query && cadastre_query.abort();
            var delta = 5e-4, bb = [ [ latlng.lat - delta, latlng.lng - delta ], [ latlng.lat + delta, latlng.lng + delta ] ], limit_geojson = L.rectangle(bb).toGeoJSON(), url = Cadastre_API + "cadastre/geometrie", qparams = (L.rectangle(map.getBounds()), 
            {
                geom: JSON.stringify(limit_geojson)
            });
            cadastre_query = jQuery.getJSON(url, qparams, function(data) {
                if (data.features.length) {
                    var layer = L.geoJson(data, {
                        onEachFeature: function(feature, layer) {
                            var html = default_template(feature);
                            layer.bindPopup(html);
                        },
                        style: {
                            className: "parcelle"
                        }
                    }), closest = urbaClicUtils.closestF.closestLayer(map, layer.getLayers(), latlng), parcelle = closest.layer;
                    if (parcelle) {
                        layers.parcelle && map.removeLayer(layers.parcelle), layers.parcelle = parcelle, 
                        parcelle.addTo(map), map.fitBounds(layers.parcelle.getBounds());
                        var marker_pos = {
                            latlng: closest.latlng
                        };
                        showData(parcelle.feature, parcelle, marker_pos);
                    }
                } else console.info("aucune parcelle trouvée");
            });
        }, getServitudesDetail = function() {
            var exemple = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[1.4412478,43.6082612],[1.4412321,43.608283],[1.4412157,43.6083198],[1.4412124,43.6083362],[1.4412129,43.6083494],[1.4412174,43.6083629],[1.4412262,43.6083779],[1.4412359,43.6083901],[1.4412502,43.6084037],[1.441268,43.6084169],[1.4412925,43.608431],[1.4413593,43.6084602],[1.4420934,43.6087783],[1.4421189,43.6087877],[1.4421488,43.6087948],[1.4421846,43.6088028],[1.4422125,43.6088065],[1.4422447,43.6088068],[1.4422806,43.6088074],[1.4423509,43.6088],[1.4423847,43.6087931],[1.4424154,43.6087853],[1.4424473,43.6087753],[1.4424598,43.6087687],[1.4424814,43.6087582],[1.4425016,43.608747],[1.4425282,43.6087283],[1.4425585,43.608706],[1.4425849,43.6086784],[1.4426028,43.6086577],[1.4426164,43.6086344],[1.4426286,43.60861],[1.4426393,43.6085774],[1.4426439,43.6085546],[1.4426422,43.6085276],[1.442637,43.6084934],[1.4426268,43.6084577],[1.4426137,43.608433],[1.4425875,43.6083981],[1.4425643,43.6083729],[1.4425318,43.6083446],[1.4424997,43.6083221],[1.4424767,43.60831],[1.4424701,43.6083065],[1.442414,43.6082802],[1.4424231,43.6082674],[1.4423022,43.6082102],[1.4422896,43.6082248],[1.4422332,43.6082],[1.4416873,43.6079607],[1.4416532,43.6079493],[1.4416239,43.6079428],[1.4415958,43.6079408],[1.4415692,43.6079431],[1.4415419,43.6079481],[1.4415214,43.6079563],[1.4414887,43.6079721],[1.4414636,43.6079894],[1.441466,43.6080011],[1.4414649,43.6080026],[1.4414508,43.6080209],[1.4414605,43.6080258],[1.4414147,43.6080792],[1.4414018,43.6080729],[1.4413164,43.6081766],[1.4413231,43.6081806],[1.4412769,43.6082392],[1.4412661,43.6082353],[1.4412478,43.6082612]]]]},"properties":{"test":"test"}}]}';
            container.find(".map[data-servitudeid]").each(function() {
                var map_container = jQuery(this), options = (map_container.data("servitudeid"), 
                jQuery.extend(urbaClic_options.leaflet_map_options, {
                    zoomControl: !1
                })), servitudes_map = L.map(map_container[0], options).setView([ 46.6795944656402, 2.197265625 ], 4);
                servitudes_map.attributionControl.setPrefix(""), L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(servitudes_map);
                var data = JSON.parse(exemple), layer = L.geoJson(data, {
                    onEachFeature: function(feature, layer) {
                        var html = default_template(feature);
                        layer.bindPopup(html);
                    },
                    style: {
                        className: "parcelle"
                    }
                });
                layer.addTo(servitudes_map), servitudes_map.fitBounds(layer.getBounds());
            });
        }, showData = function(feature, layer, evt) {
            map.fitBounds(layer.getBounds());
            var parcelleId = [ feature.properties.code_dep, feature.properties.code_com ];
            "000" != feature.properties.code_arr ? parcelleId.push(feature.properties.code_arr) : parcelleId.push(feature.properties.com_abs), 
            parcelleId.push(feature.properties.section), parcelleId.push(feature.properties.numero), 
            parcelleId = parcelleId.join(""), urbaClic_options.showData && (jQuery(".urbaclic-data").length || jQuery('<div class="urbaclic-data"></div>').appendTo(container)), 
            current_parcelle.data = {
                latlng: evt.latlng,
                parcelle_id: parcelleId,
                cadastre: feature.properties,
                adresse: null,
                servitudes: null
            };
            for (var i in current_parcelle.loadings) current_parcelle.loadings[i].abort();
            if (jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)), 
            urbaClic_options.getadresse) {
                var url = BAN_API + "reverse/", params = {
                    lon: current_parcelle.data.latlng.lng,
                    lat: current_parcelle.data.latlng.lat
                };
                current_parcelle.loadings.ban_query = jQuery.getJSON(url, params, function(data) {
                    addBanLayer(data), void 0 != data.features[0] && (current_parcelle.data.adresse = data.features[0].properties, 
                    jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)));
                });
            }
            if (urbaClic_options.getservitude) {
                var geom = layer.toGeoJSON();
                geom = geom.geometry;
                var url = URBA_API + "servitudes", params = {
                    geom: geom
                };
                $.ajax({
                    url: url,
                    type: "POST",
                    data: JSON.stringify(params),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) {
                        current_parcelle.data.servitudes = data, jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)), 
                        getServitudesDetail();
                    }
                });
            }
            if (urbaClic_options.getPlu) {
                var plu_data = {
                    LIBELLE: "Espace urbanisé",
                    TXT: "Description"
                };
                current_parcelle.data.plu = plu_data, jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data));
            }
        }, focusOff = function() {
            container.find("ul.urbaclic-autocomplete").slideUp();
        };
        return input.keydown(function(e) {
            setTimeout(autocomplete, 10);
        }).focusin(function() {
            clearTimeout(focusOff_timeout), container.find("ul.urbaclic-autocomplete").slideDown();
        }).focusout(function() {
            clearTimeout(focusOff_timeout), focusOff_timeout = setTimeout(focusOff, 200);
        }), container.on("click", "ul.urbaclic-autocomplete [data-feature]", function(e) {
            e.preventDefault(), initMarker(jQuery(this).data());
        }).on("mouseover", "ul.urbaclic-autocomplete", function(e) {
            clearTimeout(focusOff_timeout);
        }).on("focusin", "ul.urbaclic-autocomplete *", function(e) {
            clearTimeout(focusOff_timeout);
        }).on("focusout", "ul.urbaclic-autocomplete *", function(e) {
            clearTimeout(focusOff_timeout), focusOff_timeout = setTimeout(focusOff, 200);
        }), autocomplete(), _urbaclic.map = map, _urbaclic.loadParcelle = loadParcelle, 
        _urbaclic.initMarker = initMarker, _urbaclic;
    };
    var BAN_API = "https://api-adresse.data.gouv.fr/", URBA_API = "https://urbanisme.api.gouv.fr/", Cadastre_API = "https://apicarto.sgmap.fr/", checklibs = function() {
        var dependences = {
            Handlebars: "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.2/handlebars.min.js",
            i18n: "https://cdnjs.cloudflare.com/ajax/libs/i18next/1.6.3/i18next-1.6.3.min.js",
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"
        }, css = {
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css",
            css: baseUrl + "urbaclic.css"
        }, ready = !0;
        for (var i in css) 0 == jQuery('link[href="' + css[i] + '"]').length && jQuery('<link type="text/css" href="' + css[i] + '" rel="stylesheet">').appendTo("head");
        for (var i in dependences) "undefined" == typeof window[i] && (0 == jQuery('script[src="' + dependences[i] + '"]').length && jQuery('<script src="' + dependences[i] + '"></script>').appendTo("body"), 
        ready = !1);
        ready ? start() : setTimeout(checklibs, 100);
    }, start = function() {
        var container = _urbaclic.container;
        _urbaclic.lang = lang = "fr", i18n.init({
            resGetPath: baseUrl + "locales/urbaclic." + lang + ".json",
            lng: lang,
            load: "unspecific",
            interpolationPrefix: "{",
            interpolationSuffix: "}",
            fallbackLng: !1,
            fallbackOnEmpty: !0,
            fallbackOnNull: !0,
            nsseparator: "::",
            keyseparator: "$$"
        }, function(err, t) {}), Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("ifCount", function(v1, operator, v2, options) {
            var v1 = v1.length;
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("mark", function(text, key) {
            var match = text.match(new RegExp(key.trim(), "gi")), uniqueMatch = [];
            jQuery.each(match, function(i, el) {
                -1 === jQuery.inArray(el, uniqueMatch) && uniqueMatch.push(el);
            });
            for (var i in uniqueMatch) text = text.replace(new RegExp(uniqueMatch[i], "g"), "[** " + uniqueMatch[i] + " **]");
            return text = text.replace(/\[\*\* /g, "<mark>").replace(/ \*\*\]/g, "</mark>"), 
            new Handlebars.SafeString(text);
        }), Handlebars.registerHelper("marks", function(text, key) {
            var keys = key.trim().split(" ");
            for (var i in keys) {
                key = keys[i];
                var match = text.match(new RegExp(key, "gi")), uniqueMatch = [];
                null != match && jQuery.each(match, function(i, el) {
                    -1 === jQuery.inArray(el, uniqueMatch) && uniqueMatch.push(el);
                });
                for (var i in uniqueMatch) text = text.replace(new RegExp(uniqueMatch[i], "g"), "[** " + uniqueMatch[i] + " **]");
            }
            return text = text.replace(/\[\*\* /g, "<mark>").replace(/ \*\*\]/g, "</mark>"), 
            new Handlebars.SafeString(text);
        }), Handlebars.registerHelper("paginate", function(n, total, page_size) {
            var res = "", nPage = Math.ceil(total / page_size);
            if (1 == nPage) return "";
            for (var i = 1; nPage >= i; ++i) res += "<li" + (i == n ? ' class="active"' : "") + ">", 
            res += '<a href="#" data-page=' + i + ">" + i + "</a></li>";
            return '<nav><ul class="pagination">' + res + "</ul></nav>";
        }), Handlebars.registerHelper("taglist", function(tags) {
            var res = "";
            for (var i in tags) res += "<span class='label label-primary' >" + tags[i] + "</span> ";
            return res;
        }), Handlebars.registerHelper("trimString", function(passedString) {
            if (passedString.length > 150) {
                var theString = passedString.substring(0, 150) + "...";
                return new Handlebars.SafeString(theString);
            }
            return passedString;
        }), Handlebars.registerHelper("uppercase", function(passedString) {
            return passedString.toUpperCase();
        }), Handlebars.registerHelper("round", function(passedString) {
            return Math.round(parseFloat(passedString));
        }), Handlebars.registerHelper("count", function(passedString) {
            return passedString.length;
        }), Handlebars.registerHelper("truncate", function(str, len) {
            if (str && str.length > len && str.length > 0) {
                var new_str = str + " ";
                return new_str = str.substr(0, len), new_str = str.substr(0, new_str.lastIndexOf(" ")), 
                new_str = new_str.length > 0 ? new_str : str.substr(0, len), new Handlebars.SafeString(new_str + "...");
            }
            return str;
        }), Handlebars.registerHelper("default", function(value, defaultValue) {
            return null != value ? value : defaultValue;
        }), Handlebars.registerHelper("dt", function(value, options) {
            return moment(value).format(options.hash.format || "LLL");
        }), Handlebars.registerHelper("placeholder", function(url, type) {
            return url ? url : baseUrl + "img/placeholders/" + type + ".png";
        }), Handlebars.registerHelper("_", function(value, options) {
            if (!value || "string" != typeof value) return "";
            options.hash.defaultValue = "???";
            var res = i18n.t(value, options.hash);
            return "???" == res && (value = value.charAt(0).toLowerCase() + value.slice(1), 
            res = i18n.t(value, options.hash), res = res.charAt(0).toUpperCase() + res.slice(1)), 
            "???" == res && (value = value.charAt(0).toUpperCase() + value.slice(1), res = i18n.t(value, options.hash), 
            res = res.charAt(0).toLowerCase() + res.slice(1)), "???" == res ? (console.warn('i18n "' + value + '" NOT FOUND'), 
            value) : res;
        }), Handlebars.registerHelper("md", function(value) {
            return new Handlebars.SafeString(marked(value));
        }), Handlebars.registerHelper("mdshort", function(value, length) {
            if (value) {
                var EXCERPT_TOKEN = "<!--- --- -->", DEFAULT_LENGTH = 128;
                "undefined" == typeof length && (length = DEFAULT_LENGTH);
                var text, ellipsis;
                return value.indexOf("<!--- excerpt -->") && (value = value.split(EXCERPT_TOKEN, 1)[0]), 
                ellipsis = value.length >= length ? "..." : "", text = marked(value.substring(0, length) + ellipsis), 
                text = text.replace("<a ", "<span ").replace("</a>", "</span>"), new Handlebars.SafeString(text);
            }
        }), Handlebars.registerHelper("theme", function(value) {
            return new Handlebars.SafeString(baseUrl + "" + value);
        }), Handlebars.registerHelper("fulllogo", function(value) {
            return new Handlebars.SafeString(value);
        }), Handlebars.registerHelper("jsonencode", function(value) {
            return JSON.stringify(value, null, 4);
        });
        for (var tmpl in Templates) {
            var template_surcharge_id = "udata_template_" + tmpl;
            console.info("load template: #" + template_surcharge_id);
            var t = jQuery("#" + template_surcharge_id).first();
            t.length ? (Templates[tmpl] = t.html(), console.info("loaded.")) : console.info("not found, use default template."), 
            "string" != typeof Templates[tmpl] && (Templates[tmpl] = Templates[tmpl].join("\n")), 
            Templates[tmpl] = Handlebars.compile(Templates[tmpl]);
        }
        container = jQuery("#urbaclic"), container.length && (window.urbaClic_autoload = [], 
        container.each(function() {
            var obj = jQuery(this);
            window.urbaClic_autoload.push(urbaClic(obj, obj.data()));
        }));
    };
    checklibs();
});
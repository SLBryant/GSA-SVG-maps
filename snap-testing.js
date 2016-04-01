(function ($) {
    jQuery.fn.usaMap = function (settings) {
        var config = {
            'virginIslands': false,
            'guam': false,
            'puertoRico': false,
            'topBoxes': false,
            'theWorld': false,
            'mapTarget': false,
            'mapForm': false,
            'linkTemplate': false,
            'exceptions': false,
            'convertStates': false
        };
        if (settings) {
            $.extend(config, settings);
        }
        return this.each(function () {
            // Retrieve first item in selector defined by user
            var selector = $(this).get()[0];
            // create your Snap and append the map to it
            var s = new Snap(selector);
            Snap.load('images/US_map_MASTER.svg', function (response) {
                var map = response;
                s.append(map);
                s.attr({
                    fill: '#33a1d5',
                    stroke: "#eaeaea"
                });
                // Create the multiline text elements -- s.multitext format is x-offset, y-offset, text to chop into lines
                /*var worldMapText = s.multitext(300, 705, 'The State Department\nsets Foreign Rates.\nVisit the State Dept Site >');
                worldMapText.attr({
                    font: "19px Source Sans Pro",
                    'line-height': '1.1',
                    fill: '#333',
                    stroke: 'none',
                    display: 'none',
                    class: 'textBlocks',
                    class: 'topbox'
                });
                var otherStatesText = s.multitext(0, 605, 'The Department of Defense sets rates for\nAlaska, Hawaii, U.S. Territories, and Possessions (OCONUS rates).\nVisit DoD site >');
                otherStatesText.attr({
                    font: "19px Source Sans Pro",
                    'line-height': '1.1',
                    fill: '#333',
                    stroke: 'none',
                    display: 'none',
                    class: 'textBlocks'
                }); */
                var allTextLabels = Snap.selectAll('text');
                allTextLabels.forEach(function (elem, i) {
                    elem.attr({
                        'pointer-events': "none"
                    })
                });
                // show boxes and territories as user desires
                if (config.virginIslands) {
                    $('#VI').show();
                    $('#virginIslandsLabel').show();
                }
                if (config.guam) {
                    $('#GU').show();
                    $('#guamLabel').show();
                }
                if (config.puertoRico) {
                    $('#PR').show();
                    $('#puertoRicoLabel').show();
                }
                if (config.theWorld) {
                    $('#worldMap').show();
                    $('.textBlocks').show();
                    // assign click and hover functionality to world map
                    var world = Snap.select('#worldMap');
                    world.hover(function () {
                        this.attr({
                            fill: '#9bdaf9'
                        });
                    }, function () {
                        this.attr({
                            fill: '#33a1d5'
                        });
                    });
                    world.click(function () {
                        var win = window.open('https://aoprals.state.gov/content.asp?content_id=184&menu_id=78', '_blank');
                        if (win) {
                            win.focus();
                        } else {
                            alert('Please allow popups to allow a tab to open in a new window');
                        }
                    });
                }
                if (config.topBoxes) {
                    $('#topBoxes').show();
                    // assign hover functionality to American Samoa, Europe and East Asia
                    // click functionality to be added underneath this
                    var allGroupLabelBoxes = Snap.selectAll('g > rect');
                    allGroupLabelBoxes.forEach(function (elem, i) {
                        var topBoxes = ['american-samoa', 'europe', 'east-asia'];
                        elem.hover(function () {
                            this.attr({
                                fill: '#9bdaf9',
                                cursor: 'pointer'
                            });
                            $('svg').find('#topbox' + (topBoxes.indexOf(this.attr('id')) + 1)).attr({
                                fill: '#000',
                                stroke: 'none'
                            });
                        }, function () {
                            this.attr({
                                fill: '#c7c8c9',
                                cursor: 'auto'
                            });
                            $('svg').find('#topbox' + (topBoxes.indexOf(this.attr('id')) + 1)).attr({
                                fill: '#fff'
                            });
                        });
                    });
                }
                // create hover functionality for states
                var allPaths = Snap.selectAll('.state');
                var exceptions = ['MI', 'VI', 'PR', 'GU'];
                allPaths.forEach(function (elem, i) {
                    var id = elem.attr('id');
                    elem.hover(function () {
                        $('svg').find('text:contains(' + id + ')').not('.topbox').attr({
                            fill: '#000',
                            stroke: 'none'
                        });
                        this.attr({
                            fill: '#9bdaf9'
                        });
                        if (this.selectAll('path').length > 1 && exceptions.indexOf(id) === -1) {
                            this.select('.statebox').attr({
                                fill: '#9bdaf9'
                            });
                        }
                    }, function () {
                        $('svg').find('text:contains(' + id + ')').not('.topbox').attr({
                            fill: '#fff'
                        });
                        this.attr({
                            fill: '#33a1d5'
                        });
                        if (this.selectAll('path').length > 1 && exceptions.indexOf(id) === -1) {
                            this.select('.statebox').attr({
                                fill: '#c7c8c9'
                            });
                        }
                    });
                });
                // what do the clicks do??? read on!
                if (config.mapTarget == 'link') {
                    var statePaths = Snap.selectAll('.state')
                    var topBoxPaths = Snap.selectAll('g > rect');
                    statePaths.forEach(function (elem, i) {
                        var id = elem.attr('id');
                        elem.click(function () {
                            if (!config.convertStates) {
                                var stateName = convert_state(id, 'abbrev');
                            }
                            if (config.convertStates == 'name') {
                                var stateName = convert_state(id, 'name');
                            }
                            if (config.convertStates == 'nospaces') {
                                var stateName = convert_state(id, 'nospaces');
                            }
                            outPutHandler(stateName);
                        });
                    });
                    topBoxPaths.forEach(function (elem, i) {
                        var id = elem.attr('id');
                        elem.click(function () {
                            if (!config.convertStates) {
                                var stateName = convert_state(id, 'abbrev');
                            }
                            if (config.convertStates == 'name') {
                                var stateName = convert_state(id, 'name');
                            }
                            if (config.convertStates == 'nospaces') {
                                var stateName = convert_state(id, 'nospaces');
                            }
                            outPutHandler(stateName);
                        });
                    });
                }
                if (config.mapTarget == 'form') {
                    var form = $('#' + config.mapForm);
                    var statePaths = Snap.selectAll('.state');
                    var topBoxPaths = Snap.selectAll('g > rect');
                    statePaths.forEach(function (elem, i) {
                        var id = elem.attr('id');
                        elem.click(function () {
                            if (!config.convertStates) {
                                var stateName = convert_state(id, 'abbrev');
                            }
                            if (config.convertStates == 'name') {
                                var stateName = convert_state(id, 'name');
                            }
                            if (config.convertStates == 'nospaces') {
                                var stateName = convert_state(id, 'nospaces');
                            }
                            outPutHandler(stateName);
                        });
                    });
                    topBoxPaths.forEach(function (elem, i) {
                        var id = elem.attr('id');
                        elem.click(function () {
                            if (!config.convertStates) {
                                var stateName = convert_state(id, 'abbrev');
                            }
                            if (config.convertStates == 'name') {
                                var stateName = convert_state(id, 'name');
                            }
                            if (config.convertStates == 'nospaces') {
                                var stateName = convert_state(id, 'nospaces');
                            }
                            outPutHandler(stateName);
                        });
                    });
                }
                if (config.exceptions) {
                    for (i in config.exceptions) {
                        var exception = config.exceptions[i];
                        console.log(exception);
                        $(selector).find('#' + exception.state).click(function () {
                            window.open(exception.link);
                        });
                    }
                }
            });
            // show the world and assign click function
            // CONVERT STATE
            function convert_state(name, to) {
                console.log('CONVERT STATE', name, 'TO', to)
                var name = name.toUpperCase();
                var states = new Array({
                    'name': 'District of Columbia',
                    'abbrev': 'DC',
                    'region': '11'
                }, {
                    'name': 'Alabama',
                    'abbrev': 'AL',
                    'region': '4'
                }, {
                    'name': 'Alaska',
                    'abbrev': 'AK',
                    'region': '10'
                }, {
                    'name': 'Arizona',
                    'abbrev': 'AZ',
                    'region': '9'
                }, {
                    'name': 'Arkansas',
                    'abbrev': 'AR',
                    'region': '7'
                }, {
                    'name': 'California',
                    'abbrev': 'CA',
                    'region': '9'
                }, {
                    'name': 'Colorado',
                    'abbrev': 'CO',
                    'region': '8'
                }, {
                    'name': 'Connecticut',
                    'abbrev': 'CT',
                    'region': '01'
                }, {
                    'name': 'Delaware',
                    'abbrev': 'DE',
                    'region': '3'
                }, {
                    'name': 'Florida',
                    'abbrev': 'FL',
                    'region': '4'
                }, {
                    'name': 'Georgia',
                    'abbrev': 'GA',
                    'region': '4'
                }, {
                    'name': 'Guam',
                    'abbrev': 'GU',
                    'region': '9'
                }, {
                    'name': 'Hawaii',
                    'abbrev': 'HI',
                    'region': '9'
                }, {
                    'name': 'Idaho',
                    'abbrev': 'ID',
                    'region': '10'
                }, {
                    'name': 'Illinois',
                    'abbrev': 'IL',
                    'region': '5'
                }, {
                    'name': 'Indiana',
                    'abbrev': 'IN',
                    'region': '5'
                }, {
                    'name': 'Iowa',
                    'abbrev': 'IA',
                    'region': '6'
                }, {
                    'name': 'Kansas',
                    'abbrev': 'KS',
                    'region': '6'
                }, {
                    'name': 'Kentucky',
                    'abbrev': 'KY',
                    'region': '4'
                }, {
                    'name': 'Louisiana',
                    'abbrev': 'LA',
                    'region': '7'
                }, {
                    'name': 'Maine',
                    'abbrev': 'ME',
                    'region': '01'
                }, {
                    'name': 'Maryland',
                    'abbrev': 'MD',
                    'region': '3'
                }, {
                    'name': 'Massachusetts',
                    'abbrev': 'MA',
                    'region': '01'
                }, {
                    'name': 'Michigan',
                    'abbrev': 'MI',
                    'region': '5'
                }, {
                    'name': 'Minnesota',
                    'abbrev': 'MN',
                    'region': '5'
                }, {
                    'name': 'Mississippi',
                    'abbrev': 'MS',
                    'region': '4'
                }, {
                    'name': 'Missouri',
                    'abbrev': 'MO',
                    'region': '6'
                }, {
                    'name': 'Montana',
                    'abbrev': 'MT',
                    'region': '8'
                }, {
                    'name': 'Nebraska',
                    'abbrev': 'NE',
                    'region': '6'
                }, {
                    'name': 'Nevada',
                    'abbrev': 'NV',
                    'region': '9'
                }, {
                    'name': 'New Hampshire',
                    'abbrev': 'NH',
                    'region': '01'
                }, {
                    'name': 'New Jersey',
                    'abbrev': 'NJ',
                    'region': '2'
                }, {
                    'name': 'New Mexico',
                    'abbrev': 'NM',
                    'region': '7'
                }, {
                    'name': 'New York',
                    'abbrev': 'NY',
                    'region': '2'
                }, {
                    'name': 'North Carolina',
                    'abbrev': 'NC',
                    'region': '4'
                }, {
                    'name': 'North Dakota',
                    'abbrev': 'ND',
                    'region': '8'
                }, {
                    'name': 'Ohio',
                    'abbrev': 'OH',
                    'region': '5'
                }, {
                    'name': 'Oklahoma',
                    'abbrev': 'OK',
                    'region': '7'
                }, {
                    'name': 'Oregon',
                    'abbrev': 'OR',
                    'region': '10'
                }, {
                    'name': 'Pennsylvania',
                    'abbrev': 'PA',
                    'region': '3'
                }, {
                    'name': 'Rhode Island',
                    'abbrev': 'RI',
                    'region': '01'
                }, {
                    'name': 'South Carolina',
                    'abbrev': 'SC',
                    'region': '4'
                }, {
                    'name': 'South Dakota',
                    'abbrev': 'SD',
                    'region': '8'
                }, {
                    'name': 'Tennessee',
                    'abbrev': 'TN',
                    'region': '4'
                }, {
                    'name': 'Texas',
                    'abbrev': 'TX',
                    'region': '7'
                }, {
                    'name': 'Utah',
                    'abbrev': 'UT',
                    'region': '8'
                }, {
                    'name': 'Vermont',
                    'abbrev': 'VT',
                    'region': '01'
                }, {
                    'name': 'Virginia',
                    'abbrev': 'VA',
                    'region': '3'
                }, {
                    'name': 'Washington',
                    'abbrev': 'WA',
                    'region': '10'
                }, {
                    'name': 'West Virginia',
                    'abbrev': 'WV',
                    'region': '3'
                }, {
                    'name': 'Wisconsin',
                    'abbrev': 'WI',
                    'region': '5'
                }, {
                    'name': 'Wyoming',
                    'abbrev': 'WY',
                    'region': '8'
                }, {
                    'name': 'Puerto Rico',
                    'abbrev': 'PR',
                    'region': '2'
                }, {
                    'name': 'Virgin Islands',
                    'abbrev': 'VI',
                    'region': '2'
                });
                var output;
                $.each(states, function (index, value) {
                    console.log(states[index])
                    if (to == 'name') {
                        console.log('name')
                        if (value.abbrev == name) {
                            output = value.name;
                        }
                    } else if (to == 'abbrev') {
                        console.log('abbrev')
                        if (value.name.toUpperCase() == name || value.abbrev == name) {
                            output = value.abbrev;
                        }
                    } else if (to == 'nospaces') {
                        console.log('nospaces')
                        if (value.abbrev == name) {
                            value.name = value.name.replace(/\s+/g, '');
                            output = value.name;
                        }
                    }
                });
                console.log('RETURN', output)
                return output;
            }

            function outPutHandler(x) {
                if (config.mapTarget == 'link') {
                    window.open(config.linkTemplate + x);
                }
                if (config.mapTarget == 'form') {
                    $('#map_state').val(x);
                    $('#' + config.mapForm).submit();
                }
            }
        });
    }
})(jQuery);
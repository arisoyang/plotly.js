'use strict';

var color = module.exports = {},
    tinycolor = require('tinycolor2');

// IMPORTANT - default colors should be in hex for grid.js
color.defaults = [
    '#1f77b4', // muted blue
    '#ff7f0e', // safety orange
    '#2ca02c', // cooked asparagus green
    '#d62728', // brick red
    '#9467bd', // muted purple
    '#8c564b', // chestnut brown
    '#e377c2', // raspberry yogurt pink
    '#7f7f7f', // middle gray
    '#bcbd22', // curry yellow-green
    '#17becf' // blue-teal
];

color.defaultLine = '#444';
color.lightLine = '#eee';
color.background = '#fff';

color.scales = {
    'Greys':[[0,'rgb(0,0,0)'],[1,'rgb(255,255,255)']],

    'YIGnBu':[[0,'rgb(8, 29, 88)'],[0.125,'rgb(37, 52, 148)'],
        [0.25,'rgb(34, 94, 168)'],[0.375,'rgb(29, 145, 192)'],
        [0.5,'rgb(65, 182, 196)'],[0.625,'rgb(127, 205, 187)'],
        [0.75,'rgb(199, 233, 180)'],[0.875,'rgb(237, 248, 217)'],
        [1,'rgb(255, 255, 217)']],

    'Greens':[[0,'rgb(0, 68, 27)'],[0.125,'rgb(0, 109, 44)'],
        [0.25,'rgb(35, 139, 69)'],[0.375,'rgb(65, 171, 93)'],
        [0.5,'rgb(116, 196, 118)'],[0.625,'rgb(161, 217, 155)'],
        [0.75,'rgb(199, 233, 192)'],[0.875,'rgb(229, 245, 224)'],
        [1,'rgb(247, 252, 245)']],

    'YIOrRd':[[0,'rgb(128, 0, 38)'],[0.125,'rgb(189, 0, 38)'],
        [0.25,'rgb(227, 26, 28)'],[0.375,'rgb(252, 78, 42)'],
        [0.5,'rgb(253, 141, 60)'],[0.625,'rgb(254, 178, 76)'],
        [0.75,'rgb(254, 217, 118)'],[0.875,'rgb(255, 237, 160)'],
        [1,'rgb(255, 255, 204)']],

    'Bluered':[[0,'rgb(0,0,255)'],[1,'rgb(255,0,0)']],

    // modified RdBu based on
    // www.sandia.gov/~kmorel/documents/ColorMaps/ColorMapsExpanded.pdf
    'RdBu':[[0,'rgb(5, 10, 172)'],[0.35,'rgb(106, 137, 247)'],
        [0.5,'rgb(190,190,190)'],[0.6,'rgb(220, 170, 132)'],
        [0.7,'rgb(230, 145, 90)'],[1,'rgb(178, 10, 28)']],

    'Picnic':[[0,'rgb(0,0,255)'],[0.1,'rgb(51,153,255)'],
        [0.2,'rgb(102,204,255)'],[0.3,'rgb(153,204,255)'],
        [0.4,'rgb(204,204,255)'],[0.5,'rgb(255,255,255)'],
        [0.6,'rgb(255,204,255)'],[0.7,'rgb(255,153,255)'],
        [0.8,'rgb(255,102,204)'],[0.9,'rgb(255,102,102)'],
        [1,'rgb(255,0,0)']],

    'Rainbow':[[0,'rgb(150,0,90)'],[0.125,'rgb(0, 0, 200)'],
        [0.25,'rgb(0, 25, 255)'],[0.375,'rgb(0, 152, 255)'],
        [0.5,'rgb(44, 255, 150)'],[0.625,'rgb(151, 255, 0)'],
        [0.75,'rgb(255, 234, 0)'],[0.875,'rgb(255, 111, 0)'],
        [1,'rgb(255, 0, 0)']],

    'Portland':[[0,'rgb(12,51,131)'],[0.25,'rgb(10,136,186)'],
        [0.5,'rgb(242,211,56)'],[0.75,'rgb(242,143,56)'],
        [1,'rgb(217,30,30)']],

    'Jet':[[0,'rgb(0,0,131)'],[0.125,'rgb(0,60,170)'],
        [0.375,'rgb(5,255,255)'],[0.625,'rgb(255,255,0)'],
        [0.875,'rgb(250,0,0)'],[1,'rgb(128,0,0)']],

    'Hot':[[0,'rgb(0,0,0)'],[0.3,'rgb(230,0,0)'],
        [0.6,'rgb(255,210,0)'],[1,'rgb(255,255,255)']],

    'Blackbody':[[0,'rgb(0,0,0)'],[0.2,'rgb(230,0,0)'],
        [0.4,'rgb(230,210,0)'],[0.7,'rgb(255,255,255)'],
        [1,'rgb(160,200,255)']],

    'Earth':[[0,'rgb(0,0,130)'],[0.1,'rgb(0,180,180)'],
        [0.2,'rgb(40,210,40)'],[0.4,'rgb(230,230,50)'],
        [0.6,'rgb(120,70,20)'],[1,'rgb(255,255,255)']],

    'Electric':[[0,'rgb(0,0,0)'],[0.15,'rgb(30,0,100)'],
        [0.4,'rgb(120,0,100)'],[0.6,'rgb(160,90,0)'],
        [0.8,'rgb(230,200,0)'],[1,'rgb(255,250,220)']]
};

color.defaultScale = color.scales.RdBu;

color.getScale = function(scl, dflt) {
    if(!dflt) dflt = color.defaultScale;
    if(!scl) return dflt;

    function parseScale() {
        try {
            scl = color.scales[scl] || JSON.parse(scl);
        }
        catch(e) {
            scl = dflt;
        }
    }

    if(typeof scl === 'string') {
        parseScale();
        // occasionally scl is double-JSON encoded...
        if(typeof scl === 'string') parseScale();
    }

    if(!Array.isArray(scl)) return dflt;

    var highestVal = 0;
    var badScale = scl.some(function(si){
        if(si.length!==2) return true;
        if(si[0]<highestVal) return true;
        highestVal = si[0];
        return !tinycolor(si[1]).isValid();
    });

    if(badScale) return dflt;
    return scl;
};

function tinyRGB(tc) {
    var c = tc.toRgb();
    return 'rgb(' + Math.round(c.r) + ', ' +
        Math.round(c.g) + ', ' + Math.round(c.b) + ')';
}

color.rgb = function(cstr) { return tinyRGB(tinycolor(cstr)); };

color.opacity = function(cstr) { return cstr ? tinycolor(cstr).getAlpha() : 0; };

color.addOpacity = function(cstr, op) {
    var c = tinycolor(cstr).toRgb();
    return 'rgba(' + Math.round(c.r) + ', ' +
        Math.round(c.g) + ', ' + Math.round(c.b) + ', ' + op + ')';
};

// combine two colors into one apparent color
// if back has transparency or is missing,
// color.background is assumed behind it
color.combine = function(front, back){
    var fc = tinycolor(front).toRgb();
    if(fc.a===1) return tinycolor(front).toRgbString();

    var bc = tinycolor(back||color.background).toRgb(),
        bcflat = bc.a===1 ? bc : {
            r:255*(1-bc.a) + bc.r*bc.a,
            g:255*(1-bc.a) + bc.g*bc.a,
            b:255*(1-bc.a) + bc.b*bc.a
        },
        fcflat = {
            r:bcflat.r*(1-fc.a) + fc.r*fc.a,
            g:bcflat.g*(1-fc.a) + fc.g*fc.a,
            b:bcflat.b*(1-fc.a) + fc.b*fc.a
        };
    return tinycolor(fcflat).toRgbString();
};

color.stroke = function(s, c) {
    var tc = tinycolor(c);
    s.style({'stroke': tinyRGB(tc), 'stroke-opacity': tc.getAlpha()});
};

color.fill = function(s, c) {
    var tc = tinycolor(c);
    s.style({'fill': tinyRGB(tc), 'fill-opacity': tc.getAlpha()});
};

// search container for colors with the deprecated rgb(fractions) format
// and convert them to rgb(0-255 values)
color.clean = function(container) {
    if(!container || typeof container !== 'object') return;

    var keys = Object.keys(container),
        i,
        j,
        key,
        val;

    for(i = 0; i < keys.length; i++) {
        key = keys[i];
        val = container[key];

        // only sanitize keys that end in "color" or "colorscale"
        if(key.substr(key.length - 5) === 'color') {
            if(Array.isArray(val)) {
                for(j = 0; j < val.length; j++) val[j] = cleanOne(val[j]);
            }
            else container[key] = cleanOne(val);
        }
        else if(key.substr(key.length - 10) === 'colorscale' && Array.isArray(val)) {
            // colorscales have the format [[0, color1], [frac, color2], ... [1, colorN]]
            for(j = 0; j < val.length; j++) {
                if(Array.isArray(val[j])) val[j][1] = cleanOne(val[j][1]);
            }
        }
        // recurse into arrays of objects, and plain objects
        else if(Array.isArray(val)) {
            var el0 = val[0];
            if(!Array.isArray(el0) && el0 && typeof el0 === 'object') {
                for(j = 0; j < val.length; j++) color.clean(val[j]);
            }
        }
        else if(val && typeof val === 'object') color.clean(val);
    }
};

function cleanOne(val) {
    if($.isNumeric(val) || typeof val !== 'string') return val;

    var valTrim = val.trim();
    if(valTrim.substr(0,3) !== 'rgb') return val;

    var match = valTrim.match(/^rgba?\s*\(([^()]*)\)$/);
    if(!match) return val;

    var parts = match[1].trim().split(/\s*[\s,]\s*/),
        rgba = valTrim.charAt(3) === 'a' && parts.length === 4;
    if(!rgba && parts.length !== 3) return val;

    for(var i = 0; i < parts.length; i++) {
        if(!parts[i].length) return val;
        parts[i] = Number(parts[i]);

        // all parts must be non-negative numbers
        if(!(parts[i] >= 0)) return val;
        // alpha>1 gets clipped to 1
        if(i === 3) {
            if(parts[i] > 1) parts[i] = 1;
        }
        // r, g, b must be < 1 (ie 1 itself is not allowed)
        else if(parts[i] >= 1) return val;
    }

    var rgbStr = Math.round(parts[0] * 255) + ', ' +
        Math.round(parts[1] * 255) + ', ' +
        Math.round(parts[2] * 255);

    if(rgba) return 'rgba(' + rgbStr + ', ' + parts[3] + ')';
    return 'rgb(' + rgbStr + ')';
}

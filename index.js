/**
 * returns function f(x) ∈ [0,1] = k day traffic factor
 */
module.exports = (function() {
  var CURVE = '\
    M0,190 C25,190 19,20 27,20 C35,20 31,109 36,109 C41,109 39,40 44,40\
    C49,40 51,89 56,89 C61,89 59,24 65,24 C71,24 81,148 85,148\
    C89,148 87,111 90,111 C93,111 94,190 100,190';

  function cubicBizier(t, dots) {
    return Math.pow(1 - t, 3) * dots[0] + 
           3 * t * Math.pow(1 - t, 2) * dots[1] + 
           3 * Math.pow(t, 2) * (1 - t) * dots[2] + 
           Math.pow(t, 3) * dots[3];
  }
  var dailyCurveData = (function(curve) {
    return curve.trim().split(' C').map(function(group) {
      return group.trim().split(' ').map(function(coords) {
        return coords.trim().split(',').map(function(value) {
          return parseFloat(value.replace(/[^0-9.]/, '')) / 100;
        });
      });
    }).reduce(function(acc, cur, index, array) {
      return index > 0 
        ? [].concat(acc, [[].concat(array[index - 1].slice(-1), cur)])
        : acc;
    }, []);
  })(CURVE);

  var cache = [];
  
  return function(time) {
    if (cache[time]) return cache[time];
    if (time < 0 || time >1) throw 'time should be [0,1]';    
    var x = time; // from 0 to 1
    var tolerance = 1 / 1000;
    var part = dailyCurveData.reduce(function(acc, cur) {
      return x >= cur[0][0] && x <= cur[3][0] ? cur : acc;
    }, 0);
    function calcCoords(t) {
      return {
        x: cubicBizier(t, [ part[0][0], part[1][0], part[2][0], part[3][0] ]),
        y: 2 - cubicBizier(t, [ part[0][1], part[1][1], part[2][1], part[3][1] ]),
      };
    }
    var lower = 0;
    var upper = 1;
    var t = null;
    var dot = null;
    do {
      t = (upper + lower) / 2;
      dot = calcCoords(t);
      if (x > dot.x) {
        lower = t;
      } else {
        upper = t;
      }
    } while (Math.abs(x - dot.x) > tolerance);
    cache[time] = parseFloat(dot.y.toFixed(2));
    return cache[time];
  }
})();

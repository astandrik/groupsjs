fs = require('fs');

var groups = {};
var textGroups = fs.readFileSync('/home/nastia/workspace/groups/results_new_groups_EIGHT.txt', 'utf8')
             .split('\n')
             .map(function(item) {
               if(item.length !== 0) {
                 var elem = item.trim().split(' ');
                 groups[elem[0]] = elem.slice(1);
               }
             });


var interpretations = {};
var textInterpretations = fs.readFileSync('/home/nastia/workspace/inerpretationd_SIGHT', 'utf8')
             .split('\n')
             .map(function(item) {
               var elem = item.split(' ');
               if (elem[0] !== '') interpretations[parseInt(elem[0])] = elem.slice(1,-1).map(function(item) {return parseInt(item);});
            });


function countHorizontal(group) {
    var horizontal = 0;
    for (var groupNumber in group) {
        group[groupNumber].forEach(function(permNumber) {
          var permutation = interpretations[permNumber];
          if(permutation[2] == 4) horizontal += 1;
          if(permutation[3] == 3) horizontal += 1;
          if(permutation[4] == 6) horizontal += 1;
          if(permutation[5] == 5) horizontal += 1;
          if(permutation[2] == 6) horizontal += 1;
          if(permutation[5] == 3) horizontal += 1;
          if(permutation[3] == 5) horizontal += 1;
          if(permutation[4] == 4) horizontal += 1;
        });
    }
    return horizontal;
}

function countVertical(groupNumber) {
    var vertical = 0;
    groups[groupNumber].forEach(function(item) {
      var permutation = interpretations[item];
      if(permutation[0] == 3) vertical += 1;
      if(permutation[2] == 1) vertical += 1;
      if(permutation[1] == 4) vertical += 1;
      if(permutation[3] == 2) vertical += 1;
      if(permutation[2] == 5) vertical += 1;
      if(permutation[4] == 3) vertical += 1;
      if(permutation[3] == 6) vertical += 1;
      if(permutation[5] == 4) vertical += 1;
    });
    return vertical;
}

function filterGroups(restrictedVertices) {
    var newGroups = {};
    for (var e in groups) {
      var flag = true;
      groups[e].forEach(function(gr) {
        restrictedVertices.forEach(function(item) {
          if(interpretations[gr][item-1] != item) {
            flag = false;
          }
        });
      });
      if(flag) {
        newGroups[e] = groups[e];
      }
    }
    return newGroups;
}

var firstGroup = filterGroups([3]);
var secondGroup = filterGroups([1]);
console.log(Object.keys(interpretations));
console.log(countHorizontal(firstGroup));
console.log(countHorizontal(secondGroup));

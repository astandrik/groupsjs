fs = require('fs');

var groups = {};
var textGroups = fs.readFileSync('/home/nastia/workspace/Europe/results_new_groups_SIX.txt', 'utf8')
             .split('\n')
             .map(function(item) {
               if(item.length !== 0) {
                 var elem = item.trim().split(' ');
                 groups[elem[0]] = elem.slice(1);
               }
             });


var interpretations = {};
var textInterpretations = fs.readFileSync('/home/nastia/workspace/Europe/interpretations_SIX', 'utf8')
             .split('\n')
             .map(function(item) {
               var elem = item.split(' ');
               if (elem[0] !== '') interpretations[parseInt(elem[0])] = elem.slice(1,-1).map(function(item) {return parseInt(item);});
            });

var chains = [];
var textChains = fs.readFileSync('/home/nastia/workspace/Europe/results_new_SIX.txt', 'utf8')
                  .split('\n')
                  .map(function(item) {
                    var strVals = item.split(',');
                    var chain = [];
                    for(var i = 0; i < strVals.length; i = i + 3) {
                      chain.push(strVals[i]);
                    }
                    if(chain[0] !== '') chains.push(chain);
                  });

function countHorizontal(group) {
  var horizontal = 0;
    group.forEach(function(permNumber) {
      var permutation = interpretations[permNumber];
      if(permutation[2] == 4) horizontal += 4;
      if(permutation[3] == 3) horizontal += 4;
      if(permutation[4] == 6) horizontal += 8;
      if(permutation[5] == 5) horizontal += 8;

      if(permutation[2] == 6) horizontal += 6;
      if(permutation[5] == 3) horizontal += 6;
      if(permutation[3] == 5) horizontal += 6;
      if(permutation[4] == 4) horizontal += 6;

      if(permutation[0] == 2) horizontal += 1;
      if(permutation[1] == 1) horizontal += 1;
      if(permutation[0] == 4) horizontal += 2.5;
      if(permutation[3] == 1) horizontal += 2.5;
      if(permutation[1] == 3) horizontal += 2.5;
      if(permutation[2] == 2) horizontal += 2.5;
      if(permutation[0] == 6) horizontal += 4.5;
      if(permutation[5] == 1) horizontal += 4.5;
      if(permutation[1] == 5) horizontal += 4.5;
      if(permutation[4] == 2) horizontal += 4.5;
    });
  return horizontal;
}

function countVertical(group) {
  var vertical = 0;
    group.forEach(function(permNumber) {
      var permutation = interpretations[permNumber];
      if(permutation[2] == 5) vertical += 6;
      if(permutation[4] == 3) vertical += 6;
      if(permutation[3] == 6) vertical += 6;
      if(permutation[5] == 4) vertical += 6;

      if(permutation[2] == 6) vertical += 6;
      if(permutation[5] == 3) vertical += 6;
      if(permutation[3] == 5) vertical += 6;
      if(permutation[4] == 4) vertical += 6;

      if(permutation[0] == 3) vertical += 2.5;
      if(permutation[2] == 1) vertical += 2.5;
      if(permutation[1] == 4) vertical += 2.5;
      if(permutation[3] == 2) vertical += 2.5;
      if(permutation[3] == 1) vertical += 2.5;
      if(permutation[0] == 4) vertical += 2.5;
      if(permutation[1] == 3) vertical += 2.5;
      if(permutation[2] == 2) vertical += 2.5;
      if(permutation[0] == 6) vertical += 4.5;
      if(permutation[5] == 1) vertical += 4.5;
      if(permutation[1] == 5) vertical += 4.5;
      if(permutation[4] == 2) vertical += 4.5;
      if(permutation[0] == 5) vertical += 4.5;
      if(permutation[4] == 1) vertical += 4.5;
      if(permutation[1] == 6) vertical += 4.5;
      if(permutation[5] == 2) vertical += 4.5;
    });
  return vertical;
}


function countHorizontalForAll(groups) {
    var horizontal = 0;
    for (var groupNumber in groups) {
        horizontal += countHorizontal(groups[groupNumber]);
    }
    return horizontal;
}

function countVerticalForAll(groups) {
    var vertical = 0;
    for (var groupNumber in groups) {
        vertical += countVertical(groups[groupNumber]);
    }
    return vertical;
}

function countVerticalAvg(chains) {
    var vertical = 0;
    chains.forEach(function(chain) {
      vertical += chain.reduce(function(sum,curr){
        return sum + countVertical(groups[curr]);
      },0);
    });
    console.log(vertical);
    return vertical / chains.length;
}

function countHorizontalAvg(chains) {
    var horizontal = 0;
    chains.forEach(function(chain) {
      horizontal += chain.reduce(function(sum,curr){
        return sum + countHorizontal(groups[curr]);
      },0);
    });
    return horizontal / chains.length;
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

function filterConnections(connection) {
  var restrictedGroups = {};
  var newChains = [];
  for (var e in groups) {
    var flag = true;
    groups[e].forEach(function(gr) {
         if((interpretations[gr][connection[0] - 1] == connection[1])
          || (interpretations[gr][connection[1] - 1] == connection[0])) {
            restrictedGroups[gr] = 1;
          }
    });
  }

  chains.forEach(function(chain) {
    var flag = true;
    for(var i = 0; i < chain.length; i++) {
      if(restrictedGroups[chain[i]] == 1) {
        flag = false;
        break;
      }
    }
    if(flag) {
      newChains.push(chain);
    }
  });
  return newChains;
}

var firstChains = filterConnections([1,2]);
var secondChains = filterConnections([3,4]);
var chainIndexes1 = {vert: countVerticalAvg(firstChains), horiz: countHorizontalAvg(firstChains)};
var chainIndexes2 = {vert: countVerticalAvg(secondChains), horiz: countHorizontalAvg(secondChains)};

console.log(chainIndexes1);
console.log(chainIndexes2);

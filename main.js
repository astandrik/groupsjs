fs = require('fs');

var groups = {};
var textGroups = fs.readFileSync('../groupsc/results_new_groups_SIX.txt', 'utf8')
             .split('\n')
             .map(function(item) {
               if(item.length !== 0) {
                 var elem = item.trim().split(' ');
                 groups[elem[0]] = elem.slice(1);
               }
             });


var interpretations = {};
var textInterpretations = fs.readFileSync('../groupsc/memcount/interpretations_SIX', 'utf8')
             .split('\n')
             .map(function(item) {
               var elem = item.split(' ');
               if (elem[0] !== '') interpretations[parseInt(elem[0])] = elem.slice(1,-1).map(function(item) {return parseInt(item);});
            });

var chains = [];
var textChains = fs.readFileSync('../groupsc/results_new_SIX.txt', 'utf8')
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

function countVerticalSpread(chains) {
    var min = 99999999999;
    var max = 0;
    chains.forEach(function(chain) {
      var vertical = chain.reduce(function(sum, curr){
        return sum + countVertical(groups[curr]);
      },0);
      var sum = vertical;
      if(sum > max) max = sum;
      if(sum < min) min = sum;
    });
    return {min: min, max: max};
}

function countHorizontalSpread(chains) {
    var min = 99999999999;
    var max = 0;
    chains.forEach(function(chain) {
      var horizontal = chain.reduce(function(sum, curr){
        return sum + countHorizontal(groups[curr]);
      },0);
      var sum = horizontal;
      if(sum > max) max = sum;
      if(sum < min) min = sum;
    });
    return {min: min, max: max};
}

function countHorizontalAvg(chains) {
    var sum = 0;
    chains.forEach(function(chain) {
      var horizontal = chain.reduce(function(sum, curr){
        return sum + countHorizontal(groups[curr]);
      },0);
      sum += horizontal;
    });
    return Math.floor(sum / chains.length);
}

function countVerticalAvg(chains) {
    var sum = 0;
    chains.forEach(function(chain) {
      var vertical = chain.reduce(function(sum, curr){
        return sum + countVertical(groups[curr]);
      },0);
      sum += vertical;
    });
    return Math.floor(sum / chains.length);
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
            restrictedGroups[e] = 1;
          }
    });
  }

  chains.forEach(function(chain) {
    var flag = true;
    var newChain = [];
    for(var i = 0; i < chain.length; i++) {
      if(restrictedGroups[chain[i]] == 1) {
        break;
      } else {
        newChain.push(chain[i]);
      }
    }
    if(newChain.length > 1) {
      newChains.push(newChain);
    }
  });
  return newChains;
}

function intBetween(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function selectRandomChains(percentile, chains) {
  var selected = {};
  var newChains = [];
  var length = chains.length;
  while((newChains.length / length) < percentile) {
    var num = intBetween(0, chains.length - 1);
    while(selected[num]) num = intBetween(0, chains.length - 1);
    newChains.push(chains[num]);
    selected[num] = 1;
  }
  return newChains;
}

var firstChains = filterConnections([1,2]);
var secondChains = filterConnections([3,4]);
var chinaChains = chains;

var chI1 =  {overallVert: countVerticalAvg(firstChains),
  overallHor: countHorizontalAvg(firstChains),
  verticalSpread: countVerticalSpread(firstChains),
  horizontalSpread: countHorizontalSpread(firstChains)};

  var chI2 =  {overallVert: countVerticalAvg(secondChains),
    overallHor: countHorizontalAvg(secondChains),
    verticalSpread: countVerticalSpread(secondChains),
    horizontalSpread: countHorizontalSpread(secondChains)};

    var chI3 =  {overallVert: countVerticalAvg(chinaChains),
      overallHor: countHorizontalAvg(chinaChains),
      verticalSpread: countVerticalSpread(chinaChains),
      horizontalSpread: countHorizontalSpread(chinaChains)};

console.log("Всего траекторий: " + chains.length);

console.log("Общее среднее по вертикали для \"без нижнего\": " + chI1.overallVert);
console.log("Общее среднее по горизонтали для \"без нижего\": " + chI1.overallHor);
console.log("Общий разброс для \"без нижнего\" по вертикали: " + chI1.verticalSpread.min,'----',chI1.verticalSpread.max);
console.log("Общий разброс для \"без нижнего\" по горизонтали: " + chI1.horizontalSpread.min,'----',chI1.horizontalSpread.max);

console.log("Общее среднее по вертикали для \"без верхнего\": " + chI2.overallVert);
console.log("Общее среднее по горизонтали для \"без верхнего\": " + chI2.overallHor);
console.log("Общий разброс для \"без верхнего\" по вертикали: " + chI2.verticalSpread.min,'----',chI2.verticalSpread.max);
console.log("Общий разброс для \"без верхнего\" по горизонтали: " + chI2.horizontalSpread.min,'----',chI2.horizontalSpread.max);

console.log("Общее среднее по вертикали для \"все на месте\": " + chI3.overallVert);
console.log("Общее среднее по горизонтали для \"все на месте\": " + chI3.overallHor);
console.log("Общий разброс для \"все на месте\" по вертикали: " + chI3.verticalSpread.min,'----',chI3.verticalSpread.max);
console.log("Общий разброс для \"все на месте\" по горизонтали: " + chI3.horizontalSpread.min,'----',chI3.horizontalSpread.max);


for(var i = 0; i < 5; i++) {
  var percentile = 1/10;
  var chains1 = selectRandomChains(percentile, firstChains);
  var chains2 = selectRandomChains(percentile, secondChains);
  var chains3 = selectRandomChains(percentile, chinaChains);
  console.log("\nИтерация номер " + (i+1) + "\n ----------------------\n");
  console.log("Множество траекторий для первого дерева: " + chains1.length);
  console.log("Множество траекторий для второго дерева: " + chains2.length);
  var chainIndexes1 = {vert: countVerticalSpread(chains1), horiz: countHorizontalSpread(chains1)};
  var chainIndexes2 = {vert: countVerticalSpread(chains2), horiz: countHorizontalSpread(chains2)};
  var chainIndexes3 = {vert: countVerticalSpread(chains2), horiz: countHorizontalSpread(chains3)};
  var chainIndAvg11 = countVerticalAvg(chains1);
  var chainIndAvg12 = countHorizontalAvg(chains1);
  var chainIndAvg21 = countVerticalAvg(chains2);
  var chainIndAvg22 = countHorizontalAvg(chains2);
  var chainIndAvg31 = countVerticalAvg(chains3);
  var chainIndAvg32 = countHorizontalAvg(chains3);
  console.log("Разброс для \"без нижнего\" по вертикали: " + chainIndexes1.vert.min,'----',chainIndexes1.vert.max);
  console.log("Разброс для \"без нижнего\" по горизонтали: " + chainIndexes1.horiz.min,'----',chainIndexes1.horiz.max);
  console.log("Разброс для \"без верхнего\" по вертикали: " + chainIndexes2.vert.min,'----',chainIndexes2.vert.max);
  console.log("Разброс для \"без верхнего\" по горизонтали: " + chainIndexes2.horiz.min,'----',chainIndexes2.horiz.max);
  console.log("Разброс для \"все на месте\" по вертикали: " + chainIndexes3.vert.min,'----',chainIndexes3.vert.max);
  console.log("Разброс для \"все на месте\" по горизонтали: " + chainIndexes3.horiz.min,'----',chainIndexes3.horiz.max);
  console.log("Среднее по вертикали для \"без нижнего\": " + chainIndAvg11 + "\nСреднее по горизонтали для \"без нижнего\": " + chainIndAvg12);
  console.log("Среднее по вертикали для \"без верхнего\": " + chainIndAvg21 +"\nСреднее по горизонтали для \"без верхнего\": " + chainIndAvg22);
  console.log("Среднее по вертикали для \"все на месте\": " + chainIndAvg31 +"\nСреднее по горизонтали для \"все на месте\": " + chainIndAvg32);
}

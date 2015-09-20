function multiPerm(a, b) {
  var c = [];
  a.forEach(function(item,index) {
    c[index] = b[item-1];
  });
  return c;
}

function isPermInGroup(group, perm) {
  var result = false;
  group.forEach(function(item) {
    var flag = true;
    item.forEach(function(item,index) {
      if(perm[index] != item) {
        flag = false;
      }
    });
    if(flag === true) {
      result = true;
    }
  });
  return result;
}

function makeClosure(initGroup) {
  var flag = true;
  var newGroup = initGroup.slice();
  for(var i = 0; i < newGroup.length; i++) {
    for(var j = 0; j < newGroup.length; j++) {
      var newPermRight = multiPerm(newGroup[i], newGroup[j]);
      var newPermLeft = multiPerm(newGroup[j], newGroup[i]);
      if(!isPermInGroup(newGroup, newPermRight)) {
        newGroup.push(newPermRight);
        i = 0;
        j = 0;
      }
      if(!isPermInGroup(newGroup, newPermLeft)) {
        newGroup.push(newPermLeft);
        i = 0;
        j = 0;
      }
    }
  }
  return newGroup;
}

function factorial(n) {
  return n === 0 ? 1 : n * factorial(n-1);
}


function groupsOnVertices(n) {
  var sum = 0;
  for(var i = 1; i <= n; i++) {
    sum +=  factorial(n) / (factorial(n-i) * factorial(i));
  }
  return sum;
}

function getGroupsIn(startVert, endVert) {
  var i =
}

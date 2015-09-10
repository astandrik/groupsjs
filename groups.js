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
  var newGroup = [];
  for(var i = 0; i < initGroup.length; i++) {
    for(var j = 0; j < initGroup.length; j++) {
      var newPermRight = multiPerm(initGroup[i], initGroup[j]);
      var newPermLeft = multiPerm(initGroup[j], initGroup[i]);
      if(!isPermInGroup(initGroup, newPermRight)) {
        initGroup.push(newPermRight);
        i = 0;
        j = 0;
      }
      if(!isPermInGroup(initGroup, newPermLeft)) {
        initGroup.push(newPermLeft);
        i = 0;
        j = 0;
      }
    }
  }
  return initGroup;
}

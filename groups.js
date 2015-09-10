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

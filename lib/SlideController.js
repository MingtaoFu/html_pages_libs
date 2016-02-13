/**************************************************************************************
 * 触控
 */
function TCtrl() {
}

TCtrl.prototype.setConf = function(obj) {
  //var confListMust = ['ctrl', 'pageNum', 'speed', 'layout', 'toBeHidden'];
  //param: toBeHidden
  //要加一个to be display: none 的元素属性
  //对于堆叠形式的来说，要隐藏的就是要移动的类
  //但是对于平移来说，必须要设置需要被隐藏的类
  //而且，被隐藏的不应该是里面的小块（否则会导致长条缩短），而应该是小块里面的内容容器
  //(已加)


  //选项：回调效果是只显示一次还是每次都显示
  //只显示一次的话，考虑 设置标记 或 使用惰性加载
  //每次都显示的话，要考虑在移出之后，令其还原
  //(已加)

  //var confList = ['before', 'after'];

  /*
  for (var i in confListMust) {
    this[confListMust[i]] = obj[confListMust[i]];
  }
  */
  //不给对象设置属性，而是直接放在闭包里
  var currPage = 0;
  var lastPage = 0;
  var ctrl;
  var isMoving = true;
  var speed = obj.speed;
  var afterFunc = obj.afterFunc || [];
  var afterFuncOnce = obj.afterFuncOnce || true;
  //attachFunc 是在变化时附带的变化，每次触发
  var attachFunc = obj.attachFunc || [];
  var pageNum = obj.pageNum;
  var self = this;
  var toBeHidden = $('.' + obj.toBeHidden);

  var start = 0;

  this.setStart = function(theStart) {
    start = theStart;
  };

  this.setEnd = function(end) {
    pageNum = end + 1;
  };

  this.pageDown = function() {
    if(isMoving || pageNum - 1 === currPage) {
      return;
    }
    lastPage = currPage;
    currPage++;
    return true;
  };

  this.pageUp = function() {
    if(isMoving || currPage === start) {
      return;
    }
    lastPage = currPage;
    currPage--;
    return true;
  };

  this.enable = function() {
    isMoving = false;
  };

  this.disable = function() {

  };

  switch (obj.layout) {
    case 'flow':
      ctrl = $('#' + obj.ctrl);
      this.updateView = function(after) {
        $(toBeHidden[currPage]).show();
        after = after || afterFunc[currPage];

        if(afterFuncOnce === true) {
           afterFunc[currPage] = null;
        }
        //如果只执行一次则在一次执行完之后将 afterFunc 销毁(惰性加载)
        //失败，因为每一屏都共用该方法，手动将该屏的方法取消会影响到其他屏
        //于是改用上面的方法
        /*
        if(afterFuncOnce === true) {
          self.updateView = function() {
            $(toBeHidden[currPage]).show();
            isMoving = true;
            ctrl.animate({top: -currPage+'00%'}, speed, null).promise()
              .then(
                function(){
                  isMoving = false;
                  $(toBeHidden[lastPage]).hide();
                }
              );
            return ctrl;
          }
        }
        */

        isMoving = true;
        if(attachFunc[currPage]) {
          attachFunc[currPage]();
        }
        /*
        ctrl.animate({top: -currPage+'00%'}, speed, null).promise()
          .then(after).then(
          function(){
            console.log('haha')
            isMoving = false;
            $(toBeHidden[lastPage]).hide();
          }
        );
        */
        ctrl.animate({top: -currPage+'00%'}, speed, null, function() {
          if(after) {
            after(function() {
              isMoving = false;
              $(toBeHidden[lastPage]).hide();
            });
          } else {
            isMoving = false;
            $(toBeHidden[lastPage]).hide();
          }
        });
        return ctrl;
      };
      break;
    case 'stack':
      //堆叠翻页版本尚未完成，原因源自于如何将向上与向下提取出来
      //困难在于，平移版本是改变位置，至于到底是上还是下，无所谓
      //翻页版的话，除了要判断上还是下，还要看是哪个元素在动
      ctrl = $('.' + obj.ctrl);
      this.turnUp = function() {
        if(isMoving) {
          return;
        }
        var afterFunc = function() {
          if(after) {
            after();
          }
          isMoving = false;
        };
        isMoving = true;
        currPage--;
        $(ctrl[currPage-1]).animate({top: 0}, speed, 'linear', afterFunc);
      };
      this.turnDown = function() {
        if(isMoving) {
          return;
        }
        var afterFunc = function() {
          if(after) {
            after();
          }
          isMoving = false;
        };
        isMoving = true;
        currPage++;
        $(ctrl[currPage]).animate({top: '-100%'}, speed, 'linear', afterFunc);
      };
      break;
    default:
      throw new Error("Attribute layout's value is illegal.");
  }

  //绑定滑动事件
  $(document).touchwipe({
    wipeUp: function() {
      if(self.pageDown()) {
        self.updateView();
      }
    },
    wipeDown: function() {
      if(self.pageUp()) {
        self.updateView();
      }
    },
    min_move_x:10,
    min_move_y:10,
    preventDefaultEvents:true
  });

  obj = null;
};
/**************************************************************************************
 * 触控结束
 */
exports.TCtrl = TCtrl;


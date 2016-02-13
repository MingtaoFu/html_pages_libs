/**
 * author: Mingtao Fu
 * @param
 * ctrl: (string) 控制器 id, 一般为 section 外层容器
 * pageNum: (int) 翻页数量
 * speed: (int) 速度。其实是翻页所需时间(ms), 数值越大速度越慢
 * layout: (string) 布局。当前支持两种模式：flow(流), stack(堆叠)
 * toBeHidden: (string) 要隐藏块的类名。为了优化性能，将非激活页面设为 display: none
 * 	 对于堆叠形式的来说，要隐藏的就是要移动的类
 * 	 但是对于平移来说，必须要设置需要被隐藏的类
 *	 而且，被隐藏的不应该是里面的小块（否则会导致长条缩短），而应该是小块里面的内容容器
 * afterFunc: (function array) [option] 翻页结束后的回调函数。
 * afterFuncOnce: (boolean) [default: true] 回调效果是否只显示一次。
 *   目前是个鸡肋，因为如果不止显示一次，需要将动画重置。
 *
 */

function TCtrl() {
}

TCtrl.prototype.setConf = function(obj) {
  //不给对象设置属性，而是直接放在闭包里
  var currPage = 0;
  var lastPage = 0;
  var ctrl;
  var isMoving = true;
  var speed = obj.speed;
  var afterFunc = obj.afterFunc || [];
  var afterFuncOnce = obj.afterFuncOnce || true;
  //  var attachFunc = obj.attachFunc || [];
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

  obj = null;
};

exports.TCtrl = TCtrl;

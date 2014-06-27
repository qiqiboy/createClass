/**
 * @author qiqiboy
 * @github https://github.com/qiqiboy/createClass
 * @email imqiqiboy@gmail.com
 *
 * 创建类，返回类函数体。新建类实例时支持函数式和new实例化声明两种方式。
 * 实现原理是通过对象冒充，将实际的构造函数struct绑定到proxy实例中执行，以继承struct的属性和方法。
 * 支持继承，创建类时支持继承父类，支持一次继承多个父类。
 *
 * @params [{Function|Class|Object},...]
 *          构造函数或要继承的类或者原型对象，不限制个数，多个原型对象可以分开写。
 *          第一个参数如果是个函数，则当做默认构造函数。从第二个参数开始，出现的第一个类（函数）将则作为默认父类，其余类将会复制其属性和方法到原型，以实现多继承。
 *          _super 调用该方法只会执行第一个出现的类的构造函数，即默认父类的构造函数
 *
 * @return {Class} 返回包装后的类体构造函数，每个返回的类原型中都内置了几个方法：
 *          @method _self 原始构造函数
 *          @method _super 调用父类构造函数，以继承其自身属性
 *          @method extend 扩展类方法或者实例方法，继承类等
 *          @method isInstanceof 检测是否是某个类的实例，单继承时用原生的 instanceof 或者本方法都可以，
 *                               多继承情况下，必须用本方法才可以正确检测所有父类
 *
 * @example
 *      var Car=createClass(function(name){
 *          this.name=name;
 *      },{
 *          getName:function(){
 *              return this.name;
 *          }
 *      });
 *      var car1=Car('车辆1');
 *      var car2=new Car('车辆2');
 *      car1.getName(); //return '车辆1'
 *      car2.getName(); //return '车辆2'
 *
 *      //创建子类
 *      var Bike=createClass(function(name){
 *          this._super(name); //调用父类的构造函数，也可省略。this.name=name;
 *      },{
 *          getDesc:function(){
 *              return '这是一辆'+this.getName();
 *          }
 *      },Car);
 *      var bike=Bike('自行车');
 *      bike.getName(); //return '自行车'
 *      bike.getDesc(); //return '这是一辆自行车'
 *
 *      car1 instanceof Car //true
 *      bike instanceof Bike //true
 *      bike instanceof Car //true
 *      bike.isInstanceof(Car) //true
 *
 */

!function(ROOT,name,undefined){
    
   ROOT[name]=function(){
        var struct=arguments[0],
            args=[].slice.call(arguments,(isft(struct)&&!function(i){for(i in struct.prototype){return true}}()?1:(struct=noop,0))),
            parents=[];

        var ret={
            _self:struct,
            _super:function(){
                parents[0] && (parents[0].prototype._self||parents[0]).apply(this,arguments);
            },
            extend:function(){
                var self=this,
                    base=this===ret?[]:[this];
                return extend.apply(null,base.concat(map([{constructor:construct}].concat([].slice.call(arguments,0),ret).sort(sortFunc),function(arg){
                    isft(arg) && !self.isInstanceof(arg) && parents.push(arg);
                    return getObj(arg);
                })));
            },
            isInstanceof:function(Class){
                var self=this,
                    isto;
                return (this instanceof Class) || (function(){
                    for(var i=0,j=parents.length;i<j;i++){
                        isto=parents[i].prototype.isInstanceof;
                        if(parents[i]===Class || isto && isto.call(self,Class)){
                            return true;
                        }
                    }
                    return false;
                })();
            }
        }

        proxy.prototype=construct.fn=construct.prototype=ret.extend.apply(ret,args);

        construct.extend=function(){
            ret.extend.apply(this.fn,arguments);
            return construct;
        }

        return construct;

        function proxy(args){
            struct.apply(this,args);
        }
        function construct(){
            return new proxy(arguments);
        }
        
    }

    /**
     * 定义一些方法
     */ 

    function map(arr,func){
        for(var i=0,j=arr.length,ret=[],n;i<j;i++){
			if(typeof (n=func(arr[i])) !== 'undefined')
				ret.push(n);
		}
		return ret;
	}
    /**
     * 扩展合并数组或对象，拷贝对象（深拷贝 浅拷贝）
     * @param {object|array} target 要合并到的目标对象
     * @param [{object|array},...] 第二往后参数（最后一个参数如果为布尔型则不包含最后一个）为要合并的对象
     * @param {boolean} deep 最末参数表示是否深度拷贝
     *
     * @return target
     */
	function extend(){
		var len=arguments.length-1,
			deep=arguments[len],
			target=arguments[0]||{},
			type=typeof target,
			i=1,options,key,src,clone;
		if(typeof deep!=='boolean'){
			deep=false;
			len++;
		}
		if(type!='object' && type!='function'){
			target={};
		}

		for(;i<len;i++){
			if((options=arguments[i])!=null){
			    for(key in options){
				    src=target[key];
				    copy=options[key];
                    if(target===copy)continue;
				    target[key]=deep&&typeof copy=='object'&&copy!=null?extend(typeof src=='object'&&src!=null?src:({}).toString.call(copy)=='[object Array]'?[]:{},copy,deep):copy;
			    }
		    }
		}

		return target;
	}
    function sortFunc(a,b){
        var af=typeof a=='function',
            bf=typeof b=='function';
        return af==bf?0:af?-1:1;
    }
    function getObj(arg){
        if(isft(arg)){
            noop.prototype=arg.prototype;
            return extend(new noop);
        }
        return arg;
    }
    function isft(n){
        return typeof n=='function';
    }
    function noop(){}

}(window,'createClass');

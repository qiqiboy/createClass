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
 *          @Function _self 原始构造函数
 *          @method extend 扩展类方法或者实例方法，继承类等
 *          @method isInstanceof 检测是否是某个类的实例，单继承时用原生的 instanceof 或者本方法都可以，
 *                               多继承情况下，必须用本方法才可以正确检测所有父类
 *
 * @method-extend _super 在构造函数或者类方法中，可以_super来调用父类的构造函数或类方法
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
    "use strict"

    var createClass=ROOT[name]=function(){
        var struct=arguments[0],
            args=[].slice.call(arguments,(isFunction(struct)&&!function(i){for(i in struct.prototype){return true}}()?1:(struct=noop(),0))),
            parents=[],
            ret={
                _self:struct=wrap(struct,parents),
                extend:function(){
                    var self=this,
                        base=this===ret?[]:[this];
                    return extend.apply(null,base.concat(map([{constructor:construct}].concat(map(arguments,function(arg){
                        var prop,obj;

                        if(isFunction(arg)){
                            parents.push(obj=arg);
                        }else if(arg && typeof arg=='object'){
                            obj=arg;
                            for(prop in obj){
                                if(obj.hasOwnProperty(prop)&&isFunction(obj[prop])){
                                    obj[prop]=wrap(obj[prop],parents,prop);
                                }
                            }
                        }

                        return obj;
                    }),ret).sort(sortFunc),function(arg){
                        var np;
                        if(isFunction(arg)){
                            np=noop();
                            np.prototype=arg.prototype;
                            arg=new np;
                        }
                        return arg;
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
            };

        proxy.prototype=construct.fn=construct.prototype=ret.extend.apply(ret,args);

        construct.extend=function(){
            return createClass.apply(null,[].slice.call(arguments,0).concat(this));
        }

        return construct;

        function proxy(args){
            struct.apply(this,args);
        }

        function construct(){
            return new proxy(arguments);
        }
    };

    /**
     * 定义一些方法
     */ 

    function map(arr,iterate){
        for(var i=0,j=arr.length,ret=[],n;i<j;i++){
            if(typeof (n=iterate(arr[i],i,arr))!=='undefined')
                ret.push(n);
        }
        return ret;
    }

    function wrap(method, parents, prop){
        return function(){
            var orig=this._super,
                i=0,
                p,ret;

            this._super=noop();
            while(p=parents[i++]){
                if(null==prop){
                    this._super=p.prototype._self||p;
                    break;
                }

                if(isFunction(p.prototype[prop])){
                    this._super=p.prototype[prop];
                    break;
                }
            }

            ret=method.apply(this,arguments);
            this._super=orig;

            return ret;
        }
    }

    function extend(){
        var len=arguments.length,
            target=arguments[0],
            i=1,
            options,key,copy;

        for(;i<len;i++){
            if((options=arguments[i])!=null){
                for(key in options){
                    if(target===(copy=options[key]))continue;
                    target[key]=copy;
                }
            }
        }

        return target;
    }

    function sortFunc(a,b){
        var af=isFunction(a),
            bf=isFunction(b);
        return af==bf?0:af?-1:1;
    }

    function isFunction(n){
        return typeof n=='function';
    }

    function noop(){
        return new Function;
    }

}(window,'createClass');

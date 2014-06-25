createClass
===========

> 创建类、创建并继承多个父类的方法

## DEMO 示例

```javascript
var Car=createClass(function(name){
       this.name=name;
    },{
        getName:function(){
            return this.name;
        }
   });
   
var car1=Car('车辆1');
var car2=new Car('车辆2');
document.writeln(car1.getName()); //return '车辆1'
document.writeln(car2.getName()); //return '车辆2'

//继承父类
var Bike=createClass(function(name){
    this._super(name); //调用父类的构造函数，也可省略。this.name=name;
},{
    getDesc:function(){
        return '这是一辆'+this.getName();
    }
},Car);
var bike=Bike('自行车');
document.writeln(bike.getName()); //return '自行车'
document.writeln(bike.getDesc()); //return '这是一辆自行车'

//继承多个父类
function Drive(name){this.name=name;}
Drive.prototype.start=function(){
    this.status='driving';
}
Drive.prototype.stop=function(){
    this.status='stop';
}

var Bus=createClass(function(name,color){
        this._super(name);
        this.color=color;   
    },Drive,Bike,{			//继承Drive Bike两个类
        color:'black',
        getColor:function(){
            return this.color;
        },
        getDesc:function(){
            return '这是一辆'+this.getColor()+'的'+this.getName();
        }
    });
var bus=new Bus('汽车','红色');
document.writeln(bus.getColor()); //红色
document.writeln(bus.getDesc()); //这是一辆红色的汽车

bus.start();
document.writeln(bus.status); //driving


//扩展类或实例方法
Bike.extend({setColor:function(color){this.color=color;document.writeln(color);}}); //该例子添加了 setColor 方法到 Bike 类的原型。也可以使用 Bike.fn._extend({});
bike.extend({setName:function(name){this.name=name;document.writeln(name);}}); //该例子直接对bike对象添加了 setName 方法

bike.setColor('white'); //white
bike.setName('我的自行车'); //我的自行车
new Bike('又一辆自行车').setColor('white'); //white 因为setColor是绑定到Bike的原型中的，所以所有基于Bike派生的实例都具有这个方法，下面的setName则不是，会报错
try{new Bike('又一辆自行车').setName('我的自行车');}catch(e){document.writeln(e.message);} //TypeError: undefined is not a function.  


//继承类
NewClass=createClass();
Bike.extend(NewClass); //继承NewClass类
document.writeln(bike.isInstanceof(NewClass)) //true

document.writeln(car1 instanceof Car) //true
document.writeln(bike instanceof Bike) //true
document.writeln(bike instanceof Car) //true
document.writeln(bus instanceof Bus) //true
document.writeln(bus instanceof Drive) //true Drive是默认被继承的父类，所以原生instanceof可以检测，但是Bike是通过复制属性方法形式继承的，所以原生instanceof或返回false
document.writeln(bus instanceof Car) //false 同上
document.writeln(bus instanceof Bike) //false 同上
document.writeln(bus.isInstanceof(Bus)) //true 通过isInstanceof可以正确检测所有父类以及多重父类
document.writeln(bus.isInstanceof(Car)) //true
document.writeln(bus.isInstanceof(Bike)) //true
document.writeln(bus.isInstanceof(Drive)) //true

````
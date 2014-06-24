createClass
===========

> 创建类、创建并集成多个父类的方法

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
document.writeln(bus.status);

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
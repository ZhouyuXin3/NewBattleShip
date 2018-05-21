var view = {
    displayMessage: function(msg) {  /*接受一个参数——msg*/
        var messageArea = document.getElementById("messageArea"); /*获取网页中的元素messageArea*/
        messageArea.innerHTML = msg; /*将元素messageArea的innerHTML设置为Msg,更新该元素的文本*/
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);/*使用根据玩家猜测生成的id来获取要更新的元素*/
        cell.setAttribute("class", "hit");/*将这个元素的class特性设置为hit*/
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

//view.displayMiss("00");/*"A0"*/
//view.displayHit("34");/*"D4"*/
//view.displayMiss("55");/*"F5"*/
//view.displayHit("12");/*"B2"*/
//view.displayMiss("25");/*"C5"*/
//view.displayHit("26");/*"C6"*/

view.displayMessage("Tap tap, is this thing on?");

var model = { /* model是一个对象*/
    boardSize: 7,/* 游戏板网格大小 */
    numShips: 3,/* 游戏包含的战舰数 */
    shipLength: 3,/* 每艘战舰占据了多少个单元格 */
    shipsSunk: 0,/* 游戏开始时被初始化为0 */
    ships:  [{ locations: [0, 0, 0], hits: ["", "", ""] },  /*每艘战舰都是一个对象*/
             { locations: [0, 0, 0], hits: ["", "", ""] },       /*属性locations是一个数组，其中存储了战舰占据的游戏版单元格*/
             { locations: [0, 0, 0], hits: ["", "", ""] }],

    fire: function(guess) {/* 这个方法接受一个参数——guess */
        for (var i = 0; i < this.numShips; i++) {/* 遍历每艘战舰 */
            var ship = this.ships[i];/* 获得一艘战舰，检查guess是否是该战舰占据的位置之一 */
            var index = ship.locations.indexOf(guess);/* 将下面两行代码并成一行 */
            //locations = ship.locations;/* 获取战舰占据的位置，这是战舰的一个数组属性 */
            //var index = locations.indexOf(guess);/* 在数组中查找指定的值，如果找到就返回相应的索引，否则返回-1 */
            if (index >= 0) { /* 如果返回的索引大于或等于零，就意味着玩家猜测的值（guess）包含在数组locations中，因此集中了战舰 */
                ship.hits[index] = "hit";/* 将数组Hits的相应元素设置为“Hit” */
                view.displayHit(guess);/* 告诉视图，玩家的猜测集中了战舰 */
                view.displayMessage("HIT!");/* 并让视图显示消息“HIT” */
                if (this.isSunk(ship)) {/* 确定战舰被击中后，执行这个检查。如果战舰被击沉，就将击沉的战舰数（存储在model对象的属性shipsSunk中）加1 */
                    view.displayMessage("You sank my battleship!");/* 让玩家知道他击沉了一艘战舰 */
                    this.shipsSunk++;
                }
                return true;/* 击中了战舰需要返回true */
            }
        }
        view.displayMiss(guess);/* 告诉视图，玩家的猜测没有击中战舰 */
        view.displayMessage("You missed.");/* 让视图显示消息“You missed” */
        return false;/* 如果遍历所有战舰后，也没有发现被击中的战舰，就说明没有击中任何战舰，因此返回false */
    },
    isSunk: function(ship) {//我们将这个方法命名为isSunk 它接受一艘战舰作为参数，在该战舰被击沉时返回true，在它还浮在水面商时返回false
        for (var i = 0; i < this.shipLength; i++) {//这个方法将一艘战舰作为参数，并检查是否其每个部位都被击中
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocationS: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

        

};

            

//model.fire("53");
//model.fire("06");
//model.fire("16");
//model.fire("26");
//model.fire("34");
//model.fire("24");
//model.fire("44");
//model.fire("12");
//model.fire("11");
//model.fire("10");

function parseGuess(guess) { //它将一个格式为“A0”的猜测位置作为参数，将猜测的位置赋给形参guess
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];//一个数组，它包含可出现在有效猜测中的所有字母
    if (guess === null || guess.length !==2) { //然后检查guess不为null且长度为2
        alert("Oops, please enter a letter and a number on the board.");//如果不是这样的，就提醒玩家
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);//获取字符串中的第二个字符，它表示列号
        if (isNaN(row) || isNaN(column)) {//使用函数isNaN检查row和column是否都是数字
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
                   column < 0 || column >= model.boardSize) {//这里大量利用了自动类型转换！column是一个字符串，检查它的值是否在0和6之间时，我们利用了自动类型转换来将其转换为数字，以便进行比较
            alert("Oops, that's off the board!");//没有以硬编码的方式指定数字6，而是让模型告诉我们游戏板有多大，并同这个数字进行比较
        } else {
           return row + column;//至此，row和column都有效，因此返回他们
        }
    }
        return null;//如果执行到了这里，说明有检查是失败的，因此返回null
}

console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));



var controller = {
    guesses: 0, //这里定义了controller对象，它包含一个属性guesses，这个属性被初始化为0
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
};

//controller.processGuess("A0");
//controller.processGuess("A6");
//controller.processGuess("B6");
//controller.processGuess("C6");
//controller.processGuess("C4");
//controller.processGuess("D4");
//controller.processGuess("E4");
//controller.processGuess("B0");
//controller.processGuess("B1");
//controller.processGuess("B2");

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocationS();
};

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}


window.onload = init;
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}









"use strict";
/*
*main code
*/
const CONFIG = {
    plus: true,
    minus: true,
    divide: true,
    multiply: true,
    testCount: 10,
    minNumber: 1,
    maxNumber: 10,
    operations: ["+", "-", "/", "*"]
};
window.onload = function () {
    var userLang = navigator.language;
    var buttonApply = document.getElementById('buttonApply');
    var buttonGenerate = document.getElementById('buttonGenerate');
    var buttonSettings = document.getElementById('buttonSettings');
    var buttonCheck = document.getElementById('buttonCheck');
    var buttonClear = document.getElementById('buttonClear');
    var buttonOneMoreTime = document.getElementById('buttonOneMoreTime');
    // if ((userLang === "uk-UA") || (userLang === "ru-RU")) {
    //     buttonApply.innerHTML = "Примінити";
    //     buttonGenerate.innerHTML = "Згенерувати тест";
    //     buttonSettings.innerHTML = "Налаштування";
    //     buttonCheck.innerHTML = "Перевірити результати";
    //     buttonClear.innerHTML = "Очистити поля";
    //     buttonOneMoreTime.innerHTML = "Ще раз";
    // }
    buttonSettings.addEventListener('click', toggleHiddenInModalWindow);
    buttonApply.addEventListener('click', applySettings);
    buttonApply.addEventListener('click', clear);
    buttonApply.addEventListener('click', function () {
        document.getElementById('buttonGenerate').removeAttribute('disabled');
    });
    buttonGenerate.addEventListener('click', generateTest);
    buttonGenerate.addEventListener('click', function () {
        document.getElementById('buttonCheck').removeAttribute('disabled');
    });
    buttonCheck.addEventListener('click', checkTest);
    buttonCheck.addEventListener('click', congratulationsChallenger);
    buttonClear.addEventListener('click', clear);
    buttonOneMoreTime.addEventListener('click', oneMoreTime);
};

/*
*apply settings
 */
function getNumbers() {
    let result = [];
    CONFIG.testCount = document.getElementById('testCount').value;
    if (Number(CONFIG.testCount) > 10000) {
        alert('Nice try :)');
        CONFIG.testCount = 0;
        return
    }
    result.push(document.getElementById('testCount').value);
    CONFIG.minNumber = document.getElementById('minNumber').value;
    CONFIG.minNumber = parseInt(CONFIG.minNumber);
    result.push(document.getElementById('minNumber').value);
    CONFIG.maxNumber = document.getElementById('maxNumber').value;
    CONFIG.maxNumber = parseInt(CONFIG.maxNumber);
    result.push(document.getElementById('maxNumber').value);
    if (CONFIG.maxNumber < CONFIG.minNumber) {
        alert('Maximal value must be greater than minimal value.');
        return
    }
    return result
}
function getOperations() {
    let result = [];
    let plus = document.getElementById('plus').checked;
    let minus = document.getElementById('minus').checked;
    let divide = document.getElementById('divide').checked;
    let multiply = document.getElementById('multiply').checked;
    if (plus === true) {
        result.push("+");
        CONFIG.plus = 'true';
    } else {
        CONFIG.plus = false
    }
    if (minus === true) {
        result.push("-");
        CONFIG.minus = 'true';
    } else {
        CONFIG.minus = false
    }
    if (divide === true) {
        result.push("/");
        CONFIG.divide = 'true';
    } else {
        CONFIG.divide = false
    }
    if (multiply === true) {
        result.push("*");
        CONFIG.multiply = 'true';
    } else {
        CONFIG.multiply = false
    }
    CONFIG.operations = result;
}
function applySettings() {
    getNumbers();
    getOperations();
}
function toggleHiddenInModalWindow() {
    let modalWindow = document.getElementsByClassName('modal-window')[0];
    modalWindow.toggleAttribute('hidden')
}

/*
*generate test
 */
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}
function getRandomOperation(mas) {
    var result;
    var probability = Math.random();
    var counter = 0;
    mas.forEach(function (el) {
        counter++
    });
    if (counter === 0) {
        alert('Choose at least one operation');
        mas.operations.push("+");
        return
    }
    if (counter === 1) {
        result = mas[0]
    } else if (counter === 2) {
        probability > 0.5 ? result = mas[0] : result = mas[1];
    } else if (counter === 3) {
        if (probability < 0.33) {
            result = mas[0]
        } else if ((probability >= 0.33) && (probability < 0.66)) {
            result = mas[1]
        } else {
            result = mas[2]
        }
    } else if (counter === 4) {
        if (probability < 0.25) {
            result = mas[0]
        } else if ((probability >= 0.25) && (probability < 0.50)) {
            result = mas[1]
        } else if ((probability >= 0.50) && (probability < 0.75)) {
            result = mas[2]
        } else {
            result = mas[3]
        }
    }
    return result
}
function createTest() {
    var tests = document.getElementsByClassName('tests')[0];
    for (var i = 0; i < CONFIG.testCount; i++) {
        var test = document.createElement('div');
        var a = getRandomInteger(CONFIG.minNumber, CONFIG.maxNumber);
        var b = getRandomInteger(CONFIG.minNumber, CONFIG.maxNumber);
        var op = getRandomOperation(CONFIG.operations);
        var span = document.createElement('span');
        span.style.cssText = 'width: 80px; text-align: right;';
        span.innerHTML = a + ' ' + op + ' ' + b + ' = ';
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        var conclusion = document.createElement('span');
        conclusion.classList.add('conclusion');
        conclusion.style.cssText = 'width: 3rem';
        input.style.cssText = 'width: 50px; display: block';
        test.classList.add('test');
        test.setAttribute('id', 'test' + i);
        test.appendChild(span);
        test.appendChild(input);
        test.appendChild(conclusion);
        tests.appendChild(test);
    }
}
function generateTest() {
    clear();
    createTest()
}

/*
*check test results and clear + congratulations of the winner
 */
function evaluateStringEquation(str) {
    var newStr = '';
    for (var i = 0; i < str.length; i++) {
        if (str[i] !== '=') {
            newStr += str[i]
        }
    }
    return eval(newStr);
}
function checkTest() {
    for (var i = 0; i < CONFIG.testCount; i++) {
        var div = document.getElementById('test' + i);
        var text = div.getElementsByTagName('span')[0].innerHTML;
        var userAnswer = div.getElementsByTagName('input')[0].value;
        var conclusion = div.getElementsByClassName('conclusion')[0];
        if (evaluateStringEquation(text) === Number(userAnswer)) {
            conclusion.innerText = 'TRUE'
        } else {
            conclusion.innerText = 'false'
        }
    }
}
function clear() {
    document.getElementsByClassName('tests')[0].remove();
    var inner = document.getElementsByClassName('inner')[0];
    var tests = document.createElement('div');
    tests.classList.add('tests');
    inner.appendChild(tests);
    document.getElementById('buttonCheck').setAttribute('disabled', 'disabled');
}
function congratulationsChallenger() {
    var indicator = true;
    for (let i = 0; i < CONFIG.testCount; i++) {
        indicator = (indicator && (document.getElementsByClassName('conclusion')[i].innerText === "TRUE"));
    }
    if (indicator === true) {
        document.getElementsByClassName('inner')[0].setAttribute('hidden', 'hidden');
        document.getElementsByClassName('success')[0].removeAttribute('hidden');
        clear();
    }
}
function oneMoreTime() {
    document.getElementsByClassName('success')[0].setAttribute('hidden', 'hidden');
    document.getElementsByClassName('inner')[0].removeAttribute('hidden');
}

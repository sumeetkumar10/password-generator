const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
    //                 0->(max-min)           (min->max)
}

function getRandomNumbers(){
    return getRandomInteger(0,9);
}

function getLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function getUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function getSymbols() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let isUpper=false;
    let isLower=false;
    let isNumber=false;
    let isSymbol=false;

    if(uppercaseCheck.checked) isUpper=true;
    if(lowercaseCheck.checked) isLower=true;
    if(numbersCheck.checked) isNumber=true;
    if(symbolsCheck.checked) isSymbol=true;

    if(isUpper && isLower && (isNumber || isSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((isLower || isUpper) && (isNumber || isSymbol) && passwordLength >= 6 ) {
    setIndicator("#ff0");
    } 
    else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount==0){
        return ;
    }


    // Not Needed as it would initially set the value to the number of Checkboxes Ticked.
    // if(password<checkCount){
    //     passwordLength=checkCount;
    //     handleSlider();
    // }

    //Remove Old Password
    password="";

    // if(uppercaseCheck.checked){
    //     password+=getUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=getLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=getRandomNumber();
    // }
    // if(symbols.checked){
    //     password+=getSymbols();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(getUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(getLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(getRandomNumbers);
    }
    if(symbolsCheck.checked){
        funcArr.push(getSymbols);
    }

    // Compulsory Addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    // Remaining Addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }

    password=shufflePassword(Array.from(password));

    passwordDisplay.value=password;

    calcStrength();
})
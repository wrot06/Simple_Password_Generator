const output=document.getElementById("passwordOutput");
const generateBtn=document.getElementById("generateBtn");
const copyBtn=document.getElementById("copyBtn");

const lengthSlider=document.getElementById("lengthSlider");
const lengthValue=document.getElementById("lengthValue");

const uppercase=document.getElementById("uppercase");
const numbers=document.getElementById("numbers");
const special=document.getElementById("special");

loadSettings();

lengthSlider.addEventListener("input",()=>{

  lengthValue.innerText=lengthSlider.value;

  generatePassword();

});

uppercase.addEventListener("change",generatePassword);
numbers.addEventListener("change",generatePassword);
special.addEventListener("change",generatePassword);

generateBtn.addEventListener("click",generatePassword);

copyBtn.addEventListener("click",async()=>{

  if(!output.value)return;

  await navigator.clipboard.writeText(output.value);

  copyBtn.innerText="Copied";

  setTimeout(()=>{
    copyBtn.innerText="Copy";
  },1200);

});

function generatePassword(){

  let chars="abcdefghijklmnopqrstuvwxyz";

  if(uppercase.checked){
    chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if(numbers.checked){
    chars+="0123456789";
  }

  if(special.checked){
    chars+="!@#$%^&*()_+[]{}<>?";
  }

  let password="";

  const array=new Uint32Array(lengthSlider.value);

  crypto.getRandomValues(array);

  for(let i=0;i<lengthSlider.value;i++){

    password+=chars[array[i]%chars.length];

  }

  output.value=password;

  saveSettings(password);

}

function saveSettings(password){

  chrome.storage.local.set({

    savedPassword:password,
    passwordLength:lengthSlider.value,
    uppercase:uppercase.checked,
    numbers:numbers.checked,
    special:special.checked

  });

}

function loadSettings(){

  chrome.storage.local.get([
    "savedPassword",
    "passwordLength",
    "uppercase",
    "numbers",
    "special"
  ],(result)=>{

    if(result.passwordLength){

      lengthSlider.value=result.passwordLength;

      lengthValue.innerText=result.passwordLength;

    }

    if(result.uppercase!==undefined){
      uppercase.checked=result.uppercase;
    }

    if(result.numbers!==undefined){
      numbers.checked=result.numbers;
    }

    if(result.special!==undefined){
      special.checked=result.special;
    }

    if(result.savedPassword){

      output.value=result.savedPassword;

    }else{

      generatePassword();

    }

  });

}
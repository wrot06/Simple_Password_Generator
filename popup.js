const output=document.getElementById("passwordOutput");
const generateBtn=document.getElementById("generateBtn");
const copyBtn=document.getElementById("copyBtn");

const lengthSlider=document.getElementById("lengthSlider");
const lengthValue=document.getElementById("lengthValue");

const uppercase=document.getElementById("uppercase");
const numbers=document.getElementById("numbers");
const special=document.getElementById("special");

loadPassword();

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

  savePassword(password);

}

function savePassword(password){

  chrome.storage.local.set({
    savedPassword:password
  });

}

function loadPassword(){

  chrome.storage.local.get(["savedPassword"],(result)=>{

    if(result.savedPassword){

      output.value=result.savedPassword;

    }else{

      generatePassword();

    }

  });

}
/*
----------------------------------------------
 *  Project:    Digital Pet Puppy Clock Face
 *  Mail:       darahbass@gmail.com
 *  Github:     SarahBass
 ---------------------------------------------
 NOTES: 
 This Clock will be larger than normal
 because it has so many animations. 
 
 Images are ALL original artwork 
 ---------------------------------------------
*/

/*--- Import Information from user Account ---*/
import { settingsStorage } from "settings";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from 'power';
import { display } from "display";
import { today as userActivity } from "user-activity";
import {goals, today} from "user-activity";
import { units } from "user-settings";

/*--- Create Local Variables for Information Storage ---*/
let daytext = "day";
let monthtext = "month";
let goalreached = "NONE";


/*--- Import Information from index.gui ---*/

let background = document.getElementById("background");
let ampm = document.getElementById("ampm");  
let date = document.getElementById("date");
let dog = document.getElementById("dog");
let monthobject = document.getElementById("monthobject");
let hearts = document.getElementById("hearts");
let version = 0;
let bg = 0;
const button1 = document.getElementById("button-2");
//Update the clock every second 
clock.granularity = "seconds";

// Get a handle on the <text> elements 
const myLabel = document.getElementById("myLabel");
const batteryLabel = document.getElementById("batteryLabel");
const stepsLabel = document.getElementById("stepsLabel");
const firelabel = document.getElementById("firelabel");
const boltlabel = document.getElementById("boltlabel");
const heartlabel = document.getElementById("heartlabel");
const stairslabel = document.getElementById("stairslabel");
const distancelabel = document.getElementById("distancelabel");



  
  if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
   const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    heartlabel.text = (`${hrm.heartRate}`);

  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
  }else {heartlabel.text = "off";}



/*--- CLOCK START ---*/
clock.ontick = (evt) => {

  let today = evt.date;
  let hours = today.getHours();
  let months = today.getMonth();
  let days = today.getDay();
  let dates = today.getDate();
  let years = today.getFullYear();
  let mins = util.zeroPad(today.getMinutes());
  let seconds = today.getSeconds();
  

 /*--- Update Stats for Screen ---*/
  updateScene();
  if (units.distance == "us"){
  distancelabel.text = (0.000621371 * userActivity.adjusted.distance).toFixed(1) + " mi";}
  else {distancelabel.text = (0.001 * userActivity.adjusted.distance).toFixed(1) + " km";}

  stairslabel.text = userActivity.adjusted.elevationGain;
  stepsLabel.text = userActivity.adjusted.steps;
  firelabel.text = userActivity.adjusted.calories;
 // targetlabel.text = parseInt(userActivity.adjusted.steps/goals.steps * 100) + "%";
  boltlabel.text = userActivity.adjusted.activeZoneMinutes.total;
  heartlabel.text = "off";  
  checkAndUpdateBatteryLevel();

  
  //AM PM -Change the image based on 24 hours
  if (util.zeroPad(hours) >= 12){ampm.text = "pm";}
  else{ampm.text = "am";}
  
  
  //Give dog hearts based on goal
   //Get Prize from Steps Goal goals.steps
  if (userActivity.adjusted.steps < goals.steps/5){hearts.image = "blank.png";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*2)/5) && (userActivity.adjusted.steps > ((goals.steps*1)/5))) 
  {hearts.image = "hearts/heart1.png";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*3)/5)&& (userActivity.adjusted.steps > ((goals.steps*2)/5)))
  {hearts.image = "hearts/heart2.png";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*4)/5)&& (userActivity.adjusted.steps > ((goals.steps*3)/5)))
           {hearts.image = "hearts/heart3.png";}
  else if ((userActivity.adjusted.steps < goals.steps)&& (userActivity.adjusted.steps > ((goals.steps*4)/5)))
           {hearts.image = "hearts/heart4.png";}
  else if (userActivity.adjusted.steps > goals.steps){hearts.image = "hearts/heart5.png";}
  else {hearts.image = "blank.png";}
  
  //Change Background
  
    if (((util.zeroPad(hours) >= 0) && (util.zeroPad(hours) < 5)) || (util.zeroPad(hours) >= 22)){
                    background.image = "night.jpeg";
                    distancelabel.class = "labelnightblue";
                    firelabel.class  = "labelnightblue";
                    boltlabel.class  = "labelnightblue";
                    heartlabel.class  = "labelnightblue";
                    stairslabel.class  = "labelnightblue";
                  }else{
                    background.image = "greenbg.jpeg";
                    distancelabel.class = "labellightblue";
                    firelabel.class  = "labellightblue";
                    boltlabel.class  = "labellightblue";
                    heartlabel.class  = "labellightblue";
                    stairslabel.class  = "labellightblue";
                  }
  
  //button
  button1.onactivate = function(evt) { version++; }
  
  if (version > 2){version = 0;}
  
  //change dog
  if (bg == 0) {dog.image = "dog/dog" + bg + "v" + version + "m"+ mins%3+ "a"+ seconds%2+ ".png";}
  else{
  dog.image = "dog/dog" + bg + "v" + version + "m"+ mins%2+ "a"+ seconds%2+ ".png";}
  
  //Change Foreground
     if (((util.zeroPad(hours) >= 0) && (util.zeroPad(hours) <= 5)) || (util.zeroPad(hours) >= 20)){ 
                  monthobject.image="background/"+ months+ "2.png";
                  bg = 2;             
     } else if (((util.zeroPad(hours) > 5 ) && (util.zeroPad(hours) < 12 )) || ((util.zeroPad(hours) > 18) &&                              (util.zeroPad(hours) < 20 ))){ 
       monthobject.image="background/"+ months+ "0.png"; 
        bg = 0;        
     }else if ((util.zeroPad(hours) >= 12) && (util.zeroPad(hours) <= 18 )){
                   monthobject.image="background/"+ months+ "1.png";
                   bg = 1;
     }else { monthobject.image="blank.png";
                   bg= 0 ;}
  
   /*--- OPTION 2: TIME IMAGES FOR 12 HOUR CLOCK---*/
  //set class of each # IMAGE individually if needed for formatting
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }else {hours = util.zeroPad(hours);}
  myLabel.text = `${hours}:${mins}`; 
  /*----------------------------SHOW CLOCK END----------------------------------*/                      

/*
  /*--- Battery Functions ---*/
  display.addEventListener('change', function () { if (this.on) {checkAndUpdateBatteryLevel();}
                                             
});
/*----------------------------END OF ON TICK-----------------------------------*/
  
/*----------------------------START OF FUNCTIONS--------------------------------*/

 /*--- Change Battery RED , GREEN & CHARGE ---*/  

function checkAndUpdateBatteryLevel() {
  batteryLabel.text = `${battery.chargeLevel}%`;
  if (battery.chargeLevel > 30){ batteryLabel.class = "labelgreen";}
  else {batteryLabel.class = "labelred";
        battery.onchange = (charger, evt) => {batteryLabel.class = "labelgreen";}}
}
 
  
  
/*--- Change Date and Background Functions ---*/

  function updateScene() {

   date.text = " " + daytext + " " + monthtext + " " + dates + " " + years + " ";  
  if (months == 0){monthtext = "January";}
  else if (months == 1){monthtext =  "February";}
  else if (months == 2){monthtext =  "March";}
  else if (months == 3){monthtext =  "April";}
  else if (months == 4){monthtext =  "May";}
  else if (months == 5){monthtext =  "June";}
  else if (months == 6){monthtext =  "July";}
  else if (months == 7){monthtext =  "August";}
  else if (months == 8){monthtext =  "Septemper";}
  else if (months == 9){monthtext =  "October";}
  else if (months == 10){monthtext = "November";}
  else if (months == 11){monthtext = "December";}
  else {monthtext = "MONTH";}
    
  if (days == 0){daytext =      "Sunday,";}
  else if (days == 1){daytext = "Monday,";}
  else if (days == 2){daytext = "Tuesday,";}
  else if (days == 3){daytext = "Wednesday,";}
  else if (days == 4){daytext = "Thursday,";}
  else if (days == 5){daytext = "Friday,";}
  else if (days == 6){daytext = "Saturday,";}
  else {daytext = "DAY";}
 }

}
/*----------------------------END OF FUNCTIONS--------------------------------*/
/*-------------------------------END OF CODE----------------------------------*/


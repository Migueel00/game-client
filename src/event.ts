import { Key, Sound } from "./constants.js";
import globals from "./globals.js";
import { initScores } from "./initialize.js";

export function keydownHandler(event : KeyboardEvent) : void{
    
    switch(event.keyCode){
        case Key.UP:
            globals.action.moveUp = true;
            break;

        case Key.DOWN:
            globals.action.moveDown = true;
            break;

        case Key.LEFT:
            globals.action.moveLeft = true;
            break;

        case Key.RIGHT:
            globals.action.moveRight = true;
            break;
        
        case Key.ATTACK:
            globals.action.attack   = true;
            break;

        case Key.DAMAGE:
            globals.action.damage   = true;
            break;
            
        case Key.HEAL:
            globals.action.heal     = true;
            break;
        
        case Key.ENTER:
            globals.action.enter    = true;
            break;
        
        case Key.ESCAPE:
            globals.action.escape   = true;
            break;
    }
}

export function keyupHandler(event: KeyboardEvent) : void{
    switch(event.keyCode){

        case Key.UP:
            globals.action.moveUp   = false;
            break;

        case Key.DOWN:
            globals.action.moveDown = false;
            break;

        case Key.LEFT:
            globals.action.moveLeft = false;
            break;
            
        case Key.RIGHT:
            globals.action.moveRight = false;
            break;
        
        case Key.ATTACK:
            globals.action.attack   = false;
            break;
        
        case Key.DAMAGE:
            globals.action.damage   = false;
            break;
        
        case Key.HEAL:
            globals.action.heal     = false;
            break;
        
        case Key.ENTER:
            globals.action.enter    = false;
            break;

        case Key.ESCAPE:
            globals.action.escape   = false;
            break;
    }
}



// GET, POST events
export function getPlayerData(): void{
    fetch('http://localhost:3000/api/highscores')
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(json => {
            console.log(JSON.stringify(json));
            const data = json.data;
            initScores(data);
        })
        .catch(error => console.error('Error fetching data: ' , error));
}


export function createUserName(key: string) : void{

    if(key.match(/[a-z]/) && globals.username.length < 3 && globals.menuTimer.value != 0){
        globals.username += key;
        return;
    }    
}

//POST 
export function postNewScore(): void{

    const name  = globals.username.toUpperCase();
    const score = globals.points;

    const dataToSend  = {
        player: name,
        scores: score
    }

    fetch('http://localhost:3000/api/highscores', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json' 
        },
        body: JSON.stringify(dataToSend),

    }).then(response => {
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => console.log(JSON.stringify(response)))
        .catch(error => console.error('Error posting data' , error));
}

export function updateMusic() : void{
    const buffer = 0.28;
    const music  = globals.sounds[Sound.GAME_MUSIC];

    if(music.currentTime > music.duration - buffer){

        music.currentTime = 0;
        music.play();
    }

}




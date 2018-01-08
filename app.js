import React from "react";
import Ennemy from "./ennemy";
import Loop from "./loop";
import Game from "./game";
import Player from "./player";
import Events from "./events";

class App extends React.Component{
    constructor(){
        super();
        this.ennemyCount = 0;
    }
    render(){
        if(this.ennemyCount < 10){
            this.ennemyCount++;
        }

        let ennemies = [];

        for(let i = 0; i < this.ennemyCount; i++){
            ennemies.push((<Ennemy key={i} />));
        }

        if(this.ennemyCount < 10){
            setTimeout(() => {
                this.forceUpdate();
            }, 1000);
        }

        return (
            <Loop>
                <Events>
                    <Game>
                        <Player />
                        {ennemies}
                    </Game>
                </Events>
            </Loop>
        )
    }
}

export default App;

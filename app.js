import React from "react";
import Ennemy from "./ennemy";
import Loop from "./loop";
import Game from "./game";
import Player from "./player";
import Events from "./events";

class App extends React.Component{
    render(){
        return (
            <Loop>
                <Events>
                    <Game>
                        <Player />
                    </Game>
                </Events>
            </Loop>
        )
    }
}

export default App;

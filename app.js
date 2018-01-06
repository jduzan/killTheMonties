import React from "react";
import Ennemy from "./ennemy"
import Loop from "./loop"
import Game from "./game"

class App extends React.Component{
    render(){
        return (
            <Loop>
                <Game>
                    <Ennemy />
                </Game>
            </Loop>
        )
    }
}

export default App;

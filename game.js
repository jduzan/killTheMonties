import React from "react";
import PropTypes from "prop-types";

class Game extends React.Component{
    constructor(){
        super();
        this.levelLimit = {
            x: 1024,
            y: 512
        }
    }
    getChildContext(){
        return {
            levelLimit: this.levelLimit
        }
    }
    render(){
        const style = {
            width: this.levelLimit.x,
            height: this.levelLimit.y,
            background: "lightblue"
        };

        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}

Game.childContextTypes = {
    levelLimit: PropTypes.object
};

export default Game;

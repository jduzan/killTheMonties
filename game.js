import React from "react";
import PropTypes from "prop-types";

class Game extends React.Component{
    constructor(){
        super();
        this.levelLimit = {
            x: 1,
            x1: 1024,
            y: 1,
            y1: 512
        }
    }
    getChildContext(){
        return {
            levelLimit: this.levelLimit
        }
    }
    render(){
        const style = {
            width: this.levelLimit.x1,
            height: this.levelLimit.y1,
            background: "lightblue",
            position: "relative"
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

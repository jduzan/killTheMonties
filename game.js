import React from "react";
import PropTypes from "prop-types";

class Game extends React.Component{
    constructor(){
        super();
        this.levelLimit = {
            x: window.outerWidth,
            y: window.outerHeight
        }
    }
    getChildContext(){
        return {
            levelLimit: this.levelLimit
        }
    }
    render(){
        return (<div>{this.props.children}</div>);
    }
}

Game.childContextTypes = {
    levelLimit: PropTypes.object
};

export default Game;

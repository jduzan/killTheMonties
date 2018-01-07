import React from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";

class Game extends React.Component{
    constructor(){
        super();
        this.levelLimit = {
            x: 0,
            x1: 1800,
            y: 0,
            y1: 900
        }
    }
    getChildContext(){
        return {
            levelLimit: this.levelLimit,
            checkPositionIsAvailable: this.checkPositionIsAvailable
        }
    }
    @autobind
    checkPositionIsAvailable(axe, rect){
        if(axe === "x"){
            if(rect.x <= this.levelLimit.x || rect.x1 >= this.levelLimit.x1){
                return false;
            }
        }else if(axe === "y"){
            if(rect.y <= this.levelLimit.y || rect.y1 >= this.levelLimit.y1){
                return false;
            }
        }

        return true;
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
    levelLimit: PropTypes.object,
    checkPositionIsAvailable: PropTypes.func
};

export default Game;

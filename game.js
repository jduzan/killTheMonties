import React from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";
import {checkCollision} from "./utils";

class Game extends React.Component{
    constructor(){
        super();
        this.levelLimit = {
            x: 0,
            x1: 1800,
            y: 0,
            y1: 900
        }
        this.ennemies = [];
    }
    getChildContext(){
        return {
            levelLimit: this.levelLimit,
            checkPositionIsAvailable: this.checkPositionIsAvailable,
            registerEnnemy: this.registerEnnemy,
            updateEnnemy: this.updateEnnemy,
            checkEnnemyCollision: this.checkEnnemyCollision
        }
    }
    @autobind
    checkEnnemyCollision(rect, ennemyId){
        let colliding = false;

        for(let i = 0, length = this.ennemies.length; i < length; i++){
            // Don't check itself
            if(i === ennemyId){
                continue;
            }

            const ennemyRect = this.ennemies[i].boundingRect;

            if(checkCollision(rect, ennemyRect)){
                colliding = true;
                break;
            }
        }

        return colliding;
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
    @autobind
    registerEnnemy(ennemy){
        return this.ennemies.push(ennemy) - 1;
    }
    @autobind
    updateEnnemy(ennemy, ennemyId){
        this.ennemies[ennemyId] = ennemy;
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
    checkPositionIsAvailable: PropTypes.func,
    registerEnnemy: PropTypes.func,
    updateEnnemy: PropTypes.func,
    checkEnnemyCollision: PropTypes.func
};

export default Game;

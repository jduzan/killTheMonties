import React from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";
import {checkCollision, clone} from "./utils";
import * as GameConstant from "./gameVar";
import Shot from "./shot"

class Game extends React.Component{
    constructor(){
        super();
        this.state = {
            shots: []
        };
        this.levelLimit = {
            x: 0,
            x1: 1800,
            y: 0,
            y1: 900
        }
        this.ennemies = [];
        this.shotCooldown = 0;
        this.shotsToFire = [];
    }
    componentDidMount(){
        this.loopId = this.context.subscribeLoop(this.update);
    }
    getChildContext(){
        return {
            levelLimit: this.levelLimit,
            checkPositionIsAvailable: this.checkPositionIsAvailable,
            registerEnnemy: this.registerEnnemy,
            updateEnnemy: this.updateEnnemy,
            checkEnnemyCollision: this.checkEnnemyCollision,
            checkEnnemyStartingPositionAvailable: this.checkEnnemyStartingPositionAvailable,
            createshot: this.createshot,
            destroyshot: this.destroyshot
        }
    }
    @autobind
    update(){
        if(this.shotCooldown === 0){
            if(this.shotsToFire.length > 0){
                let shots = [...clone(this.state.shots), ...this.shotsToFire.splice(0, 1)];

                this.setState({
                    shots: shots
                });
            }

            this.shotCooldown = clone(GameConstant.SHOT_COOLDOWN);
        }else{
            this.shotCooldown--;
        }
    }
    @autobind
    createshot(startingPosition, mouseAngle){
        if(this.shotCooldown === 0){
            this.shotsToFire.push({
                position: startingPosition,
                orientation: mouseAngle
            });
        }
    }
    @autobind
    checkEnnemyCollision(rect, ennemyId){
        let result = {
            colliding: false,
            newDirection: null
        };

        for(let i = 0, length = this.ennemies.length; i < length; i++){
            // Don't check itself
            if(i === ennemyId){
                continue;
            }

            const ennemyRect = this.ennemies[i].boundingRect;

            if(!ennemyRect){
                continue;
            }

            if(checkCollision(rect, ennemyRect)){
                result.colliding = true;
                // result.newDirection = this.getEnnemyNewDirectionAfterCollision(this.ennemies[ennemyId], this.ennemies[i]);

                break;
            }
        }

        return result;
    }
    @autobind
    getEnnemyNewDirectionAfterCollision(ennemy1, ennemy2){

    }
    @autobind
    checkEnnemyStartingPositionAvailable(rect){
        return !this.checkEnnemyCollision(rect).colliding;
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
    @autobind
    destroyshot(shotId){
        let shots = clone(this.state.shots);
        shots[shotId] = null;

        this.setState({
            shots: shots
        });
    }
    render(){
        const style = {
            width: this.levelLimit.x1,
            height: this.levelLimit.y1,
            background: "lightblue",
            position: "relative"
        };

        let shots = [];

        for(let i = this.state.shots.length; i--;){
            const shot = this.state.shots[i];

            if(shot){
                shots.push((
                    <Shot key={i} position={shot.position} orientation={shot.orientation} shotId={i}/>
                ));
            }
        }

        return (
            <div style={style}>
                {shots}
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
    checkEnnemyCollision: PropTypes.func,
    checkEnnemyStartingPositionAvailable: PropTypes.func,
    createshot: PropTypes.func,
    destroyshot: PropTypes.func
};

Game.contextTypes = {
    subscribeLoop: PropTypes.func
}

export default Game;

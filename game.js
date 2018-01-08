import React from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";
import {checkCollision, clone} from "./utils";
import * as GameConstant from "./gameVar";
import Shoot from "./shoot"

class Game extends React.Component{
    constructor(){
        super();
        this.state = {
            shoots: []
        };
        this.levelLimit = {
            x: 0,
            x1: 1800,
            y: 0,
            y1: 900
        }
        this.ennemies = [];
        this.shootCooldown = 0;
        this.shootsToFire = [];
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
            createShoot: this.createShoot,
            destroyShoot: this.destroyShoot
        }
    }
    @autobind
    update(){
        if(this.shootCooldown === 0){
            if(this.shootsToFire.length > 0){
                let shoots = [...clone(this.state.shoots), ...this.shootsToFire.splice(0, 1)];

                this.setState({
                    shoots: shoots
                });
            }

            this.shootCooldown = clone(GameConstant.SHOOT_COOLDOWN);
        }else{
            this.shootCooldown--;
        }
    }
    @autobind
    createShoot(startingPosition, mousePosition){
        if(this.shootCooldown === 0){
            this.shootsToFire.push({
                position: startingPosition,
                orientation: mousePosition
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
    destroyShoot(shootId){
        let shoots = clone(this.state.shoots);
        shoots[shootId] = null;

        this.setState({
            shoots: shoots
        });
    }
    render(){
        const style = {
            width: this.levelLimit.x1,
            height: this.levelLimit.y1,
            background: "lightblue",
            position: "relative"
        };

        let shoots = [];

        for(let i = this.state.shoots.length; i--;){
            const shoot = this.state.shoots[i];

            if(shoot){
                shoots.push((
                    <Shoot key={i} position={shoot.position} orientation={shoot.orientation} shootId={i}/>
                ));
            }
        }

        return (
            <div style={style}>
                {shoots}
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
    createShoot: PropTypes.func,
    destroyShoot: PropTypes.func
};

Game.contextTypes = {
    subscribeLoop: PropTypes.func
}

export default Game;

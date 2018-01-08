import React from "react";
import PropTypes from 'prop-types';
import autobind from "autobind-decorator";
import * as GameConstant from "./gameVar";
import {clone} from "./utils";

const COLORS = [
    "AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"
];


class Ennemy extends React.Component{
    constructor(){
        super();
        this.state = {
            position: {
                x: 0,
                y: 0
            },
            boundingRect: null,
            direction: {
                left: false,
                top: false,
                right: false,
                bottom: false
            },
            color: null
        };
    }
    componentDidMount(){
        this.ennemyId = this.context.registerEnnemy(this.state);

        let startingPosition, rect;

        do{
            startingPosition = this.getStartingPosition();
            rect = this.getBoundingRectangle(startingPosition.x, startingPosition.y);
        } while(!this.context.checkEnnemyStartingPositionAvailable(rect));

        this.setState({
            position: startingPosition,
            direction: this.getStartingDirection(),
            color: this.getRandomColor(),
            boundingRect: rect
        }, () => {
            this.loopId = this.context.subscribeLoop(this.update);
            this.context.updateEnnemy(this.state, this.ennemyId);
        });
    }
    componentWillUnmount(){
        this.context.unsubscribeLoop(this.loopId);
    }
    @autobind
    getRandomColor(){
        const randomIndex = Math.floor(Math.random() * (COLORS.length - 0 + 1));
        return COLORS[randomIndex];
    }
    @autobind
    getBoundingRectangle(x, y){
        const   boundingX = x || clone(this.state.position.x),
                boundingY = y || clone(this.state.position.y)

        return {
            x: boundingX,
            x1: boundingX + GameConstant.ENNEMY_SIZE.x,
            y: boundingY,
            y1: boundingY + GameConstant.ENNEMY_SIZE.y,
        }
    }
    @autobind
    getStartingDirection(){
        // Get a random direction
        let direction = {
            left: false,
            top: false,
            right: false,
            bottom: false
        };

        if(Math.floor(Math.random() * Math.floor(10) >= 5)){
            direction.left = true;
            direction.right = false;
        }else{
            direction.left = false;
            direction.right = true;
        }

        if(Math.floor(Math.random() * Math.floor(10) >= 5)){
            direction.top = true;
            direction.bottom = false;
        }else{
            direction.top = false;
            direction.bottom = true;
        }

        return direction;
    }
    @autobind
    getStartingPosition(){
        // Get a random position inside levelLimit
        let position = {},
            rect;

        do{
            position.x = Math.floor(Math.random() * (this.context.levelLimit.x1 - this.context.levelLimit.x + 1));
            rect = this.getBoundingRectangle(position.x, 0);
        }while(!this.context.checkPositionIsAvailable("x", rect));

        do{
            position.y = Math.floor(Math.random() * (this.context.levelLimit.y1 - this.context.levelLimit.y + 1));
            rect = this.getBoundingRectangle(position.x, position.y);
        }while(!this.context.checkPositionIsAvailable("y", rect)) ;

        return position;
    }
    @autobind
    update(){
        let newDirection = clone(this.state.direction);

        const  rect = this.getBoundingRectangle();

        // If colliding with another ennemy, go the other way
        const checkResult = this.context.checkEnnemyCollision(rect, this.ennemyId);

        if(checkResult.colliding){
            for(let key in newDirection){
                newDirection[key] = !newDirection[key];
            }
        }

        const   newX = this.getNextPosition("x", newDirection),
                newY = this.getNextPosition("y", newDirection),
                newRect = this.getBoundingRectangle(newX, newY);

        let newPosition = {
            x: null,
            y: null
        };

        if(this.context.checkPositionIsAvailable("x", newRect)){
            newPosition.x = newX;
        }else{
            if(this.state.direction.left){
                const diffX = rect.x - this.context.levelLimit.x
                newPosition.x = this.state.position.x - diffX;

                if(newPosition.x >= this.context.levelLimit.x1){
                    newPosition.x = this.context.levelLimit.x1;
                }

                newDirection.left = false;
                newDirection.right = true;
            }else{
                const diffX = this.context.levelLimit.x1 - rect.x1;
                newPosition.x = this.state.position.x + diffX;

                if(newPosition.x <= this.context.levelLimit.x){
                    newPosition.x = this.context.levelLimit.x;
                }

                newDirection.left = true;
                newDirection.right = false;
            }
        }

        if(this.context.checkPositionIsAvailable("y", newRect)){
            newPosition.y = newY;
        }else{
            if(this.state.direction.bottom){
                const diffY = rect.y - this.context.levelLimit.y1;
                newPosition.y = this.state.position.y - diffY;

                if(newPosition.y >= this.context.levelLimit.y1){
                    newPosition.y = this.context.levelLimit.y1 - GameConstant.ENNEMY_SIZE.y;
                }

                newDirection.bottom = false;
                newDirection.top = true;
            }else{
                const diffY = this.context.levelLimit.y - rect.y;
                newPosition.y = this.state.position.y + diffY;

                if(newPosition.y <= this.context.levelLimit.y){
                    newPosition.y = this.context.levelLimit.y;
                }

                newDirection.bottom = true;
                newDirection.top = false;
            }
        }

        this.setState({
            position: newPosition,
            direction: newDirection,
            boundingRect: this.getBoundingRectangle(newPosition.x, newPosition.y)
        }, () => {
            this.context.updateEnnemy(this.state, this.ennemyId);
        });
    }
    @autobind
    getNextPosition(axe, direction){
        // Return next position according to direction and ENNEMY_SPEED
        const currentDirection = direction || this.state.direction;

        if(axe === "x"){
            if(direction.left){
                return this.state.position.x - GameConstant.ENNEMY_SPEED.x;
            }else{
                return this.state.position.x + GameConstant.ENNEMY_SPEED.x;
            }
        }else if(axe === "y"){
            if(direction.top){
                return this.state.position.y - GameConstant.ENNEMY_SPEED.y;
            }else{
                return this.state.position.y + GameConstant.ENNEMY_SPEED.y;
            }
        }
    }
    render(){
        const style = {
            width: `${GameConstant.ENNEMY_SIZE.x}px`,
            height: `${GameConstant.ENNEMY_SIZE.y}px`,
            backgroundColor: this.state.color,
            position: "absolute",
            left: this.state.position.x,
            top: this.state.position.y
        };

        return (
            <div style={style}></div>
        )
    }
}

Ennemy.contextTypes = {
    subscribeLoop: PropTypes.func,
    levelLimit: PropTypes.object,
    checkPositionIsAvailable: PropTypes.func,
    registerEnnemy: PropTypes.func,
    updateEnnemy: PropTypes.func,
    checkEnnemyCollision: PropTypes.func,
    checkEnnemyStartingPositionAvailable: PropTypes.func
};

export default Ennemy;

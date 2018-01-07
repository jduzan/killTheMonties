export function clone(data){
    return JSON.parse(JSON.stringify(data));
}

export function checkCollision(rect1, rect2){
    return !(
        rect2.x > rect1.x1 ||
        rect2.x1 < rect1.x ||
        rect2.y > rect1.y1 ||
        rect2.y1 < rect1.y
    )
}

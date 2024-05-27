import { Game } from "./game.js";
import { Grid } from "./grid.js";

export class MagicMatch {
    wrap = document.querySelector(".wrap");

    constructor(rowsCount, columnsCount, tilesCount) { //Ініціалізує гру та сітку
        this.game = new Game(rowsCount, columnsCount, tilesCount);
        this.grid = new Grid(this.wrap, this.game.matrix);
        this.wrap.addEventListener("swap", (event) => {
            const firstElementPosition = event.detail.firstElementPosition;
            const secondElementPosition = event.detail.secondElementPosition;
            this.swap(firstElementPosition, secondElementPosition);
        });
    }

    async swap(firstElementPosition, secondElementPosition) { // Оновлює відображення рахунку гри
        const swapStates = this.game.swap(firstElementPosition, secondElementPosition);
        await this.grid.swap(firstElementPosition, secondElementPosition, swapStates);
        this.updateScore();
    }

    updateScore() {
        document.querySelector(".score").innerHTML = this.game.score;
    }
}
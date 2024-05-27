import { deepClone } from "./utils.js";

export class Game {
    constructor(rowsCount, columnsCount, elementsCount) {
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
        this.elementsCount = elementsCount;

        this.init();
    }

    init() { // Встановлюючи початковий рахунок та створюючи матрицю гри
        this.score = 0;
        this.matrix = Array(this.rowsCount).fill().map(() => new Array(this.columnsCount).fill(null));
        // Заповнює матрицю випадковими значеннями
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                do {
                    this.matrix[row][column] = this.getRandomValue();
                } while (this.Row(row, column));
            }
        }
    }

    getRandomValue() { // Генерує випадкове значення
        return Math.floor(Math.random() * this.elementsCount) + 1
    }

    Row(row, column) {  // Перевіряємо ряд
        return this.VerticalRow(row, column) || this.HorizontalRow(row, column);
    }

    VerticalRow(row, column) { // Перевіряє наявність вертикальних збігів з 3 або більше елементів
        const absValue = Math.abs(this.matrix[row][column]);
        let elementsInRow = 1;
        // Перевіряє вверх
        let currentRow = row - 1;
        while (currentRow >= 0 && Math.abs(this.matrix[currentRow][column]) === absValue) {
            elementsInRow++;
            currentRow--;
        }
        // Перевіряє вниз
        currentRow = row + 1;
        while (currentRow <= this.rowsCount - 1 && Math.abs(this.matrix[currentRow][column]) === absValue) {
            elementsInRow++;
            currentRow++;
        }

        return elementsInRow >= 3;
    }

    HorizontalRow(row, column) { // Перевіряє наявність горизонтальних збігів з 3 або більше елементів
        const absValue = Math.abs(this.matrix[row][column]);
        let elementsInRow = 1;
        // Перевіряє ліворуч
        let currentColumn = column - 1;
        while (currentColumn >= 0 && Math.abs(this.matrix[row][currentColumn]) === absValue) {
            elementsInRow++;
            currentColumn--;
        }
        // Перевіряє праворуч
        currentColumn = column + 1;
        while (currentColumn <= this.columnsCount - 1 && Math.abs(this.matrix[row][currentColumn]) === absValue) {
            elementsInRow++;
            currentColumn++;
        }

        return elementsInRow >= 3;
    }

    swap(firstElement, secondElement) { // Міняє місцями два елементи
        this.swapElements(firstElement, secondElement);
        const RowWithFirstElement = this.Row(firstElement.row, firstElement.column);
        const RowWithSecondElement = this.Row(secondElement.row, secondElement.column);
        if (!RowWithFirstElement && !RowWithSecondElement) {
            this.swapElements(firstElement, secondElement);
            return null;
        }

        const swapStates = [];
        let removedElements = 0;
        do {
            removedElements = this.removeAllRows();

            if (removedElements > 0) {
                this.score += removedElements;
                swapStates.push(deepClone(this.matrix));
                this.dropElements();
                this.fillBlanks();
                swapStates.push(deepClone(this.matrix));
            }
        } while (removedElements > 0)

        return swapStates;
    }

    swapElements(firstElement, secondElement) { // Міняє місцями значення двох елементів в матриці
        const temp = this.matrix[firstElement.row][firstElement.column];
        this.matrix[firstElement.row][firstElement.column] = this.matrix[secondElement.row][secondElement.column];
        this.matrix[secondElement.row][secondElement.column] = temp;
    }

    removeAllRows() { // Видаляє всі ряди з 3 або більше однакових елементів з матриці
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                this.markElementToRemoveFor(row, column);
            }
        }
        this.removeMarkedElements();
        return this.calculateRemovedElements();
    }

    markElementToRemoveFor(row, column) { // Помічає елементи для видалення
        if (this.Row(row, column)) {
            this.matrix[row][column] = -1 * Math.abs(this.matrix[row][column]);
        }
    }

    removeMarkedElements() { // Видаляє всі помічені елементи з матриці
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                if (this.matrix[row][column] < 0) this.matrix[row][column] = null;
            }
        }
    }

    calculateRemovedElements() { // Розраховує кількість видалених елементів
        let count = 0;
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                if (this.matrix[row][column] === null) count++;
            }
        }
        return count;
    }

    dropElements() { // Переміщує елементи вниз, заповнюючи порожні місця
        for (let column = 0; column < this.columnsCount; column++) {
            this.dropElementsInColumn(column);
        }
    }

    dropElementsInColumn(column) {
        let emptyIndex;
        // Знаходить перший порожній елемент знизу
        for (let row = this.rowsCount - 1; row >= 0; row--) {
            if (this.matrix[row][column] === null) {
                emptyIndex = row;
                break;
            }
        }

        if (emptyIndex === undefined) return;

        for (let row = emptyIndex - 1; row >= 0; row--) {
            if (this.matrix[row][column] !== null) {
                this.matrix[emptyIndex][column] = this.matrix[row][column];
                this.matrix[row][column] = null;
                emptyIndex--;
            }
        }
    }

    fillBlanks() {
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                if (this.matrix[row][column] === null) this.matrix[row][column] = this.getRandomValue();
            }
        }
    }
}
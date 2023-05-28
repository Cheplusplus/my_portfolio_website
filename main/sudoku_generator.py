from main.sudoku_solver import SudokuSolver
import random
from random import randint, random as rand

import math

def randomise_first_value(puzzle):
    numbers = []
    for number in range(1, 10):
        if number not in puzzle.get_row(0) and number not in puzzle.get_column(0)\
            and number not in puzzle.get_block(0, 0):
                numbers.append(number)    
        else:
            continue
    if len(numbers) > 0:
            puzzle.board[0][0] = numbers[randint(0, len(numbers) - 1)]
    return puzzle

def alter_puzzle(difficulty, puzzle):
    x = 0
    while x < difficulty:
        row = math.floor(rand() * 9)
        col = math.floor(rand() * 9)
        if puzzle.board[row, col] != 0:
            puzzle.board[row, col] = 0
            x += 1
    return puzzle

def generate(difficulty,seed):
    random.seed(seed)
    global puzzle
    new_puzzle = SudokuSolver()
    puzzle = new_puzzle
    x = 0
    while x < 8:
        row = math.floor(rand() * 9)
        col = math.floor(rand() * 9)
        if new_puzzle.board[row, col] == 0:
            numbers = []
            for number in range(1, 10):
                if number not in new_puzzle.get_row(row) and number not in new_puzzle.get_column(col)\
                and number not in new_puzzle.get_block(row, col):
                    numbers.append(number)    
                else:
                    continue
            if len(numbers) > 0:
                new_puzzle.board[row][col] = numbers[randint(0, len(numbers) - 1)]
                x += 1
    new_puzzle = randomise_first_value(new_puzzle)
    new_puzzle.find_unknown()
    solution = new_puzzle.solve()
    new_puzzle = alter_puzzle(difficulty, new_puzzle)
    return new_puzzle.board.tolist(), solution.tolist()

def toJSONlist(rlist):
    x = 0
    y = 0
    JSONlist = []
    for row in rlist:
        for square in row:
            if x % 9 == 0 and not x == 0:
                x = 0
                y += 1
            if not square == 0:
                JSONlist.append({f"{x}-{y}":square}) 
            x += 1
    return JSONlist


        
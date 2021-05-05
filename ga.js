const _ = require('lodash');

const generateString = (length) => {
    let bitString = '';

    for(let i=0; i<length; i++) {
        const bit = Math.round(Math.random());
        bitString = bitString.concat(bit);
    }
    return {
        'bitString': bitString,
    };
}

const fitScore = (string) => {
    let score = 0;
    for(let i=0; i<string.length; i++) {
        if(string[i] == '1') {
            score += 1;
        }
    }
    return score;
}

const averageFitness = (population, fitScoreFunction = fitScore) => {
    let totalScore = 0;
    for(const unit of population) {
        unit.fitScore = fitScoreFunction(unit.bitString);
        totalScore += unit.fitScore;
    }
    return totalScore/population.length;
}

const populationFitScore = (population, fitScoreFunction = fitScore) => {
    for(const unit of population) {
        unit.fitScore = fitScoreFunction(unit.bitString);
    }
}

const checkIfSolution = (population, maxFitScore, fitScoreFunction = fitScore) => {
    populationFitScore(population, fitScoreFunction);

    for(const unit of population) {
        if(unit.fitScore == maxFitScore) {
            return unit;
        }
    }
    return false;
}

const randomInteger = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

// population size will be kept the same
const tournament = (population, fightSize, fitScoreFunction = fitScore) => {
    const winners = [];

    // calculate scores
    populationFitScore(population, fitScoreFunction);

    for(let i=0; i<population.length; i++) {
        const contestants = []
        
        // select contestants
        for(let i=0; i<fightSize; i++) {
            const contestant = population[randomInteger(0, population.length - 1)];
            contestants.push(contestant);
        }

        // fight
        let winner = { 'fitScore': -1 }
        for(const contestant of contestants) {
            if(contestant.fitScore > winner.fitScore) {
                winner = contestant;
            }
        }
        winners.push(winner);
    }
    return winners;
}

const crossover = (population, ratio) => {
    const tempPopulation = _.cloneDeep(population);
    const expectedSelectionSize = Math.round(population.length * ratio);
    const selectedPopulation = [];
    const crossoverPopulation = []

    while(selectedPopulation.length < expectedSelectionSize) {
        selectedPopulation.push(tempPopulation.pop());
    }
    
    while(crossoverPopulation.length < selectedPopulation.length) {
        const male = selectedPopulation[randomInteger(0, selectedPopulation.length - 1)];
        const female = selectedPopulation[randomInteger(0, selectedPopulation.length - 1)];

        const splitPoint = randomInteger(1, male.bitString.length-2);
        const endPoint = female.bitString.length;

        const child1 = { 'bitString': male.bitString.slice(0, splitPoint).concat(female.bitString.slice(splitPoint, endPoint+1)) };
        const child2 = { 'bitString': female.bitString.slice(0, splitPoint).concat(male.bitString.slice(splitPoint, endPoint+1)) };

        crossoverPopulation.push(child1);
        crossoverPopulation.push(child2);

        // console.log(`Male: ${male.bitString}`);
        // console.log(`Female: ${female.bitString}`);
        // console.log(`Split at: ${splitPoint}`);
        // console.log('---------------');
        // console.log(`Child1: ${child1.bitString}`);
        // console.log(`Child2: ${child2.bitString}`);
    }
    return tempPopulation.concat(crossoverPopulation);
}

const stringSingleBitFlip = (string, index) => {
    const bit = string[index];
    if(bit == '0') {
        return setCharAt(string, index, '1');
    }
    return setCharAt(string, index, '0');
}

const setCharAt = (str, index, chr) => {
    return str.substring(0,index) + chr + str.substring(index+1);
}

const mutation = (population, mutationChance) => {
    const tempPopulation = _.cloneDeep(population);

    for(const unit of tempPopulation) {
        const chance = Math.random(0, 1);

        if(chance < mutationChance) {
            const characterIndex = randomInteger(0, unit.bitString.length-1);
            
            unit.bitString = stringSingleBitFlip(unit.bitString, characterIndex);

            // console.log(`Mutated unit ${unit.bitString} at index ${characterIndex}`);
        }
    }
    return tempPopulation
}

exports.fitScore = fitScore;
exports.averageFitness = averageFitness;
exports.checkIfSolution = checkIfSolution;
exports.populationFitScore = populationFitScore;
exports.generateString = generateString;
exports.tournament = tournament;
exports.crossover = crossover;
exports.mutation = mutation;

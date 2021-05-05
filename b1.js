// The classical knapsack problem involves selecting a subset of items from a set such that all items fit
// in the knapsack and the value is maximised.
// More formally, all items i have a weight wi and a value vi. We can represent this as a vector of
// weights and vector of values where location i in these vectors represent the weight and value for
// item i.
// The task it so select a set of these items such that the sum of the weights is less than or equal to a
// threshold (the capacity of the knapsack) and the sum of the values is maximised.

// i) Choose a representation for your candidate solutions
// ii) Devise a fitness function
// iii) Use simple mutation and one point crossover.

// Test your GA on the following test problem:
// Values: 78, 35, 89, 36, 94, 75, 74, 79, 80, 16
// Weights: 18, 9, 23, 20, 59, 61, 70, 75, 76, 30
// Problem 1: Knapsack size: 103 

const nodeplotlib = require('nodeplotlib');

const { averageFitness, generateString, populationFitScore,
     tournament, crossover, mutation} = require('./ga');

const items = [
    {   value: 78,
        weight: 18 
    },
    {
        value: 35,
        weight: 9
    },
    {
        value: 89,
        weight: 23
    },
    {
        value: 36,
        weight: 20
    },
    {
        value: 94,
        weight: 59
    },
    {
        value: 75,
        weight: 61
    },
    {
        value: 74,
        weight: 70
    },
    {
        value: 79,
        weight: 75
    },
    {
        value: 80,
        weight: 76
    },
    {
        value: 16,
        weight: 30
    },
]

const customFitScore = (string) => {	
    const maxWeight = 103;

    let totalWeight = 0;
    let score = 0;
    for(let i=0; i<string.length; i++) {
        if(string[i] == '1') {
            score += items[i].value;
            totalWeight += items[i].weight
        }
    }

    if(totalWeight > maxWeight) {
        return 0;
    }

    return score;
}

const showMostFit = (population) => {
    populationFitScore(population, customFitScore);

    let best = population[0];
    for(unit of population) {
        if(best.fitScore < unit.fitScore) {
            best = unit;
        }
    }

    // calculate weight
    best.weight = 0;
    for(let i=0; i<best.bitString.length; i++) {
        if(best.bitString[i] == '1') {
            best.weight += items[i].weight;
        }
    }

    console.log('Best unit:');
    console.log(best);

}

const start = () => {
    const stringSize = 10;
    const populationSize = 50;
    // const maxFitScore = 40;
    const maxGenerations = 1000;
    let population = [];

    // data
    const generationCounterArr = [];
    const averageFitnessArr = [];

    // initialize
    for(let i=0; i<populationSize; i++) {
        population.push(generateString(stringSize));
    }

    let solution = false;
    let generationCounter = 0;
    while(!solution) {
        // console.log('Random population');
        // console.log(`Length: ${population.length}`);
        // console.log(population);

        const survivors = tournament(population, 3, customFitScore);
        // console.log(`  Tournament fitness: ${averageFitness(survivors)}`);

        // console.log('Surviving population');
        // console.log(`Lenght: ${survivors.length}`);
        // console.log(survivors);

        const nextGeneration = crossover(survivors, 0.8);

        // console.log('Crossover population')
        // console.log(`Length: ${nextGeneration.length}`);
        // console.log(nextGeneration)

        const mutants = mutation(nextGeneration, 0.01);

        // console.log('Mutated population')
        // console.log(`Length: ${mutants.length}`);
        // console.log(mutants)

        population = mutants;

        generationCounter++;
        generationCounterArr.push(generationCounter);
        const averageFitnessValue = averageFitness(population, customFitScore)
        averageFitnessArr.push(averageFitnessValue);

        console.log(`#${generationCounter} Average fitness: ${averageFitnessValue}`);

        if(generationCounter > maxGenerations) break;
    }

    showMostFit(population);

    const data = [{x: generationCounterArr, y: averageFitnessArr, type: 'line'}];
    nodeplotlib.plot(data);
}
start();

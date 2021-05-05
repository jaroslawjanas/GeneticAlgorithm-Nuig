// Define a target string (a sequence of 1s and 0s) and adopt the same approach as before
// with a different a fitness function (number of matching values).
// Plot the average fitness as before

const nodeplotlib = require('nodeplotlib');

const { averageFitness, checkIfSolution, generateString,
     tournament, crossover, mutation} = require('./ga');


const customFitScore = (string) => {
    const target = '10110101001010000001'
    let score = 0;
    for(let i=0; i<string.length; i++) {
        if(string[i] == target[i]) {
            score += 1;
        }
    }
    return score;
}

const start = () => {
    const stringSize = 20;
    const populationSize = 30;
    const maxFitScore = 20;
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

        solution = checkIfSolution(mutants, maxFitScore, customFitScore);
    }

    console.log('Solution', solution);

    const data = [{x: generationCounterArr, y: averageFitnessArr, type: 'line'}];
    nodeplotlib.plot(data);
}
start();

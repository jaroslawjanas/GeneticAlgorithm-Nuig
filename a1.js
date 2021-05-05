// One-max problem.
// Consider the simple case of evolving a string that contains all 1s in every location. Let the
// length of the strings be 20.
// The initial population should be randomly created. Use standard mutation and one-point
// crossover. The fitness of a solution is the number of 1s in the string.
// Plot the average fitness of the population versus the generations passed.
// This exercise is to show the operation of a genetic algorithm.

const nodeplotlib = require('nodeplotlib');

const { averageFitness, checkIfSolution, generateString,
     tournament, crossover, mutation} = require('./ga');

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

        const survivors = tournament(population, 3);
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
        const averageFitnessValue = averageFitness(population)
        averageFitnessArr.push(averageFitnessValue);

        console.log(`#${generationCounter} Average fitness: ${averageFitnessValue}`);

        solution = checkIfSolution(mutants, maxFitScore);
    }

    console.log('Solution', solution);

    const data = [{x: generationCounterArr, y: averageFitnessArr, type: 'line'}];
    nodeplotlib.plot(data);
}
start();

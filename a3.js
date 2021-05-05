// Modify the fitness function in i) such that the fitness function is equal to the number of
// 1s in the string for all cases except when there are no 1s present. In this case the fitness
// should be 2*(length of the solutions).

const nodeplotlib = require('nodeplotlib');

const { averageFitness, checkIfSolution, generateString,
     tournament, crossover, mutation} = require('./ga');

const customFitScore = (string) => {	
    const secondTarget = '00000000000000000000'
    
    if(string == secondTarget) return 40;

    let score = 0;
    for(let i=0; i<string.length; i++) {
        if(string[i] == '1') {
            score += 1;
        }
    }
    return score;
}

const start = () => {
    const stringSize = 20;
    const populationSize = 1000;
    const maxFitScore = 40;
    const maxGenerations = 100000;
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

        const mutants = mutation(nextGeneration, 0.40);

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

        if(generationCounter > maxGenerations) break;
    }

    console.log('Solution', solution);

    const data = [{x: generationCounterArr, y: averageFitnessArr, type: 'line'}];
    nodeplotlib.plot(data);
}
start();

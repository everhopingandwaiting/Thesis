// -------------------------------------------- Infomap Algorithm --------------------------------------------

// [Description]
// The execution of this algorithm is also divided in 2 phases like in Louvain. Although, the optimization function is not the same.
// This time, instead of maximizing network's modularity, the goal is to find the minimum description length of the network. To calculate
// this quantity, map equation was used.

jHamming = function (profile, nlv, cyto) {

    let distance_matrix = [];
    let edges = [];
    let nodes = [];
    let result = {};

    function numberDifferences (array1, array2) {

        let count = 0;

        for(let i = 0; i < array1.length; i++) {

            if(array1[i] !== array2[i]) {
                count++;
            }

        }
        return count;
    }

    function hammingDistance(profile_input) {

        for (let i = 0; i < profile_input.length; i++) {

            distance_matrix[i] = distance_matrix[i] || [];

            for (let j = 0; j < profile_input.length; j++) {

                distance_matrix[i].push(numberDifferences(profile_input[i], profile_input[j]));

            }
        }
    }

    function nlvGraph(distance_matrix_input, nlv_input) {

        for (let i = 0; i < distance_matrix_input.length; i++) {

            if (!cyto) {
                nodes.push({id: i, group: 1});
            } else {
                nodes.push({data: {id: i, weight: 1}});
            }

            for (let j = 0; j < distance_matrix_input.length; j++) {

                if(distance_matrix_input[i][j] <= nlv_input && i > j) {

                    if (!cyto) {
                        edges.push({source: i, target: j, weight: 1});
                    } else {
                        edges.push({data: {source: i, target: j, value: 1}});
                    }
                }
            }
        }
    }

    hammingDistance(profile);

    nlvGraph(distance_matrix, nlv);

    result["nodes"] = nodes;
    result["links"] = edges;

    return result;

};

module.exports = {
    hammingVar: jHamming
};
const k = 2; // no of k

const dataSet = [
  { x: 3, y: 4, cluster: 0 },
  { x: 3, y: 6, cluster: 0 },
  { x: 3, y: 8, cluster: 0 },
  { x: 4, y: 5, cluster: 0 },
  { x: 4, y: 7, cluster: 0 },
  { x: 5, y: 1, cluster: 0 },
  { x: 5, y: 5, cluster: 0 },
  { x: 7, y: 3, cluster: 0 },
  { x: 7, y: 5, cluster: 0 },
  { x: 8, y: 5, cluster: 0 },
];

//random generate centroids at the beginning of the app
const chooseCentroids = () => {
  const randomNumArr = [];
  const centroids = [];
  //generate unique set of nums
  for (let i = 0; i < k; i++) {
    let randomNum = Math.floor(Math.random() * 10);
    //check num already exists or not
    while (randomNumArr.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * 10);
    }
    randomNumArr[i] = randomNum;
  }
  //get centroids with random numbers
  randomNumArr.forEach((num) => {
    centroids.push([dataSet[num].x, dataSet[num].y]);
  });
  //console.log(centroids);
  //return random centroids
  return centroids;
};

//calculate by euclidian distance
const euclidianMethod = (x, y, centroidX, centroidY) => {
  const result = Math.sqrt(
    Math.pow(x - centroidX, 2) + Math.pow(y - centroidY, 2)
  );
  return result;
};

//calculate by manhattan distance
const manhattanMethod = (x, y, centroidX, centroidY) => {
  const result = Math.abs(x - centroidX) + Math.abs(y - centroidY);
  return result;
};

//calculate distance and assign cluster
const calDistance = (centroids) => {
  changeInCluster = false; //! stop condition | if there is no change in cluster

  //loop through dataset
  for (let i = 0; i < dataSet.length; i++) {
    const distances = []; //store calculated distances

    centroids.forEach((centroid) => {
      let result = 0; //result of calculation
      //which method to calculate
      if (process.argv[2] == "euclidian") {
        result = euclidianMethod(
          dataSet[i].x,
          dataSet[i].y,
          centroid[0],
          centroid[1]
        );
      } else if (process.argv[2] == "manhattan") {
        result = manhattanMethod(
          dataSet[i].x,
          dataSet[i].y,
          centroid[0],
          centroid[1]
        );
      }
      distances.push(result); //save result od distance in distances
    });

    //* to get min distance
    minNum = distances[0];
    belongsTo = 1; //belongs to which cluster
    for (let j = 0; j < distances.length; j++) {
      if (distances[j] < minNum) {
        minNum = distances[j];
        belongsTo = j + 1; //as index starts with 0 & cluster with 1
      }
    }
    //check if there is a change in clusters or not
    if (dataSet[i].cluster != belongsTo) {
      changeInCluster = true;
    }
    dataSet[i].cluster = belongsTo; //assign cluster to this picece of data
    console.log("Distances: ", distances);
    console.log(dataSet[i]);
    console.log("----------------------------------------------------------");
  }
  //No change in cluster! then return false and stop iteration
  if (!changeInCluster) {
    //console.log("STOP! No change in cluster!");
    return false;
  }

  return true;
};

//calculate new centroids
const calNewCentroids = () => {
  const clusters = [];
  //if k=3 then [ [...], [...], [...] ]
  //and each sub array presents cluster ( index 0 => cluster 1, .... )
  for (let i = 0; i < dataSet.length; i++) {
    //check if the index presents cluster in array is set or undifined
    if (!clusters[dataSet[i].cluster - 1]) {
      //if undifined
      clusters[dataSet[i].cluster - 1] = []; //set it to be able to add in it
    }
    //set [x,y] inside the index of the cluster
    clusters[dataSet[i].cluster - 1].push({
      x: dataSet[i].x,
      y: dataSet[i].y,
    });
  }

  const newCentroids = [];
  clusters.forEach((cluster) => {
    let sumX = 0; //sum of all x in each cluster
    let sumY = 0; //sum of all y in each cluster
    cluster.forEach((point) => {
      sumX += point.x;
      sumY += point.y;
    });
    //push averages in aray
    newCentroids.push([sumX / cluster.length, sumY / cluster.length]);
  });
  return newCentroids;
};

const start = () => {
  //if user enter invalid method
  if (process.argv[2] != "euclidian" && process.argv[2] != "manhattan") {
    console.log("Invalid input");
    return;
  }

  let iteration = 1;
  let currentCentroid = chooseCentroids(); //set random centroids
  console.log("initial centroids: ", ...currentCentroid);
  let distanceCal = false; //if there is a stop condition happened or not
  do {
    //calculate distances & assign clusters
    console.log();
    console.log("Iteration " + iteration);
    console.log();

    distanceCal = calDistance(currentCentroid);

    console.log("==========================================================");
    iteration++;

    //if there is no change in cluster
    if (!distanceCal) {
      console.log("STOP! No change in cluster!");
      break;
    }
    //calculate new centroids
    let newCentroids = calNewCentroids();
    console.log("New centroids: ", ...newCentroids);
    //check if the pervious and new centroids are the same or not (stop condition)
    let centroidChanged = false;
    for (let i = 0; i < newCentroids.length; i++) {
      if (
        newCentroids[i][0] != currentCentroid[i][0] ||
        newCentroids[i][1] != currentCentroid[i][1]
      ) {
        centroidChanged = true; //not the same, then continue
      }
    }
    //overwrite previous centroids with the new one
    currentCentroid = [...newCentroids];
    //if the centroids did not change, then stop iterate
    if (!centroidChanged) {
      console.log("centroid didn't Changed");
      break;
    }
  } while (distanceCal); //countinue if there is no stop conditions
};

start();

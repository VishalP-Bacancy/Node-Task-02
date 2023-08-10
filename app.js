const fs = require('fs');
const process = require('process');
const csvFilePath = './Train_details.csv'
var args = process.argv;

fs.readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }
   
 const routes = data.split('\n').slice(1); // Remove header row and split into lines
 const trainData = routes.map((route) => { 
 const [
     trainNo, 
     trainName, 
     seq, 
     stationCode, 
     stationName,
     arrivalTime,
     departureTime,
     distance,
     sourceStationCode,
     sourceStationName,
     destinationStationCode,
     destinationStationName
 ] = route.split(',');
   return { 
     trainNo, 
     trainName, 
     seq, 
     stationCode, 
     stationName,
     arrivalTime,
     departureTime,
     distance,
     sourceStationCode,
     sourceStationName,
     destinationStationCode,
     destinationStationName
  };
 });
  

  
  const longestRoute = () => {
    return [trainData.reduce((max, curr) => +curr.distance > +max.distance ? curr : max)]
  };
  

  const shortestRoute = () => {
    const stationNumber = []
      for (let i = 0; i < trainData.length; i++) {
        if (i === (trainData.length - 1)) {
          stationNumber.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq, trainTotalDistance: trainData[i].distance })
          break;
        }
        if ((+trainData[i].trainNo) !== (+trainData[i + 1].trainNo)) {
          stationNumber.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq, trainTotalDistance: trainData[i].distance })
        }
    }
    
    stationNumber.sort((a,b) => a.trainTotalDistance - b.trainTotalDistance)
    
    let smallestDistance = Infinity, smallestRouteTrainNumber = '';
    for (const train of stationNumber) {
      const distance = parseInt(train.trainTotalDistance);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        smallestRouteTrainNumber = train.trainNumber;
      }
    }
  
    return trainData.filter((train) => train.trainNo === smallestRouteTrainNumber)
}
  
  
const lessStationNumber = () => {
    const stationNumber = []
    
      for (let i = 0; i < trainData.length; i++) {
        if (i === (trainData.length - 1)) {
          stationNumber.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq })
          break;
        }
        if ((+trainData[i].trainNo) !== (+trainData[i + 1].trainNo)) {
          stationNumber.push({ trainNumber: trainData[i].trainNo, trainTotalStation: trainData[i].seq })
        }
      }
      stationNumber.sort((a,b)=>{return a.trainTotalStation - b.trainTotalStation})
     let flag=0; 
     for(i=0;i<stationNumber.length;i++)
     {
      if(stationNumber[i+1].trainTotalStation>stationNumber[i].trainTotalStation)
      {
        flag=i+1;
        break;
      }        
     }
     for(i=stationNumber.length;i>=flag;i--)
     {
        stationNumber.pop();
    }
    return stationNumber
  }
 

const maxStationNumber = () => {
    const stationNumbers = [];

    for (let i = 0; i < trainData.length; i++) {
      const currentTrain = trainData[i];
      const nextTrain = trainData[i + 1];
  
      if (!nextTrain || currentTrain.trainNo !== nextTrain.trainNo) {
        stationNumbers.push({
          trainNumber: currentTrain.trainNo,
          trainTotalStation: currentTrain.seq
        });
      }
    }
  
    stationNumbers.sort((a, b) => b.trainTotalStation - a.trainTotalStation);
  
    let flag = -1;
    for (let i = 0; i < stationNumbers.length - 1; i++) {
      if (stationNumbers[i + 1].trainTotalStation < stationNumbers[i].trainTotalStation) {
        flag = i;
        break;
      }
    }
  
    if (flag !== -1) {
      stationNumbers.length = flag + 1;
    }
  
  return stationNumbers;
}

const numOfTrain = () => {
    const stationNumbers = [];

    for (let i = 0; i < trainData.length - 1; i++) {
      const currentTrain = trainData[i];
      const nextTrain = trainData[i + 1];
  
      if (!nextTrain || currentTrain.trainName !== nextTrain.trainName) {
        stationNumbers.push({
          trainName: currentTrain.trainName,
          trainTotalStation: currentTrain.seq
        });
      }
    }
  return stationNumbers
}

const travelOptions = () => {
  const source = args[3], destination = args[4]
  
  return trainData.filter(train => train.sourceStationCode === source && train.destinationStationCode === destination && train.stationCode === source)
}

  
  switch (args[2]) {
      case 'QUESTION_NO-1': {
               console.log('1. Train info with longest route: ');
               console.table(longestRoute())
      }
      break;

      case 'QUESTION_NO-2': {
               console.log('2. Train info with shortest route: ')
               console.table(shortestRoute());
      }
      break;

      case 'QUESTION_NO-3': {
                              console.log('3. Train info with which covers less no of station between starting and ending station:- ')
                              console.table(lessStationNumber())
      }
      break;

      case 'QUESTION_NO-4': {
              console.log('4. Train info with which covers maximum no of station between starting and ending station: -')
              console.table(maxStationNumber())
      }
      break;

      case 'QUESTION_NO-5': {
              console.log('5. No of trains and names of the trains:- ')
              console.table(numOfTrain())
      }
      break;

      case 'QUESTION_NO-6': {
              console.log('6. Get the name of pickup point and destination point and provide possible options to travel between: -')
              console.table(travelOptions())
      }
      break;

      default:
          console.log('Invalid Argument!!');
  }


});
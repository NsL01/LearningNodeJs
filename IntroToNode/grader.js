function average(arr){
    var sum = 0;
    arr.forEach(function(score){
        sum+=score;
    });
    
    var avg = sum/arr.length
    console.log(Math.round(avg));
}

var scores = [90,98,89,100,100,86,94];
average(scores);
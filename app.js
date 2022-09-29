
const Statistics = require('./service/Statistics'); 
const {path , delimiter , cacluateMostPopularBrands , calculateAverage} = require('./config');


async function  runApp() {
    await Statistics.readCsvFile(path, delimiter); 
    Statistics.calculateAverage(); 
    Statistics.calculatePopularBrands(); 
    if (calculateAverage)
        Statistics.writeCSVFile(Statistics.averageList , 'first'); 
    if (cacluateMostPopularBrands)
        Statistics.writeCSVFile(Statistics.mostPopularBrand, 'second'); 
}

runApp(); 

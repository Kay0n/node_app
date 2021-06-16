
window.onload = function (res) {
    console.log("graph script started")

    
    
    var ctx = document.getElementById('mainChart').getContext('2d');
    mainChart = new Chart(ctx, {

        type: graphType, //pie,line,bar
        data: {
            // x axis data labels
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //graph main title
            plugins: {
                title: {
                    display: true,
                    text: graphTitle
                }
            },
            scales: {
                //set options for x axis
                x:{
                    title: {
                        display: true,
                        text: xLabel //label
                    }
                },
                //set options for y axis
                y:{
                    title: {
                        display: true,
                        text: yLabel //label
                    }
                },

            }
        }
    });

    if (mode == "main"){

        
        mainChart.data.datasets = []
        mainChart.data.labels = ["2017","2018","2019"]  
        
        if (casArray){
            mainChart.data.datasets.push({
                label:"Casualties",
                backgroundColor: 'red',
                data: casArray
            })
        }
        if (fatArray){
            mainChart.data.datasets.push({
                label:"Fatalities",
                backgroundColor: 'blue',
                data: fatArray
            })
        }
        if (crashArray){
            mainChart.data.datasets.push({
                label:"Crashes",
                backgroundColor: 'green',
                data: crashArray
            })
        }



        mainChart.update()
    }



}

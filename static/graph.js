
window.onload = function (res) {
    console.log("graph script started")
    if (mode == "main") {
        $("#secondaryForm").hide()
        $("#mainForm").show()
        
    } else {
        $("#mainForm").hide()
        $("#secondaryForm").show()
        xLabel = "LGA Name";
    }

    
    
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
        mainChart.data.labels = ["2016","2017","2018"]  
        
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
    } else {
        mainChart.data.datasets = []
        mainChart.data.labels = []  
        let casArray2 = []
        let fatArray2 = []
        let craArray2 = []

        for(var i=0;i<lgaArray.length;i++){
            mainChart.data.labels.push(location_arr2[lgaArray[i][0]])
            casArray2.push(lgaArray[i][1])
            fatArray2.push(lgaArray[i][2])
            craArray2.push(lgaArray[i][3])
        }

        mainChart.data.datasets.push({
            label:"Casualties",
            backgroundColor: 'red',
            data: casArray2
        })
        mainChart.data.datasets.push({
            label:"Fatalities",
            backgroundColor: 'blue',
            data: fatArray2
        })
        mainChart.data.datasets.push({
            label:"Crashes",
            backgroundColor: 'green',
            data: craArray2
        })
        mainChart.update()
    }
}

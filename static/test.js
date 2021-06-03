
function chartRenderer(){
    console.log("yo")
    var ctx = document.getElementById('staticChart').getContext('2d');
    var myChart = new Chart(ctx, {

        type: 'bar', //pie,line
        data: {
            // x axis data labels
            labels: ['Orange', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Number of Votes',
                // values to make chart
                data: [20, 19, 300, 500, 600, 600],
                // color of each data aligned by index
                backgroundColor: [
                    'orange',
                    'rgba(54, 162, 235, 0.2)',
                    '#ffff00',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                //border color of each data
                borderColor: [
                    'red',
                    'rgba(54, 162, 235, 1)',
                    '#ffff00',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            //graph main title
            plugins: {
                title: {
                    display: true,
                    text: 'Title Test'
                }
            },
            scales: {
                //set options for x axis
                x:{
                    title: {
                        display: true,
                        text: 'Colour Vote' //label
                    }
                },
                //set options for y axis
                y:{
                    title: {
                        display: true,
                        text: 'Count' //label
                    }
                },

            }
        }
    });
}
chartRenderer();
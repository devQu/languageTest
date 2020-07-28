'use strict';

function httpGet(url) {
    return new Promise(function(resolve, reject) {
        console.log("adsjkj");
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (this.status == 200) {resolve(this.response)}
            else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function() {
            reject(new Error("NETWORK ARMAGEDDON"));
        };
        xhr.send();
    });
}

httpGet('/profile/admin/')
    .then(
        response => {
            
            let data = response;

            console.log(data)
        
        },
        error => console.log(error)
    );


/*
httpGet('/profile/api/chart/data/')
    .then(
        response => {
            
            let data = JSON.parse(response);
            chartRun(data.userData)
            console.log(data)
        
        },
        error => console.log(error)
    );

function chartRun(masUser) {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Тестов',
                data: masUser,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}

*/
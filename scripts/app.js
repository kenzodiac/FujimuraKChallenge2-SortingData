//VARIABLES FOR LINKING IDS ON DOCUMENT TO JAVASCRIPT
    //variable for pulling number of items per page info
    let pageItemNumSelect = document.getElementById('pageItemNumSelect');

    //variable to link to data table injection area
    let dataTableInjectionArea = document.getElementById('dataTableInjectionArea');

    //variable to link to pagination injection area
    let paginationInsert = document.getElementById('paginationInsert');

    //variables for sorting data table
    let idSort = document.getElementById('idSort');
    let firstNameSort = document.getElementById('firstNameSort');
    let lastNameSort = document.getElementById('lastNameSort');
    let emailSort = document.getElementById('emailSort');
    let heightSort = document.getElementById('heightSort');
    let ageSort = document.getElementById('ageSort');

//GLOBAL VARIABLES FOR KEEPING TRACK OF KEY INFORMATION
    //variable for pulling in json data
    let people;

    //variable for storing ppl per page selection
    let pplPerPage = 10;

    //variable for storing data sorting method
    let dataSelector = 'Id';

    //variable for storing the current page (starts at 0 for 0-indexing)
    let pgNumber = 0;

//async function that fetches the people list and stores it to a global variable
async function ImportData(){
    const promise = await fetch("./data/data.json");
    const data = await promise.json();
    people = data.People;
    // console.log(people);
}

//function for sorting data by key; takes in key value and the array; returns sorted array
function SortDataByType(selector, arr){
    let tempArr = arr;
    if (selector === 'Id' || selector === 'Age'){
        tempArr.sort((a, b) => a[selector] - b[selector]);
    } else {
        tempArr.sort((a, b) => {
            const valA = a[selector].toUpperCase();
            const valB = b[selector].toUpperCase();
            if (valA < valB){
                return -1;
            }
            if (valA > valB){
                return 1;
            }
            return 0;
        });
    }
    //sorting array of objects into a result array
    return tempArr;
}

//function for laundering height information into feet and inches
function LaunderHeightInformation(input){
    let temp = input.split(' ');
    let rawHeight = parseInt(temp[0]);
    let feet = Math.floor(rawHeight / 12);
    let inches = (rawHeight % 12);
    let output = '';
    if (inches === 0){
        output = `${feet}'`;
    } else {
        output = `${feet}'${inches}"`;
    }
    return output;
}

//function will take the sorted data and push them into arrays of varying length dependent on how many items per page the user selects
function SortDataIntoArrays(perPage, arr){
    let totalItems = arr.length;
    let totalPgs = Math.ceil(totalItems / perPage);
    let resultArr = [];
    for (let k = 0; k < perPage; k++){
        resultArr.push([]);
    }
    let counter = 0;
    for (let i = 0; i < totalPgs; i++){
        for (let j = 0; j < perPage; j++){
            resultArr[i].push(arr[counter]);
            counter++;
        }
    }
    // console.log(people);
    // console.log(resultArr);
    return resultArr;
}


async function PopulateDataTable(perPage, pageNum){
    await ImportData();
    dataTableInjectionArea.innerHTML = "";
    let sortedInfo = SortDataIntoArrays(perPage, SortDataByType(dataSelector, people));
    console.log(sortedInfo);
    sortedInfo[pageNum].map(item => {
        CreateTableRow(pageNum, dataSelector, item);
    })
}

//function that creates the individual rows in the table and pushes them out onto the page
function CreateTableRow(counter, selector, data){
    console.log(data);
    let idCell = document.createElement('td');
        if (selector === 'Id'){
            idCell.className = 'table-column-select-bg'
        }
        idCell.textContent = data.Id;
    let firstNameCell = document.createElement('td');
        if (selector === 'FirstName'){
            firstNameCell.className = 'table-column-select-bg'
        }
        firstNameCell.textContent = data.FirstName;
    let lastNameCell = document.createElement('td');
        if (selector === 'LastName'){
            lastNameCell.className = 'table-column-select-bg'
        }
        lastNameCell.textContent = data.LastName;
    let emailCell = document.createElement('td');
        if (selector === 'Email'){
            emailCell.className = 'table-column-select-bg'
        }
        emailCell.textContent = data.Email;
    let heightCell = document.createElement('td');
        if (selector === 'Height'){
            heightCell.className = 'table-column-select-bg'
        }
        heightCell.textContent = LaunderHeightInformation(data.Height);
    let ageCell = document.createElement('td');
        if (selector === 'Age'){
            ageCell.className = 'table-column-select-bg'
        }
        ageCell.textContent = data.Age;
    let tableRow = document.createElement('tr');
        if (counter % 2 === 1){
            tableRow.className = 'table-row-bg';
        }
    tableRow.appendChild(idCell);
    tableRow.appendChild(firstNameCell);
    tableRow.appendChild(lastNameCell);
    tableRow.appendChild(emailCell);
    tableRow.appendChild(heightCell);
    tableRow.appendChild(ageCell);
    dataTableInjectionArea.appendChild(tableRow);
}

//Function that creates pagination buttons and determines their behaviors
function CreatePaginationInterface(pgNum){
    
}

//EVENT LISTENERS FOR BUTTONS/INPUTS
//Items per page input dropdown
pageItemNumSelect.addEventListener('change', function(){
    pplPerPage = parseInt(pageItemNumSelect.value);
    PopulateDataTable(pplPerPage, 0);
});

//Sorting data table header buttons
idSort.addEventListener('click', function(){
    dataSelector = 'Id';
    PopulateDataTable(pplPerPage, 0);
});

firstNameSort.addEventListener('click', function(){
    dataSelector = 'FirstName';
    PopulateDataTable(pplPerPage, 0);
});

lastNameSort.addEventListener('click', function(){
    dataSelector = 'LastName';
    PopulateDataTable(pplPerPage, 0);
});

emailSort.addEventListener('click', function(){
    dataSelector = 'Email';
    PopulateDataTable(pplPerPage, 0);
});

heightSort.addEventListener('click', function(){
    dataSelector = 'Height';
    PopulateDataTable(pplPerPage, 0);
});

ageSort.addEventListener('click', function(){
    dataSelector = 'Age';
    PopulateDataTable(pplPerPage, 0);
});
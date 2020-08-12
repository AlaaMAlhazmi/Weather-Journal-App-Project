/* Global Variables */

// Personal API Key for OpenWeatherMap API
const apiKey = '4b24329ff82a788002db1cdef85aded3';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate =  d.getDate()+'.'+ d.toLocaleString('default', { month: 'long' })+'.'+ d.getFullYear();


/* Helper Functions */
// Function to GET Web API Data
const getWeather = async (zipCode) =>{
		let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=imperial&appid=${apiKey}`);
		let data = await response.json();
		//handle 404 & 500 response
		if(!response.ok){
			throw new Error (data.message);

		}
		return(data.main.temp);
}

// Function to get enty data
const getEntryData = async ()=> {
	const zipCode = document.querySelector('#zip').value;

	const data = {};
	data.date = newDate;
	data.tempreture = await getWeather(zipCode);
	data.feelings = document.querySelector('#feelings').value;

	return data
}

// display entries
function updateUI(entry){
	const entriesDiv = document.querySelector('.entries');

	const entryHolderDiv = document.createElement('div');
	entryHolderDiv.classList = "entryHolder row align-items-center justify-content-center px-2 pt-2" ;
	entryHolderDiv.innerHTML= `
    <div id = "date" class="col-3 text-center">
    	<h5>${entry.date.split('.', 1)}</h4>
    	<h6>${entry.date.split('.', 3)[1]+'.'+entry.date.split('.', 3)[2]}</h6>
    </div> 
    <div class="col-9 p-2">
	    <div class="card mb-3" >
			<div id = "temp" class="card-header">${entry.tempreture + ' °F'}</div>
			<div id = "content" class="card-text p-3">${entry.feelings}</div>
		</div>
	</div>`
	entriesDiv.appendChild(entryHolderDiv);

	document.querySelector(".wrapper").reset();
}

//Error Handling
const handleError = (err) =>{
	if (err.message) {
		alert(err.message);
	} else {
		alert('oops, somthing went wrong! please try again later.');
	}
}


/* Main Functions */
// Function to POST data
async function postEntry(url='', data={}){

	//post entry to server
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(data),
		headers:{
			"Content-type": "application/json; charset=UTF-8"
		}
	});

	//handle 404 & 500 response
	if(!response.ok){
		throw new Error;
	}

	//add entry to UI
	//updateEntries(data);
}


// Function to GET Project Data
async function getEntries(url=''){

	const response = await fetch(url);
	const entries = await response.json();

	if(!response.ok){
		throw new Error;
	}

	return entries;
	// entries.forEach(entry=>{
	// 	updateEntries(entry);
	// });
}


/* execution starts here */
// Event listener to add function to existing HTML DOM element
document.addEventListener('DOMContentLoaded', async ()=>{
	
	try {
		//Onload output saved endpoint data entries to UI
		const serverRecords = await getEntries('/all');
		serverRecords.forEach(record =>{
			updateUI(record);
		})
	} catch (err){
		handleError(err);
	}
	

	//Handle generate button click
	const generateBtn = document.querySelector('#generate');
	generateBtn.addEventListener('click', async ()=>{

		try {
			//1. accept user entry
			const userData = await getEntryData();
			//2. add it to endpoint records
			await postEntry('/add', userData);
			//3. retrive all endpoint records
			const serverRecords = await getEntries('/all');
			//4. update UI by adding last added record  
			updateUI(serverRecords[serverRecords.length-1]);

		} catch (err){
			handleError(err);
		}
	})

})
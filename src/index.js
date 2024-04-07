    // // // Your code here
    let url = "http://localhost:3000/films/";
let ulFilms = document.getElementById("films");
let byTicket = document.getElementById("buy-ticket")

let movieImg = document.getElementById("poster");
let idTitle = document.getElementById("title")
let idRuntime = document.getElementById("runtime")
let idFilmInfo = document.getElementById("film-info")
let idShowtime = document.getElementById("showtime")
let idTicketnum = document.getElementById("ticket-num")


function getMovie(){
    fetch(url)
    .then(res => res.json())
    .then(data => { 
        ulFilms.innerHTML = "";
        for(values of data){
             addMovies(values);
        }
        }
    )
    .catch(e => console.log(e.message));
}
getMovie();
function addMovies(movies){
    
    let remaining = movies.capacity - movies.tickets_sold;

    movieTitle = movies.title
    movieId = movies.id
    let listFilm = document.createElement("li");
    if(!remaining > 0)
    {  listFilm.className = "sold-out"
    }

    ulFilms.appendChild(listFilm);

    let movieSpan = document.createElement("span");
    movieSpan.innerText = movieTitle;
    listFilm.appendChild(movieSpan);

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete"
    listFilm.appendChild(deleteButton); 

    deleteButton.addEventListener('click', () => {
        removeMovie(movies)
    })
    movieSpan.addEventListener('click', () => {
        domUpdate(movies);
    })
    if(movies.id === "1"){
        domUpdate(movies);
    }
}

function domUpdate(movies){
    let remaining = movies.capacity - movies.tickets_sold;
    let movieId = movies.id;
    let availabiity;

    if(remaining > 0){
        availabiity = "Buy Ticket"
    }else{
        availabiity = "Sold out"
    }

    movieImg.src = movies.poster; 
    movieImg.alt = movies.title; 
    idTitle.innerText = movies.title;
    idRuntime.innerText = movies.runtime + " minutes";
    idFilmInfo.innerText = movies.description;
    idShowtime.innerText = movies.showtime;
    idTicketnum.innerText = remaining;

    byTicket.onclick = () => {
        if(remaining > 0)
        { 
             buyTicket(movies)
        }else{
            console.log("You cannot buy tickets")
        }
    };
    byTicket.dataset.movieId = movies.id;
    let button = document.querySelector(`[data-movie-id="${movieId}"]`);
    button.innerText = availabiity;
}
function buyTicket(movies){
    movies.tickets_sold++
    let ticketsSold = movies.tickets_sold;
    let requestHeaders = {
        "Content-Type": "application/json"
    }
    let requestBody = {
        "tickets_sold": ticketsSold
    }
    fetch(url+movies.id,{
        method: "PATCH",
        headers: requestHeaders,    
        body: JSON.stringify(requestBody)
    })
    .then (res => res.json())
    .then (data => {
        domUpdate(data);

        let numOfTickets = (data.capacity - data.tickets_sold)

        if(!numOfTickets > 0)
        { getMovie()
        }

        let  reqBodyTickets =  {
            "film_id": data.id,
            "number_of_tickets": numOfTickets
         }

        fetch("http://localhost:3000/tickets",{
            method: "POST",
            headers: requestHeaders,    
            body: JSON.stringify(reqBodyTickets)
        })
        .then (res => res.json())
        .then(data => data)
        .catch (e => console.log(e.message));

    })
    .catch (e => console.log(e.message));
}
function removeMovie(movie){
    let requestHeaders = {
        "Content-Type": "application/json"
    }
    let requestBody = {
        "id": movie.id
    }
    fetch(url+movie.id, {
        method: "DELETE",
        headers: requestHeaders,    
        body: JSON.stringify(requestBody)
    })
    .then (res => res.json())
    .then (data => getMovie())
    .catch (e => console.log(e.message));
}




    // document.addEventListener('DOMContentLoaded', function() {

    //  const baseURL = "http://localhost:3000"
    //  function addsMovies(){

    //     fetch(`${baseURL}/films/${[1]}`)
    //     .then(res => res.json())
    //     .then(movie => {
    //         let availableTickets = movie.capacity - movie.tickets_sold

    //         document.getElementById('poster').src = movie.poster 
    //         document.getElementById('title').textContent = movie.title
    //         document.getElementById('runtime').textContent = `Runtime: ${movie.runtime} minutes`
    //         document.getElementById('showtime').textContent = `Showtime: ${movie.showtime}`
    //         document.getElementById('ticket-num').textContent = `Available Tickets: ${availableTickets}`
    //         document.getElementById("film-info").textContent = `${movie.description}`
    //     })
    //     movie.title = addEventListener("click", (event) => {
    //         event.preventDefault()
    //         event.target.movie.id = movie.title
    //         console.log(`Movie ${movie.title} has been clicked`)
    //     })
    //     }

    // function allMovies(){
    //     fetch(`${baseURL}/films`)
    //     .then(res => res.json())
    //     .then(movies => {
    //         let filmsList = document.getElementById("films");

    //         let placeholders = filmsList.querySelector(".placeholder");
    //         if(placeholders){
    //             filmsList.removeChild(placeholders);
    //         }
    //         movies.forEach(movie => {
    //             let li = document.createElement("li");
    //             li.classList.add("film-item");
    //             li.textContent = movie.title;
    //             filmsList.appendChild(li);
    //         })
    //     })
    //     }
    //     function buyTickets(movieId, ticketsSold){
    //         fetch(`${baseURL}/films/${movieId}`,{
    //             method: "PATCH",
    //             headers:{
    //                 "Content-Type": "application/json",

    //             },
    //             body: JSON.stringify({
    //                 tickets_sold: ticketsSold + 1
    //             })
    //         })
    //         .then(res => res.json())
    //         .then(updatedMovie => {
    //             fetch(`${baseURL}/films/tickets`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({
    //                     filmId: movieId,
    //                     numOfTickets: 1
    //                 })
    //             })
    //             .then(res => res.json())
    //             .then(ticket => {
    //                 let ticketsSoldElement = document.getElementById(`tickets-sold-${movieId}`);
    //                 ticketsSoldElement.textContent = updatedMovie.tickets_sold;

    //                 alert("Ticket purchased successfully!");
    //             })
                
    //             })
    //             .catch(error => {
    //                 console.error("An error occurred", error);
    //         })
    //     }
    //     document.addEventListener("click", (e) => {
    //         if(e.target.classList.contains("buy-ticket")){
    //             let movieId = e.target.dataset.movieId;
    //             let ticketsSold = parseInt(e.target.dataset.ticketsSold);
    //             if(ticketsSold < e.target.dataset.capacity){
    //                 buyTickets(movieId, ticketsSold);
    //             }else{
    //                 alert("Sorry, this showing is sold out please")
    //             }
    //         }
    //     })
    //     function deleteFilm(filmId){
    //         fetch(`${baseURL}/films/${filmId}`, {
    //             method: "DELETE",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         })
    //         .then(res =>{
    //             let filmElement = document.getElementById(`film-${filmId}`);
    //             filmElement.remove();
    //         })
    //         // .then(deletedFilm => {
    //         //     let deletedFilmElement = document.getElementById(`film-${filmId}`);
    //         //     deletedFilmElement.remove();
    //         //     alert("Film deleted successfully!");
    //         // })
    //         .catch(error => {
    //             console.error("An error occurred", error);
    //             alert("An error occurred")
    //         })
    //     }
    //     document.addEventListener("click", (e) => {
    //         if(e.target.classList.contains("delete-film")){
    //             let filmId = e.target.dataset.filmId;
    //             let confirmDelete = confirm("Are you sure you want to delete");
    //             if(confirmDelete){
    //                 deleteFilm(filmId);
    //             }
    //         }
    //     })

        
    //         // Function to update film status
    //         function updateFilmStatus(filmId, ticketsSold, capacity) {
    //             const filmElement = document.getElementById(`film-${filmId}`);
    //             if (ticketsSold >= capacity) {
    //                 // If sold out, update film item with sold-out class and change button text
    //                 filmElement.classList.add('sold-out');
    //                 const buyButton = filmElement.querySelector('.buy-ticket-button');
    //                 buyButton.textContent = 'Sold Out';
    //                 buyButton.disabled = true; // Disable button when sold out
    //             } else {
    //                 // If not sold out, remove sold-out class and reset button text
    //                 filmElement.classList.remove('sold-out');
    //                 const buyButton = filmElement.querySelector('.buy-ticket-button');
    //                 buyButton.textContent = 'Buy Ticket';
    //                 buyButton.disabled = false; // Enable button when tickets available
    //             }
    //         }
        
    //         // Function to handle buying a ticket
    //         function buyTicket(filmId) {
    //             // Send POST request to add a ticket
    //             fetch(`${baseURL}/tickets`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     film_id: filmId,
    //                     number_of_tickets: 1, // Assuming only one ticket is bought at a time
    //                 }),
    //             })
    //             .then(response => response.json())
    //             .then(ticket => {
    //                 // Update film status after buying ticket
    //                 updateFilmStatus(ticket.film_id, ticket.tickets_sold, ticket.capacity);
    //             })
    //             .catch(error => {
    //                 console.error('Error buying ticket:', error);
    //                 alert('Error buying ticket. Please try again.');
    //             });
    //         }
        
    //         // Event delegation to handle buy ticket button clicks
    //         document.addEventListener('click', function(event) {
    //             if (event.target.classList.contains('buy-ticket-button')) {
    //                 const filmId = event.target.dataset.filmId;
    //                 buyTicket(film.id);
    //             }
    //         });
        

    // allMovies()
    // addsMovies()
    // // buyTickets()
    // })

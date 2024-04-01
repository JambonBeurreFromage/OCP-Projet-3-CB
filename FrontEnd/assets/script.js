

// Selection des éléments HTML
let gallery = document.querySelector(".gallery")
let showAllBtn = document.getElementById("selectorAll");
let showObjectsBtn = document.getElementById("selectorObject");
let showFlatBtn = document.getElementById("selectorFlat");
let showHotelBtn = document.getElementById("selectorHotel");


//Fontion de création des fiches projets // paramètre : projets à afficher
function createHTML(projects) {
    //Initialise la gallery avec un HTML vierge
    gallery.innerHTML = "";

    //Créer les éléments HTML en fonction du paramètre "projects"
    for (let i = 0; i < projects.length; i++) {
        let figure = document.createElement("figure");
        gallery.appendChild(figure);

        let img = document.createElement("img");
        img.src = projects[i].imageUrl;
        figure.appendChild(img);

        let caption = document.createElement("figcaption");
        caption.innerHTML = projects[i].title;
        figure.appendChild(caption);
    };
    console.log(projects)
};



//Fonction de gestion du filtre
async function filterProjects() { 
    
    // Récupération de la liste sur l'API
    const allProjects = await fetch("http://localhost:5678/api/works/");
    const showAllProjets = await allProjects.json();

    //Affiche tous les projets au premier chargement
    createHTML(showAllProjets);

    //Filtrer les projets
    //Par objets
    showObjectsBtn.addEventListener("click", () => {
        const showObjects = showAllProjets.filter((project) => project.categoryId === 1);
        createHTML (showObjects);
    });


    //Par appartements
    showFlatBtn.addEventListener("click", () => {
        const showFlat = showAllProjets.filter((project) => project.categoryId === 2);
        createHTML (showFlat);
    });

    
    //Par Hotels
    showHotelBtn.addEventListener("click", () => {
        const showHotel = showAllProjets.filter((project) => project.categoryId === 3);
        createHTML (showHotel);
    });
}





filterProjects();   
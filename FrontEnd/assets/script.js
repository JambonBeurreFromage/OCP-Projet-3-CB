

// Selection des éléments HTML
let selectorProject = document.querySelector(".selectorProject");
let gallery = document.querySelector(".gallery");
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


//Fonction de changement de classe // Paramètre : Bouton selectionné
function changeClass(btnSelect) {
    //Réinitialise la classe montrant la selection du filtre
    showAllBtn.classList.remove("selectorProjectSelect");
    showObjectsBtn.classList.remove("selectorProjectSelect");
    showFlatBtn.classList.remove("selectorProjectSelect");
    showHotelBtn.classList.remove("selectorProjectSelect");

    if (btnSelect === showAllBtn) {
        showAllBtn.classList.add("selectorProjectSelect");

    } else if (btnSelect === showObjectsBtn) {
        showObjectsBtn.classList.add("selectorProjectSelect");
    
    } else if (btnSelect === showFlatBtn) {
        showFlatBtn.classList.add("selectorProjectSelect");

    } else if (btnSelect === showHotelBtn) {
        showHotelBtn.classList.add("selectorProjectSelect");
    }
};


//Fonction de gestion du filtre
async function filterProjects() { 
    
    // Récupération de la liste sur l'API
    const allProjects = await fetch("http://localhost:5678/api/works/");
    const showAllProjets = await allProjects.json();

    // //Création du filtre dynamique. Voir pour récupérer la valeur name de category
    const filterSet = new Set();

    console.log(showAllProjets.length)

    for (i = 0; i < showAllProjets.length; i++) {

        filterSet.add(showAllProjets[i].category)
    }
    console.log(filterSet)
    console.log(showAllProjets.category)

    //Affiche tous les projets au premier chargement
    createHTML(showAllProjets);

    //Filtrer les projets
    //Tous afficher
    showAllBtn.addEventListener("click", () => {
        changeClass(showAllBtn);
        createHTML(showAllProjets);
    });

    //Par objets
    showObjectsBtn.addEventListener("click", () => {
        const showObjects = showAllProjets.filter((project) => project.categoryId === 1);
        changeClass(showObjectsBtn);
        createHTML(showObjects);
    });


    //Par appartements
    showFlatBtn.addEventListener("click", () => {
        const showFlat = showAllProjets.filter((project) => project.categoryId === 2);
        changeClass(showFlatBtn);
        createHTML (showFlat);
    });

    
    //Par Hotels
    showHotelBtn.addEventListener("click", () => {
        const showHotel = showAllProjets.filter((project) => project.categoryId === 3);
        changeClass(showHotelBtn);
        createHTML (showHotel);
    });
}





filterProjects();   
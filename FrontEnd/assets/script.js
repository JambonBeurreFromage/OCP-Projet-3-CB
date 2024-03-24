let showAll = document.getElementById("selectorAll");

showAll.addEventListener("click", async () => {
    const allProjects = await fetch("http://localhost:5678/api/works/");
    const showAllProjets = await allProjects.json();
    console.log(showAllProjets);    
    });
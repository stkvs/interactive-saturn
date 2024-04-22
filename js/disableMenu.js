const menu = document.querySelector(".info-container");
const text = document.querySelector(".text-toggled");

menu.style.display = "flex";
menu.style.opacity = 1;
text.style.opacity = 0.75;

menu.style.transition = "250ms ease-in-out";
text.style.transition = "250ms ease-in-out";

menu.addEventListener("click", () =>{
    menu.style.opacity = 0;
    text.style.opacity = 0;

    setTimeout(()=>{
        text.style.display = "none";
        menu.style.display = "none";
    }, 125)
});
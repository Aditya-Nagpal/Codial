let likeButtonsForm=document.getElementsByClassName('like_button');
for(let form of likeButtonsForm){
    let count=form.children[0];
    let button=form.children[1];
    let icon=button.children[0];
    button.addEventListener('click', function(event){
        let state=button.getAttribute('state');
        if(state === "false"){
            count.innerHTML=(Number(count.innerHTML)+1).toString();
            icon.style.color="blue";
            button.setAttribute('state','true');
        }
        else{
            count.innerHTML=(Number(count.innerHTML)-1).toString();
            icon.style.color="black";
            button.setAttribute('state','false');
        }
    });
}
class ToggleLike{
    constructor(toggleElement){
        this.toggler=toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self=this;
            $.ajax({
                type: 'POST',
                url: $(self).attr('href')
            })
            .done(function(data){
                let likesCnt=parseInt($(self).attr('data-likes'));
                if(data.data.deleted == true){
                    likesCnt-=1;
                } else{
                    likesCnt++;
                }
                let type=$(self).attr('type');
                $(self).attr('data-likes', likesCnt);
                if(type === "Post"){
                    $(self).html(`<span>${likesCnt}</span> <i class="fa-regular fa-xl fa-thumbs-up"></i>`);
                } else{
                    $(self).html(`<span>${likesCnt}</span> <i class="fa-regular fa-thumbs-up"></i>`);
                }
            })
            .fail(function(errData){
                console.log('error in completing the request');
            });
        });
    }
};
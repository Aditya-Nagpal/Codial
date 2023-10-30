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
                console.log(likesCnt);
                if(data.data.deleted == true){
                    likesCnt-=1;
                } else{
                    likesCnt++;
                }
                $(self).attr('data-likes', likesCnt);
                $(self).html(`${likesCnt} <i class="fa-regular fa-xl fa-thumbs-up"></i>`);
            })
            .fail(function(errData){
                console.log('error in completing the request');
            });
        });
    }
};
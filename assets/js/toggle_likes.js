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
                    let postId=$(self).attr('postId');
                    $(`#post-${postId}-likes`).html(`Likes: ${likesCnt}`);
                } else{
                    let commentId=$(self).attr('commentId');
                    $(`#comment-${commentId}-likes`).html(`Likes: ${likesCnt}`);
                }
            })
            .fail(function(errData){
                console.log('error in completing the request', errData);
            });
        });
    }
};
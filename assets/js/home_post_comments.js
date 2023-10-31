class PostComments{

    constructor(postId){
        this.postId=postId;
        this.postContainer=$(`#post-${postId}`);
        this.newCommentForm=$(`#post-${postId}-comments-form`);
        this.createComment(postId);

        let self=this;
        $(' .delete-comment-button', this.postContainer).each(function (){
            self.deleteComment($(this));
        });
    }

    createComment(postId){
        let pself=this;
        this.newCommentForm.submit(function(e){
            let self=this;
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    console.log(data);
                    let newComment=pself.newCommentDOM(data.data.comment);
                    $(`#post-comments-${postId}`).append(newComment);
                    pself.deleteComment($(' .delete-comment-button', newComment));
                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    };

    newCommentDOM(comment){
        return $(`<li id="comment-${comment._id}">
                        <p> 
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                            </small>
                            ${comment.content} : 
                            <small>${comment.user.name}</small>
                            <small>
                                <% if(locals.user){ %> 
                                    ${comment.likes.length}
                                    <a class="toggle-like-button" type="Comment" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                        <i class="fa-regular fa-thumbs-up"></i>
                                    </a>
                            </small>
                        </p>
                    </li>`)
    };

    deleteComment(deleteLink){
        $(deleteLink).click(function (e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        })
    };


}
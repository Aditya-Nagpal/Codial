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
    };

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
                    let newComment=pself.newCommentDOM(data.data.comment);
                    $(`#post-comments-${postId}`).append(newComment);
                    if($(`#post-comments-${postId} li`).length){
                        $(`#post-comments-${postId} small`).addClass('hide');
                    }
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
        let img_url="/images/default-dp.jpg";
        if(comment.user.avatar){
            img_url=comment.user.avatar;
        }
        return $(`<li id="comment-${comment._id}" class="comment">
                        <div class="comment-user-pic">
                            <img src=${img_url} />
                        </div>
                        <div>
                            <p class="comment-user-name">${comment.user.name}</p>
                            <p class="comment-content">${comment.content}</p>
                            <div class="comment-options">
                                <span id="comment-${comment._id}-likes">Likes: ${comment.likes.length}</span>
                                <div>
                                    <a class="toggle-like-button" type="Comment" data-likes="${comment.likes.length}" href="/likes/toggle/?id=${comment._id}&type=Comment" commentId="${comment._id}">
                                        <button type="button" class="pointer" style="margin-right: 60px;"><i class="fa-regular fa-thumbs-up"></i></button>
                                    </a>
                                    <span>
                                        <a class="delete-comment-button" href="/comments/destroy/${comment._id}" postId="${comment.post._id}">delete</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>`);
    }

    deleteComment(deleteLink){
        $(deleteLink).click(function (e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    let postId=$(deleteLink).attr('postId');
                    if(!$(`#post-comments-${postId} li`).length){
                        $(`#post-comments-${postId} small`).removeClass('hide');
                    }
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